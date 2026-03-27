const fs = require('fs');
const { resolveDataPath } = require('./paths');
const { detectProblems, suggestImprovements, suggestOffer } = require('./intelligence');
const { outreachEmail, followUpEmail } = require('./emailEngine');
const { scoreLead } = require('./scoring');

function loadJson(fileName) {
  const filePath = resolveDataPath(fileName);
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function slug(value) {
  return String(value || '').toLowerCase().replace(/[^a-z0-9]/g, '');
}

function pick(list, seed) {
  return list[seed % list.length];
}

function buildPhone(seed) {
  return `+1-555-${String((seed % 900) + 100)}-${String((seed * 17) % 9000 + 1000)}`;
}

function makeLead(input, index, dictionaries) {
  const seed = Math.abs((input.niche + input.location + input.service).split('').reduce((a, c) => a + c.charCodeAt(0), 0) + index * 37);
  const prefix = pick(dictionaries.prefixes, seed);
  const suffix = pick(dictionaries.suffixes, seed * 3);
  const district = pick(dictionaries.districts, seed * 5);
  const first = pick(dictionaries.firstNames, seed * 7);
  const businessName = `${district} ${prefix} ${input.niche.replace(/s$/i, '')} ${suffix}`;
  const domain = `${slug(input.niche)}${(seed % 777) + 100}.com`;
  const contactEmail = `hello@${domain}`;

  const detectedProblems = detectProblems(input);
  const improvements = suggestImprovements(input);
  const suggestedOffer = suggestOffer(input);
  const leadScore = scoreLead({ ...input, index });

  const lead = {
    id: index + 1,
    businessName,
    website: `https://www.${domain}`,
    contactName: first,
    contactEmail,
    phone: buildPhone(seed),
    niche: input.niche,
    location: input.location,
    service: input.service,
    detectedProblems,
    suggestedImprovements: improvements,
    suggestedOffer,
    leadScore,
    mode: input.mode
  };

  const outreach = outreachEmail(lead, input);
  lead.outreachSubject = outreach.subject;
  lead.outreachEmail = outreach.body;
  lead.followUpEmail = followUpEmail(lead, input);

  return lead;
}

function generateLeads(input) {
  const dictionaries = {
    ...loadJson('niches.json'),
    ...loadJson('templates.json')
  };

  const leads = [];
  for (let i = 0; i < input.count; i += 1) {
    leads.push(makeLead(input, i, dictionaries));
  }
  return leads;
}

module.exports = { generateLeads };
