"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

export function LeadGeneratorForm() {
  const [form, setForm] = useState({
    niche: "Dentists",
    location: "Cape Town",
    serviceOffer: "Website redesign",
    businessType: "Dental clinic",
    keywords: "bookings, seo, local",
    tone: "Professional",
    count: 10
  });
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await fetch("/api/generate-leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });
    setLoading(false);
    window.location.reload();
  };

  return (
    <Card className="lg:col-span-2 p-6">
      <h2 className="mb-4 text-xl font-semibold">Generate New Leads</h2>
      <form className="grid gap-3 sm:grid-cols-2" onSubmit={onSubmit}>
        {Object.entries(form).map(([key, value]) => (
          <Input
            key={key}
            type={key === "count" ? "number" : "text"}
            value={value}
            onChange={(e) => setForm((prev) => ({ ...prev, [key]: key === "count" ? Number(e.target.value) : e.target.value }))}
            placeholder={key}
            required
          />
        ))}
        <Button className="sm:col-span-2" disabled={loading} type="submit">
          {loading ? "Generating..." : "Generate Leads"}
        </Button>
      </form>
    </Card>
  );
}
