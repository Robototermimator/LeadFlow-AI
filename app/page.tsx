import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-[calc(100vh-73px)] max-w-7xl flex-col justify-center px-6 py-16">
      <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
        <div className="space-y-6">
          <p className="inline-block rounded-full border border-primary/50 bg-primary/10 px-4 py-1 text-sm text-primary">
            AI-Powered Lead Generation
          </p>
          <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">Find qualified local leads and launch outreach in minutes.</h2>
          <p className="text-lg text-muted-foreground">
            LeadFlow AI helps freelancers, agencies, and SMB teams discover, score, and contact ideal prospects with human-sounding personalized emails.
          </p>
          <div className="flex gap-3">
            <Button asChild>
              <Link href="/dashboard">Open Dashboard</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/auth/login">Sign In</Link>
            </Button>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-6 shadow-2xl shadow-primary/20">
          <h3 className="mb-3 text-xl font-semibold">One product. Four revenue streams.</h3>
          <ul className="space-y-2 text-muted-foreground">
            <li>• SaaS app with Stripe billing</li>
            <li>• Developer API endpoints</li>
            <li>• CLI tool for Gumroad</li>
            <li>• Freelance delivery templates</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
