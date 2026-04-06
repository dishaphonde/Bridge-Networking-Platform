"use client";

import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export type Theme = "light" | "dark";

interface ThemeToggleProps {
  showLabel?: boolean;
}

export default function ThemeToggle({ showLabel = false }: ThemeToggleProps) {
  const [theme, setTheme] = useState<Theme>("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem("bridge-theme") as Theme | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle("dark", savedTheme === "dark");
    } else {
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("bridge-theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  if (!mounted) {
    return (
      <div className={`flex items-center gap-4 ${showLabel ? "w-full justify-between" : ""}`}>
        {showLabel && (
          <div className="flex flex-col">
            <div className="h-5 w-24 bg-muted rounded animate-pulse mb-1" />
            <div className="h-4 w-48 bg-muted rounded animate-pulse" />
          </div>
        )}
        <div className="w-10 h-10 bg-muted rounded-full animate-pulse" />
      </div>
    );
  }

  // --- SETTINGS PAGE LAYOUT ---
  if (showLabel) {
    return (
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 w-full animate-fadeIn">
        <div className="flex flex-col">
          <span className="text-lg font-black text-foreground tracking-tight">Appearance</span>
          <span className="text-sm text-muted-foreground font-medium">Choose between light and dark display</span>
        </div>

        <div className="flex items-center gap-3 bg-muted/30 p-1.5 rounded-2xl border border-border">
          <Sun size={16} className={`${theme === "light" ? "text-amber-500" : "text-muted-foreground/40"} transition-colors duration-300`} />
          
          <button
            onClick={toggleTheme}
            className={`relative w-12 h-6 flex items-center rounded-full transition-all duration-300 shadow-inner px-1
              ${theme === "dark" ? "bg-primary" : "bg-muted-foreground/20"}
            `}
          >
            <div
              className={`w-4 h-4 rounded-full bg-white shadow-md transform transition-transform duration-300
                ${theme === "dark" ? "translate-x-6" : "translate-x-0"}
              `}
            />
          </button>

          <Moon size={16} className={`${theme === "dark" ? "text-primary" : "text-muted-foreground/40"} transition-colors duration-300`} />
        </div>
      </div>
    );
  }

  // --- NAVBAR / LOGIN / REGISTER LAYOUT ---
  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle Theme"
      className={`relative w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-300 border
        ${theme === "dark" 
          ? "bg-[#1E2F42] hover:bg-[#2A3B4C] border-[#2A3B4C] text-muted-foreground shadow-lg" 
          : "bg-white hover:bg-slate-50 border-slate-200 text-slate-600 shadow-sm"}
      `}
    >
      <div className={`transition-all duration-300 transform ${theme === "dark" ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-0 opacity-0"}`}>
        <Moon size={20} className="text-primary" />
      </div>
      <div className={`absolute transition-all duration-300 transform ${theme === "light" ? "rotate-0 scale-100 opacity-100" : "rotate-90 scale-0 opacity-0"}`}>
        <Sun size={20} className="text-amber-500" />
      </div>
    </button>
  );
}
