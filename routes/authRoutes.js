const express = require('express');
const bcrypt = require('bcrypt');
const db = require('../data/db');
const { requireAuth } = require('../utils/auth');

const router = express.Router();

router.get('/register', (req, res) => {
  res.render('register', { title: 'Register', error: null, old: {} });
});

router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password || password.length < 6) {
    return res.status(400).render('register', { title: 'Register', error: 'Enter valid details. Password must be at least 6 characters.', old: req.body });
  }

  const exists = db.prepare('SELECT id FROM users WHERE email = ?').get(email.toLowerCase());
  if (exists) {
    return res.status(400).render('register', { title: 'Register', error: 'Email already registered.', old: req.body });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const info = db.prepare('INSERT INTO users (name, email, password_hash, plan) VALUES (?, ?, ?, ?)').run(name.trim(), email.toLowerCase(), passwordHash, 'Free');
  req.session.user = { id: info.lastInsertRowid, name: name.trim(), email: email.toLowerCase(), plan: 'Free' };
  return res.redirect('/app/dashboard');
});

router.get('/login', (req, res) => {
  res.render('login', { title: 'Login', error: null });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = db.prepare('SELECT * FROM users WHERE email = ?').get((email || '').toLowerCase());
  if (!user) {
    return res.status(400).render('login', { title: 'Login', error: 'Invalid email or password.' });
  }

  const ok = await bcrypt.compare(password || '', user.password_hash);
  if (!ok) {
    return res.status(400).render('login', { title: 'Login', error: 'Invalid email or password.' });
  }

  req.session.user = { id: user.id, name: user.name, email: user.email, plan: user.plan };
  return res.redirect('/app/dashboard');
});

router.post('/logout', requireAuth, (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
});

module.exports = router;
