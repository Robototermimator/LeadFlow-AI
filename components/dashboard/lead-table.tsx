import { Card } from "@/components/ui/card";
import { LeadExportButton } from "@/components/dashboard/lead-export-button";

type Lead = {
  id: string;
  businessName: string;
  website: string;
  email: string;
  phone: string;
  leadScore: number;
  outreachEmail: string;
};

export function LeadTable({ leads }: { leads: Lead[] }) {
  return (
    <Card className="p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold">Leads</h2>
        <LeadExportButton leads={leads} />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-muted-foreground">
              <th className="pb-2">Business</th><th className="pb-2">Website</th><th className="pb-2">Email</th><th className="pb-2">Phone</th><th className="pb-2">Score</th><th className="pb-2">Outreach</th>
            </tr>
          </thead>
          <tbody>
            {leads.length === 0 ? (
              <tr><td className="py-4 text-muted-foreground" colSpan={6}>No leads yet.</td></tr>
            ) : (
              leads.map((lead) => (
                <tr className="border-b border-border/50 align-top" key={lead.id}>
                  <td className="py-2">{lead.businessName}</td>
                  <td className="py-2"><a className="text-primary underline" href={lead.website} target="_blank">Visit</a></td>
                  <td className="py-2">{lead.email}</td>
                  <td className="py-2">{lead.phone}</td>
                  <td className="py-2 font-semibold">{lead.leadScore}</td>
                  <td className="max-w-sm py-2 text-xs text-muted-foreground">{lead.outreachEmail}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
