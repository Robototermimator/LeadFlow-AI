const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
  res.render('home', { title: 'LeadFlow AI', user: req.session.user });
});

router.get('/features', (req, res) => {
  res.render('features', { title: 'Features', user: req.session.user });
});

router.get('/pricing', (req, res) => {
  res.render('pricing', { title: 'Pricing', user: req.session.user });
});

module.exports = router;
