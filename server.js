require('dotenv').config();
const path = require('path');
const express = require('express');
const session = require('express-session');
const db = require('./data/db');
const publicRoutes = require('./routes/publicRoutes');
const authRoutes = require('./routes/authRoutes');
const appRoutes = require('./routes/appRoutes');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/css', express.static(path.join(__dirname, 'public/css')));
app.use('/js', express.static(path.join(__dirname, 'public/js')));

app.use(session({
  secret: process.env.SESSION_SECRET || 'leadflow-dev-secret-change-me',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 1000 * 60 * 60 * 24 * 7
  }
}));

app.use((req, res, next) => {
  res.locals.currentUser = req.session.user || null;
  next();
});

app.use(publicRoutes);
app.use(authRoutes);
app.use('/app', appRoutes);

app.use((req, res) => {
  res.status(404).render('404', { title: 'Not Found', user: req.session.user || null });
});

const port = Number(process.env.PORT || 3000);
app.listen(port, '0.0.0.0', () => {
  db.prepare('SELECT 1').get();
  console.log(`LeadFlow AI running on http://0.0.0.0:${port}`);
});
