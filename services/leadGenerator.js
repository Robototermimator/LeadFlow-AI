const OpenAI = require('openai');

const prefixes = ['Prime', 'Urban', 'Summit', 'Blue', 'Trusted', 'Maple', 'Core', 'Pioneer'];
const suffixes = ['Studio', 'Solutions', 'Partners', 'Care', 'Group', 'Experts', 'Works', 'Hub'];

function hashCode(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i += 1) hash = (hash << 5) - hash + str.charCodeAt(i);
  return Math.abs(hash);
}

function buildMockLeads(input, count) {
  const seed = hashCode(`${input.niche}|${input.location}|${input.service_offer}|${input.keywords}`);
  const cleanedNiche = input.niche.replace(/[^a-zA-Z0-9]/g, '').toLowerCase() || 'business';

  return Array.from({ length: count }, (_, i) => {
    const idx = i + 1;
    const p = prefixes[(seed + i) % prefixes.length];
    const s = suffixes[(seed + i * 3) % suffixes.length];
    const area = input.location.split(',')[0].trim();
    const businessName = `${area} ${p} ${input.niche.replace(/s$/i, '')} ${s}`;
    const domain = `${cleanedNiche}${(seed + i) % 900 + 100}.com`;
    const leadScore = Math.max(45, Math.min(96, 58 + ((seed + i * 7) % 38)));

    return {
      business_name: businessName,
      website: `https://www.${domain}`,
      contact_email: `hello@${domain}`,
      phone: `+1-555-${String((seed + i * 11) % 900 + 100)}-${String((seed + i * 17) % 9000 + 1000)}`,
      niche: input.niche,
      notes: `Strong match: ${input.target_business_type} in ${input.location} likely needs ${input.service_offer}. Signal keywords: ${input.keywords}.`,
      lead_score: leadScore,
      outreach_subject: `${businessName}: quick idea to improve ${input.niche} bookings`,
      outreach_body: `Hi ${businessName} team,\n\nI reviewed your online presence and noticed opportunities around ${input.keywords}. I help ${input.target_business_type} improve outcomes with ${input.service_offer}.\n\nWould you like a 10-minute walkthrough with 3 practical improvements tailored to ${input.location}?\n\nBest,\nLeadFlow AI User`,
      follow_up_body: `Hi again,\n\nJust following up in case my earlier note got buried. I can share a quick action plan to help ${businessName} capture more qualified leads this month.\n\nOpen to seeing it?`
    };
  });
}

async function buildOpenAiLeads(input, count) {
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const prompt = `Generate ${count} realistic local business leads for the following:\n- niche: ${input.niche}\n- location: ${input.location}\n- service offer: ${input.service_offer}\n- target business type: ${input.target_business_type}\n- keywords: ${input.keywords}\n- tone: ${input.tone}\n\nReturn strict JSON only: {"leads":[{"business_name":"","website":"","contact_email":"","phone":"","niche":"","notes":"","lead_score":0,"outreach_subject":"","outreach_body":"","follow_up_body":""}]}`;

  const result = await client.responses.create({
    model: 'gpt-4.1-mini',
    input: prompt
  });

  const raw = result.output_text || '{"leads":[]}';
  const parsed = JSON.parse(raw);
  if (!parsed.leads || !Array.isArray(parsed.leads)) throw new Error('Invalid AI response format');

  return parsed.leads.slice(0, count).map((lead) => ({
    business_name: String(lead.business_name || 'Unknown Business'),
    website: String(lead.website || 'https://example.com'),
    contact_email: String(lead.contact_email || 'hello@example.com'),
    phone: String(lead.phone || '+1-555-010-0000'),
    niche: String(lead.niche || input.niche),
    notes: String(lead.notes || ''),
    lead_score: Math.max(1, Math.min(100, Number(lead.lead_score || 60))),
    outreach_subject: String(lead.outreach_subject || 'Quick growth idea'),
    outreach_body: String(lead.outreach_body || ''),
    follow_up_body: String(lead.follow_up_body || '')
  }));
}

async function generateLeads(input, count) {
  const demoMode = !process.env.OPENAI_API_KEY;
  if (demoMode) {
    return { demoMode: true, leads: buildMockLeads(input, count) };
  }

  try {
    const leads = await buildOpenAiLeads(input, count);
    return { demoMode: false, leads };
  } catch (err) {
    return { demoMode: true, leads: buildMockLeads(input, count), warning: `AI unavailable, used demo mode: ${err.message}` };
  }
}

module.exports = { generateLeads };
