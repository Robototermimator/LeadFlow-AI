import { Card } from "@/components/ui/card";

type Run = {
  id: string;
  niche: string;
  location: string;
  createdAt: Date;
  leads: { id: string }[];
};

export function RunList({ runs }: { runs: Run[] }) {
  return (
    <Card className="p-6">
      <h2 className="mb-4 text-xl font-semibold">Run History</h2>
      <div className="space-y-3">
        {runs.length === 0 ? (
          <p className="text-sm text-muted-foreground">No runs yet. Generate your first lead batch.</p>
        ) : (
          runs.map((run) => (
            <div className="rounded-lg border border-border p-3" key={run.id}>
              <p className="font-medium">{run.niche} in {run.location}</p>
              <p className="text-xs text-muted-foreground">{run.leads.length} leads • {new Date(run.createdAt).toLocaleString()}</p>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}
