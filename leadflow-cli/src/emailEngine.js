function outreachEmail(lead, input) {
  const subject = `${lead.businessName}: quick ${input.service} idea for ${input.location}`;
  const body = [
    `Hi ${lead.contactName},`,
    '',
    `I came across ${lead.businessName} and noticed opportunities around ${lead.detectedProblems[0].toLowerCase()}.`,
    `I help ${input.niche} businesses improve results with ${input.service}.`,
    '',
    `If helpful, I can send a short plan with 3 practical fixes tailored for ${lead.businessName}.`,
    '',
    'Best,',
    '[Your Name]'
  ].join('\n');

  return { subject, body };
}

function followUpEmail(lead, input) {
  return [
    `Hi ${lead.contactName},`,
    '',
    `Quick follow-up on my note about ${input.service} for ${lead.businessName}.`,
    'Happy to share a concise action plan you can review in 5 minutes.',
    '',
    'Would you like me to send it?',
    '',
    'Best,',
    '[Your Name]'
  ].join('\n');
}

module.exports = { outreachEmail, followUpEmail };
