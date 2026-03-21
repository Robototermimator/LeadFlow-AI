function escapeCell(value) {
  return `"${String(value ?? '').replace(/"/g, '""')}"`;
}

function leadsToCsv(leads) {
  const headers = [
    'business_name',
    'website',
    'contact_email',
    'phone',
    'niche',
    'lead_score',
    'contacted',
    'outreach_subject',
    'outreach_body',
    'follow_up_body',
    'notes'
  ];

  const rows = leads.map((l) => [
    l.business_name,
    l.website,
    l.contact_email,
    l.phone,
    l.niche,
    l.lead_score,
    l.contacted ? 'Yes' : 'No',
    l.outreach_subject,
    l.outreach_body,
    l.follow_up_body,
    l.notes
  ]);

  return [headers.map(escapeCell).join(','), ...rows.map((r) => r.map(escapeCell).join(','))].join('\n');
}

module.exports = { leadsToCsv };
