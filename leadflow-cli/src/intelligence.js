function detectProblems({ niche, service, keywords, mode }) {
  const k = String(keywords || '').trim();
  const base = [
    `Inconsistent ${niche} lead flow across online channels`,
    `Messaging does not clearly position ${service}`,
    'No strong conversion path from website visitors to booked calls'
  ];

  if (k) {
    base.unshift(`Observed keyword risk area: ${k}`);
  }

  if (mode === 'deep') {
    base.push('Local search visibility is weak for high-intent queries');
    base.push('Follow-up cadence likely too slow to recover warm prospects');
  }

  if (mode === 'aggressive') {
    base.push('Competitors are likely capturing demand due to faster outreach');
  }

  return base;
}

function suggestImprovements({ location, service, mode }) {
  const improvements = [
    `Launch a localized offer page targeting ${location}`,
    `Implement clear CTA flow focused on ${service}`,
    'Add 3-step outreach + follow-up sequence for unresponsive prospects'
  ];

  if (mode !== 'quick') {
    improvements.push('Create segmented messaging for new vs returning prospects');
  }

  if (mode === 'aggressive') {
    improvements.push('Run a fast 14-day acquisition sprint with daily outbound');
  }

  return improvements;
}

function suggestOffer({ service, niche, mode }) {
  if (mode === 'aggressive') return `${service} Growth Sprint for ${niche} (14-day quick wins)`;
  if (mode === 'deep') return `${service} + Conversion Optimization Retainer for ${niche}`;
  return `${service} Starter Package for ${niche}`;
}

module.exports = { detectProblems, suggestImprovements, suggestOffer };
