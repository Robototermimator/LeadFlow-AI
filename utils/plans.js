const PLAN_LIMITS = {
  Free: { runsPerMonth: 3, maxLeadsPerRun: 20 },
  Pro: { runsPerMonth: 50, maxLeadsPerRun: 200 },
  Agency: { runsPerMonth: 300, maxLeadsPerRun: 1000 }
};

function getPlanLimits(plan) {
  return PLAN_LIMITS[plan] || PLAN_LIMITS.Free;
}

function getMonthStartISO() {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth(), 1).toISOString();
}

module.exports = { PLAN_LIMITS, getPlanLimits, getMonthStartISO };
