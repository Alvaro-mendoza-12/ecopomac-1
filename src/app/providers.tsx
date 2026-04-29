"use client";

import { AppThemeProvider } from "@/lib/theme";

export function Providers({ children }: { children: React.ReactNode }) {
  return <AppThemeProvider>{children}</AppThemeProvider>;
}

