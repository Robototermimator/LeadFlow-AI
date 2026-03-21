const express = require('express');
const db = require('../data/db');
const { requireAuth } = require('../utils/auth');
const { generateLeads } = require('../services/leadGenerator');
const { getPlanLimits, getMonthStartISO } = require('../utils/plans');
const { leadsToCsv } = require('../utils/csv');

const router = express.Router();
router.use(requireAuth);

function refreshSessionUser(req) {
  const user = db.prepare('SELECT id, name, email, plan FROM users WHERE id = ?').get(req.session.user.id);
  req.session.user = user;
  return user;
}

router.get('/dashboard', (req, res) => {
  const user = refreshSessionUser(req);
  const monthStart = getMonthStartISO();
  const totalLeads = db.prepare('SELECT COUNT(*) as c FROM leads WHERE user_id = ?').get(user.id).c;
  const totalRuns = db.prepare('SELECT COUNT(*) as c FROM lead_generation_runs WHERE user_id = ?').get(user.id).c;
  const contacted = db.prepare('SELECT COUNT(*) as c FROM leads WHERE user_id = ? AND contacted = 1').get(user.id).c;
  const recentRuns = db.prepare('SELECT * FROM lead_generation_runs WHERE user_id = ? ORDER BY id DESC LIMIT 5').all(user.id);
  const monthRuns = db.prepare('SELECT COUNT(*) as c FROM lead_generation_runs WHERE user_id = ? AND created_at >= ?').get(user.id, monthStart).c;
  const limits = getPlanLimits(user.plan);

  res.render('dashboard', {
    title: 'Dashboard',
    user,
    stats: { totalLeads, totalRuns, contacted, monthRuns, limits },
    recentRuns
  });
});

router.get('/generate', (req, res) => {
  const user = refreshSessionUser(req);
  res.render('generate', { title: 'Generate Leads', user, error: null, success: null, results: [], form: {} });
});

router.post('/generate', async (req, res) => {
  const user = refreshSessionUser(req);
  const form = {
    niche: (req.body.niche || '').trim(),
    location: (req.body.location || '').trim(),
    service_offer: (req.body.service_offer || '').trim(),
    target_business_type: (req.body.target_business_type || '').trim(),
    keywords: (req.body.keywords || '').trim(),
    tone: (req.body.tone || '').trim(),
    count: Number(req.body.count || 10)
  };

  if (Object.values(form).some((v) => v === '' || Number.isNaN(v))) {
    return res.status(400).render('generate', { title: 'Generate Leads', user, error: 'All fields are required.', success: null, results: [], form });
  }

  const limits = getPlanLimits(user.plan);
  const monthRuns = db.prepare('SELECT COUNT(*) as c FROM lead_generation_runs WHERE user_id = ? AND created_at >= ?').get(user.id, getMonthStartISO()).c;
  if (monthRuns >= limits.runsPerMonth) {
    return res.status(400).render('generate', { title: 'Generate Leads', user, error: `Monthly run limit reached for ${user.plan} plan.`, success: null, results: [], form });
  }

  if (form.count < 1 || form.count > limits.maxLeadsPerRun) {
    return res.status(400).render('generate', { title: 'Generate Leads', user, error: `Lead count must be between 1 and ${limits.maxLeadsPerRun} for ${user.plan} plan.`, success: null, results: [], form });
  }

  const runInfo = db.prepare(`INSERT INTO lead_generation_runs (user_id, niche, location, service_offer, target_business_type, keywords, tone, status, leads_generated)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`)
    .run(user.id, form.niche, form.location, form.service_offer, form.target_business_type, form.keywords, form.tone, 'processing', 0);

  const runId = runInfo.lastInsertRowid;

  try {
    const generated = await generateLeads(form, form.count);
    const insertLead = db.prepare(`INSERT INTO leads (run_id, user_id, business_name, website, contact_email, phone, niche, notes, lead_score, outreach_subject, outreach_body, follow_up_body, contacted)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)`);

    const tx = db.transaction((leads) => {
      leads.forEach((lead) => {
        insertLead.run(runId, user.id, lead.business_name, lead.website, lead.contact_email, lead.phone, lead.niche, lead.notes, lead.lead_score, lead.outreach_subject, lead.outreach_body, lead.follow_up_body);
      });
    });

    tx(generated.leads);
    db.prepare('UPDATE lead_generation_runs SET status = ?, leads_generated = ? WHERE id = ?').run('completed', generated.leads.length, runId);

    const successMessage = `Generated ${generated.leads.length} leads successfully.${generated.demoMode ? ' Demo mode active (no API key).' : ''}`;
    return res.render('generate', {
      title: 'Generate Leads',
      user,
      error: null,
      success: generated.warning ? `${successMessage} ${generated.warning}` : successMessage,
      results: generated.leads,
      form
    });
  } catch (err) {
    db.prepare('UPDATE lead_generation_runs SET status = ? WHERE id = ?').run('failed', runId);
    return res.status(500).render('generate', { title: 'Generate Leads', user, error: `Generation failed: ${err.message}`, success: null, results: [], form });
  }
});

