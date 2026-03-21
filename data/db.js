const path = require('path');
const Database = require('better-sqlite3');

const dbPath = path.join(__dirname, 'leadflow.db');
const db = new Database(dbPath);

db.pragma('journal_mode = WAL');

db.exec(`
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  plan TEXT NOT NULL DEFAULT 'Free',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS lead_generation_runs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  niche TEXT NOT NULL,
  location TEXT NOT NULL,
  service_offer TEXT NOT NULL,
  target_business_type TEXT NOT NULL,
  keywords TEXT NOT NULL,
  tone TEXT NOT NULL,
  status TEXT NOT NULL,
  leads_generated INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS leads (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  run_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  business_name TEXT NOT NULL,
  website TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  phone TEXT NOT NULL,
  niche TEXT NOT NULL,
  notes TEXT NOT NULL,
  lead_score INTEGER NOT NULL,
  outreach_subject TEXT NOT NULL,
  outreach_body TEXT NOT NULL,
  follow_up_body TEXT NOT NULL,
  contacted INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(run_id) REFERENCES lead_generation_runs(id),
  FOREIGN KEY(user_id) REFERENCES users(id)
);
`);

module.exports = db;
