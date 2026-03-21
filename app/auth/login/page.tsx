"use client";

import { useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  const [email, setEmail] = useState("");

  const signIn = async () => {
    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` }
    });
    alert("Check your email for the magic link.");
  };

  return (
    <main className="mx-auto max-w-md px-6 py-16">
      <h2 className="mb-4 text-2xl font-semibold">Sign in</h2>
      <div className="space-y-3">
        <Input placeholder="you@company.com" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Button className="w-full" onClick={signIn}>Send Magic Link</Button>
      </div>
    </main>
  );
}
