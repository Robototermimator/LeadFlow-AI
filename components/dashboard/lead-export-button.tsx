"use client";

import { Button } from "@/components/ui/button";

type Lead = {
  businessName: string;
  website: string;
  email: string;
  phone: string;
  leadScore: number;
  outreachEmail: string;
};

export function LeadExportButton({ leads }: { leads: Lead[] }) {
  const onExport = () => {
    const header = "businessName,website,email,phone,leadScore,outreachEmail";
    const rows = leads.map((lead) =>
      [lead.businessName, lead.website, lead.email, lead.phone, lead.leadScore, lead.outreachEmail]
        .map((v) => `"${String(v).replace(/"/g, '""')}"`)
        .join(",")
    );
    const csv = [header, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "leadflow-leads.csv");
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return <Button onClick={onExport} variant="outline">Export CSV</Button>;
}
