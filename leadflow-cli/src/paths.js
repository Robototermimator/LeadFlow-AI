const path = require('path');
const fs = require('fs');

function getProjectRoot() {
  if (process.pkg) {
    return path.dirname(process.execPath);
  }
  return path.join(__dirname, '..');
}

function getSnapshotRoot() {
  if (process.pkg) {
    return path.join(__dirname, '..');
  }
  return getProjectRoot();
}

function resolveDataPath(fileName) {
  return path.join(getSnapshotRoot(), 'data', fileName);
}

function resolveOutputPath(outputArg) {
  const fallback = 'leads.csv';
  const target = outputArg ? String(outputArg) : fallback;
  return path.resolve(process.cwd(), target);
}

function ensureParentDir(filePath) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

module.exports = {
  getProjectRoot,
  getSnapshotRoot,
  resolveDataPath,
  resolveOutputPath,
  ensureParentDir
};
