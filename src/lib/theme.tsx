"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

type ThemeMode = "light" | "dark";

type ThemeContextValue = {
  theme: ThemeMode;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);
const STORAGE_KEY = "ecopomac:theme";

function applyThemeClass(theme: ThemeMode) {
  const root = document.documentElement;
  root.classList.toggle("dark", theme === "dark");
}

export function AppThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<ThemeMode>(() => {
    if (typeof window === "undefined") return "dark";
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as ThemeMode | null;
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      return stored ?? (prefersDark ? "dark" : "light");
    } catch {
      return "dark";
    }
  });

  useEffect(() => {
    applyThemeClass(theme);
  }, [theme]);

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme,
      toggleTheme: () => {
        setTheme((prev) => {
          const next: ThemeMode = prev === "dark" ? "light" : "dark";
          applyThemeClass(next);
          try {
            localStorage.setItem(STORAGE_KEY, next);
          } catch {
            // ignore
          }
          return next;
        });
      },
    }),
    [theme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useAppTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useAppTheme must be used within AppThemeProvider");
  }
  return ctx;
}

