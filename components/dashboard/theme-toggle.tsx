"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    const stored = localStorage.getItem("theme") || "dark";
    setTheme(stored);
    document.documentElement.className = stored;
  }, []);

  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("theme", next);
    document.documentElement.className = next;
  };

  return (
    <Button variant="ghost" onClick={toggle}>
      {theme === "dark" ? "☀️ Light" : "🌙 Dark"}
    </Button>
  );
}
