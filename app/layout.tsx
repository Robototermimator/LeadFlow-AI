import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeToggle } from "@/components/dashboard/theme-toggle";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "LeadFlow AI",
  description: "AI lead generation agent for freelancers, agencies, and SMB teams."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <header className="border-b border-border/80 bg-card/50 backdrop-blur">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
            <h1 className="text-lg font-semibold tracking-tight">LeadFlow AI</h1>
            <ThemeToggle />
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
