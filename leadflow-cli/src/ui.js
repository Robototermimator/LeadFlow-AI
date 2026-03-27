const fs = require('fs');

const colors = {
  reset: '\x1b[0m',
  cyan: '\x1b[36m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  bold: '\x1b[1m'
};

function supportsColor() {
  return process.stdout.isTTY && process.env.NO_COLOR !== '1';
}

function paint(text, color) {
  if (!supportsColor()) return text;
  return `${colors[color] || ''}${text}${colors.reset}`;
}

function header() {
  return [
    '========================================',
    ' LeadFlow CLI v2',
    ' AI Client Acquisition System',
    '========================================'
  ].join('\n');
}

function printHeader() {
  process.stdout.write(`${paint(header(), 'cyan')}\n`);
}

function info(message) {
  process.stdout.write(`${message}\n`);
}

function success(message) {
  process.stdout.write(`${paint('✓', 'green')} ${message}\n`);
}

function warn(message) {
  process.stdout.write(`${paint('!', 'yellow')} ${message}\n`);
}

function error(message) {
  process.stderr.write(`${paint('Error:', 'red')} ${message}\n`);
}

function divider() {
  process.stdout.write('----------------------------------------\n');
}

function printPreview(leads, limit = 3) {
  const preview = leads.slice(0, limit);
  if (!preview.length) return;
  divider();
  info(paint('Preview', 'bold'));
  preview.forEach((lead, i) => {
    info(`${i + 1}. ${lead.businessName} (${lead.leadScore}/100)`);
    info(`   Email: ${lead.contactEmail}`);
    info(`   Problem: ${lead.detectedProblems[0]}`);
    info(`   Offer: ${lead.suggestedOffer}`);
  });
}

function safeWrite(filePath, content) {
  fs.writeFileSync(filePath, content, 'utf8');
}

module.exports = {
  printHeader,
  info,
  success,
  warn,
  error,
  divider,
  printPreview,
  safeWrite,
  paint
};
