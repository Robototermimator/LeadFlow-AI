function keywordWeight(text) {
  const signals = ['outdated', 'slow', 'no booking', 'low reviews', 'poor seo', 'mobile'];
  const joined = String(text || '').toLowerCase();
  return signals.reduce((acc, signal) => acc + (joined.includes(signal) ? 7 : 0), 0);
}

function modeBoost(mode) {
  if (mode === 'aggressive') return 10;
  if (mode === 'deep') return 6;
  return 2;
}

function scoreLead({ niche, service, keywords, mode, index }) {
  const nicheBase = Math.min(40, 22 + niche.length);
  const serviceBase = Math.min(25, 12 + service.length / 2);
  const keywordBase = keywordWeight(keywords);
  const variation = (index * 11) % 23;
  const raw = nicheBase + serviceBase + keywordBase + modeBoost(mode) + variation;
  return Math.max(35, Math.min(100, Math.round(raw)));
}

module.exports = { scoreLead };