router.get('/leads', (req, res) => {
  const user = refreshSessionUser(req);
  const q = (req.query.q || '').toString().trim();
  const contacted = (req.query.contacted || 'all').toString();
  const sort = (req.query.sort || 'score_desc').toString();

  let sql = 'SELECT * FROM leads WHERE user_id = ?';
  const params = [user.id];

  if (q) {
    sql += ' AND business_name LIKE ?';
    params.push(`%${q}%`);
  }

  if (contacted === 'yes') sql += ' AND contacted = 1';
  if (contacted === 'no') sql += ' AND contacted = 0';

  if (sort === 'score_asc') sql += ' ORDER BY lead_score ASC';
  else if (sort === 'newest') sql += ' ORDER BY id DESC';
  else sql += ' ORDER BY lead_score DESC';

  const leads = db.prepare(sql).all(...params);
  res.render('leads', { title: 'Leads', user, leads, filters: { q, contacted, sort } });
});

router.post('/leads/:id/contacted', (req, res) => {
  const user = refreshSessionUser(req);
  const id = Number(req.params.id);
  db.prepare('UPDATE leads SET contacted = CASE WHEN contacted = 1 THEN 0 ELSE 1 END WHERE id = ? AND user_id = ?').run(id, user.id);
  res.redirect('/app/leads');
});

router.get('/leads/export.csv', (req, res) => {
  const user = refreshSessionUser(req);
  const leads = db.prepare('SELECT * FROM leads WHERE user_id = ? ORDER BY id DESC').all(user.id);
  const csv = leadsToCsv(leads);
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="leadflow-leads.csv"');
  res.send(csv);
});

router.get('/runs', (req, res) => {
  const user = refreshSessionUser(req);
  const runs = db.prepare('SELECT * FROM lead_generation_runs WHERE user_id = ? ORDER BY id DESC').all(user.id);
  res.render('runs', { title: 'Run History', user, runs });
});

router.get('/billing', (req, res) => {
  const user = refreshSessionUser(req);
  const limits = getPlanLimits(user.plan);
  res.render('billing', { title: 'Billing', user, limits, message: null });
});

router.post('/billing/plan', (req, res) => {
  const allowed = ['Free', 'Pro', 'Agency'];
  const nextPlan = req.body.plan;
  const user = refreshSessionUser(req);

  if (!allowed.includes(nextPlan)) {
    const limits = getPlanLimits(user.plan);
    return res.status(400).render('billing', { title: 'Billing', user, limits, message: 'Invalid plan selected.' });
  }

  db.prepare('UPDATE users SET plan = ? WHERE id = ?').run(nextPlan, user.id);
  const updated = refreshSessionUser(req);
  return res.render('billing', {
    title: 'Billing',
    user: updated,
    limits: getPlanLimits(updated.plan),
    message: `Plan updated to ${updated.plan}. Payment integration placeholder complete for future Stripe/PayPal hookup.`
  });
});

router.get('/settings', (req, res) => {
  const user = refreshSessionUser(req);
  const monthRuns = db.prepare('SELECT COUNT(*) as c FROM lead_generation_runs WHERE user_id = ? AND created_at >= ?').get(user.id, getMonthStartISO()).c;
  const monthLeads = db.prepare('SELECT COUNT(*) as c FROM leads WHERE user_id = ? AND created_at >= ?').get(user.id, getMonthStartISO()).c;
  res.render('settings', {
    title: 'Settings',
    user,
    usage: {
      monthRuns,
      monthLeads,
      limits: getPlanLimits(user.plan),
      demoMode: !process.env.OPENAI_API_KEY
    },
    message: null
  });
});

router.post('/settings/delete-account', (req, res) => {
  const user = refreshSessionUser(req);
  const tx = db.transaction(() => {
    db.prepare('DELETE FROM leads WHERE user_id = ?').run(user.id);
    db.prepare('DELETE FROM lead_generation_runs WHERE user_id = ?').run(user.id);
    db.prepare('DELETE FROM users WHERE id = ?').run(user.id);
  });
  tx();
  req.session.destroy(() => {
    res.redirect('/');
  });
});

module.exports = router;
