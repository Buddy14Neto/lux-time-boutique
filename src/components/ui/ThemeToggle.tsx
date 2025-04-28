
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle("dark", savedTheme === "dark");
    } else if (prefersDark) {
      setTheme("dark");
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
    localStorage.setItem("theme", newTheme);
  };

  return (
    <Button 
      variant="ghost" 
      size="icon" 
      onClick={toggleTheme}
      className="relative overflow-hidden rounded-full bg-background hover:bg-accent"
      aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
    >
      <Sun className={`h-5 w-5 rotate-0 scale-100 transition-all ${theme === "dark" ? "rotate-90 scale-0" : ""}`} />
      <Moon className={`absolute h-5 w-5 rotate-90 scale-0 transition-all ${theme === "dark" ? "rotate-0 scale-100" : ""}`} />
    </Button>
  );
}
