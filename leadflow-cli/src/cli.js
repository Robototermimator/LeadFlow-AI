const path = require('path');
const { generateLeads } = require('./generator');
const { toCsv, toJson, inferFormat } = require('./export');
const { printHeader, info, success, warn, error, printPreview, safeWrite } = require('./ui');

const VERSION = '2.0.0';
const MODES = ['quick', 'deep', 'aggressive'];

function helpText() {
  return `Usage:
  leadflow generate --niche "dentists" --location "Cape Town" [options]

Commands:
  generate                Generate leads offline

Options:
  --niche <value>         Business type (required)
  --location <value>      Area/city to target (required)
  --service <value>       Your service offer (default: "website redesign")
  --count <number>        Number of leads (default: 10)
  --mode <type>           quick | deep | aggressive (default: quick)
  --output <file>         Output file path (default: ./leads.csv)
  --help                  Show help
  --version               Show version

Examples:
  leadflow generate --niche "dentists" --location "Cape Town"
  leadflow generate --niche "law firms" --location "Austin" --service "SEO" --count 30 --mode deep --output leads.json
  leadflow generate --niche "roofers" --location "Miami" --service "Google Ads" --mode aggressive --output ./exports/roofers.csv`;
}

function parseArgs(args) {
  const result = { _: [] };
  let i = 0;
  while (i < args.length) {
    const token = args[i];
    if (token.startsWith('--')) {
      const key = token.slice(2);
      const next = args[i + 1];
      if (!next || next.startsWith('--')) {
        result[key] = true;
      } else {
        result[key] = next;
        i += 1;
      }
    } else {
      result._.push(token);
    }
    i += 1;
  }
  return result;
}

function requireValue(name, value) {
  if (!value || String(value).trim() === '') {
    error(`Missing --${name}`);
    info('Try: leadflow generate --help');
    process.exit(1);
  }
}

function runGenerate(parsed) {
  requireValue('niche', parsed.niche);
  requireValue('location', parsed.location);

  const mode = String(parsed.mode || 'quick').toLowerCase();
  if (!MODES.includes(mode)) {
    error(`Invalid --mode "${mode}". Use quick, deep, or aggressive.`);
    process.exit(1);
  }

  const count = Number(parsed.count || 10);
  if (!Number.isInteger(count) || count < 1 || count > 5000) {
    error('Invalid --count. Use a number between 1 and 5000.');
    process.exit(1);
  }

  const service = String(parsed.service || 'website redesign');
  const output = path.resolve(process.cwd(), String(parsed.output || 'leads.csv'));

  printHeader();
  info('Generating leads...');

  const leads = generateLeads({
    niche: String(parsed.niche),
    location: String(parsed.location),
    service,
    mode,
    count,
    keywords: String(parsed.keywords || '')
  });

  success('Leads generated');
  printPreview(leads, 3);

  const format = inferFormat(output);
  const content = format === 'json' ? toJson(leads) : toCsv(leads);
  safeWrite(output, content);

  success(`${leads.length} leads generated`);
  success(`Saved to ${output}`);
}

function run(argv) {
  const parsed = parseArgs(argv);
  const command = parsed._[0];

  if (parsed.version || command === '--version' || command === '-v') {
    process.stdout.write(`${VERSION}\n`);
    return;
  }

  if (parsed.help || command === '--help' || command === '-h' || !command) {
    printHeader();
    process.stdout.write(`${helpText()}\n`);
    return;
  }

  if (command !== 'generate') {
    error(`Unknown command: ${command}`);
    info('Try: leadflow --help');
    process.exit(1);
  }

  if (parsed.help && command === 'generate') {
    printHeader();
    process.stdout.write(`${helpText()}\n`);
    return;
  }

  runGenerate(parsed);
}

module.exports = { run, helpText };
