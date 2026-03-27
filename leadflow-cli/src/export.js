const path = require('path');

function toJson(leads) {
  return JSON.stringify({ generatedAt: new Date().toISOString(), total: leads.length, leads }, null, 2);
}

function esc(value) {
  return `"${String(value ?? '').replace(/"/g, '""')}"`;
}

function toCsv(leads) {
  const headers = [
    'id',
    'businessName',
    'website',
    'contactName',
    'contactEmail',
    'phone',
    'niche',
    'location',
    'service',
    'leadScore',
    'mode',
    'suggestedOffer',
    'detectedProblems',
    'suggestedImprovements',
    'outreachSubject',
    'outreachEmail',
    'followUpEmail'
  ];

  const rows = leads.map((lead) => [
    lead.id,
    lead.businessName,
    lead.website,
    lead.contactName,
    lead.contactEmail,
    lead.phone,
    lead.niche,
    lead.location,
    lead.service,
    lead.leadScore,
    lead.mode,
    lead.suggestedOffer,
    lead.detectedProblems.join(' | '),
    lead.suggestedImprovements.join(' | '),
    lead.outreachSubject,
    lead.outreachEmail,
    lead.followUpEmail
  ]);

  return [headers.map(esc).join(','), ...rows.map((r) => r.map(esc).join(','))].join('\n');
}

function inferFormat(outputPath) {
  const ext = path.extname(outputPath || '').toLowerCase();
  if (ext === '.json') return 'json';
  return 'csv';
}

module.exports = { toJson, toCsv, inferFormat };
