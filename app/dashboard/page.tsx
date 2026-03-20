import { LeadGeneratorForm } from "@/components/dashboard/lead-generator-form";
import { RunList } from "@/components/dashboard/run-list";
import { LeadTable } from "@/components/dashboard/lead-table";
import { PricingPlans } from "@/components/dashboard/pricing-plans";
import { prisma } from "@/lib/prisma";

export default async function DashboardPage() {
  const runs = await prisma.leadGenerationRun.findMany({
    orderBy: { createdAt: "desc" },
    include: { leads: true },
    take: 10
  });

  const leads = await prisma.lead.findMany({
    orderBy: { createdAt: "desc" },
    take: 100
  });

  return (
    <main className="mx-auto max-w-7xl space-y-6 px-6 py-8">
      <section className="grid gap-6 lg:grid-cols-3">
        <LeadGeneratorForm />
        <RunList runs={runs} />
      </section>
      <PricingPlans />
      <LeadTable leads={leads} />
    </main>
  );
}
