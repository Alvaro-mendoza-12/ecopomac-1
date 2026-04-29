"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Leaf, Moon } from "lucide-react";
import { cn } from "@/lib/cn";
import { Container } from "@/components/layout/Container";
import { AuthButton } from "@/features/auth/AuthButton";
import { useAppTheme } from "@/lib/theme";

const navItems = [
  { href: "/explorar", label: "Explorar" },
  { href: "/simulador", label: "Simulador" },
  { href: "/mapa", label: "Mapa" },
  { href: "/juego", label: "Juego" },
  { href: "/huella", label: "Huella" },
  { href: "/estadisticas", label: "Estadísticas" },
  { href: "/reportes", label: "Reportar" },
  { href: "/ranking", label: "Ranking" },
] as const;

export function Navbar() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useAppTheme();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/60 backdrop-blur-xl">
      <Container className="flex h-16 items-center justify-between gap-4">
        <Link
          href="/"
          className="flex items-center gap-2 rounded-full px-2 py-1 hover:bg-white/7 focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="EcoPómac - Inicio"
        >
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-emerald-400/15 text-emerald-200">
            <Leaf className="h-5 w-5" aria-hidden="true" />
          </span>
          <span className="font-semibold tracking-tight">EcoPómac</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Navegación">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-full px-3 py-2 text-sm transition-colors hover:bg-white/7 focus-visible:ring-2 focus-visible:ring-ring",
                  active && "bg-white/9",
                )}
                aria-current={active ? "page" : undefined}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <AuthButton />
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-white/6 hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-ring"
            onClick={toggleTheme}
            aria-label="Cambiar tema"
            title={theme === "dark" ? "Activar tema claro" : "Activar tema oscuro"}
          >
            <Moon className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </Container>
    </header>
  );
}

