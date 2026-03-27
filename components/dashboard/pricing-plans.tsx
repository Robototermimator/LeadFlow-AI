"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const plans = [
  { name: "Free", price: "$0", priceId: null, features: ["10 leads/run", "CSV export", "Mock mode"] },
  { name: "Pro", price: "$49/mo", priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO, features: ["500 leads/mo", "OpenAI personalization", "API access"] },
  { name: "Agency", price: "$149/mo", priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_AGENCY, features: ["5000 leads/mo", "Team workflows", "Priority support"] }
];

export function PricingPlans() {
  const checkout = async (priceId?: string | null) => {
    if (!priceId) return;
    const response = await fetch("/api/billing/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ priceId })
    });
    const data = await response.json();
    if (data.url) window.location.href = data.url;
  };

  return (
    <section className="grid gap-4 md:grid-cols-3">
      {plans.map((plan) => (
        <Card className="p-5" key={plan.name}>
          <h3 className="text-lg font-semibold">{plan.name}</h3>
          <p className="mt-1 text-2xl font-bold">{plan.price}</p>
          <ul className="my-4 space-y-1 text-sm text-muted-foreground">
            {plan.features.map((feature) => <li key={feature}>• {feature}</li>)}
          </ul>
          <Button className="w-full" onClick={() => checkout(plan.priceId)} variant={plan.name === "Free" ? "outline" : "default"}>
            {plan.name === "Free" ? "Current" : `Upgrade to ${plan.name}`}
          </Button>
        </Card>
      ))}
    </section>
  );
}
