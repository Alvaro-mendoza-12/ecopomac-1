"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Leaf, Menu, Moon, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/cn";
import { Container } from "@/components/layout/Container";
import { ButtonLink } from "@/components/ui/Button";
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
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/70 backdrop-blur-xl">
      <Container className="flex h-16 items-center justify-between gap-3">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-3 rounded-full px-2 py-1 hover:bg-white/7 focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="EcoPómac - Inicio"
        >
          <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-400/15 text-emerald-200">
            <Leaf className="h-5 w-5" aria-hidden="true" />
          </span>
          <span className="flex flex-col leading-tight">
            <span className="font-semibold tracking-tight whitespace-nowrap">EcoPómac</span>
            <span className="hidden text-[10px] text-muted-foreground whitespace-nowrap lg:block xl:text-[11px]">
              Santuario Histórico Bosque de Pómac
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Navegación">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-full px-3 py-2 text-[13px] transition-colors hover:bg-white/7 focus-visible:ring-2 focus-visible:ring-ring xl:text-sm",
                  active && "bg-white/9",
                )}
                aria-current={active ? "page" : undefined}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <ButtonLink href="/explorar" variant="secondary" size="sm">
            Presentación
          </ButtonLink>
          <AuthButton />
          <ThemeToggleButton
            theme={theme}
            toggleTheme={toggleTheme}
            expanded={false}
          />
        </div>

        <div className="flex shrink-0 items-center gap-2 lg:hidden">
          <ThemeToggleButton
            theme={theme}
            toggleTheme={toggleTheme}
            expanded={false}
          />
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-white/6 hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-ring"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
          >
            {menuOpen ? (
              <X className="h-4 w-4" aria-hidden="true" />
            ) : (
              <Menu className="h-4 w-4" aria-hidden="true" />
            )}
          </button>
        </div>
      </Container>

      {menuOpen ? (
        <div id="mobile-nav" className="border-t border-border bg-background/95 lg:hidden">
          <Container className="py-4">
            <div className="rounded-[1.8rem] border border-white/10 bg-white/4 p-4">
              <p className="text-sm font-medium">Ruta sugerida para exponer</p>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                Empieza con la vista general, pasa por el simulador y cierra con el
                juego, ranking y certificados.
              </p>
              <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                <ButtonLink href="/explorar" size="sm" onClick={() => setMenuOpen(false)}>
                  Abrir recorrido
                </ButtonLink>
                <ButtonLink
                  href="/juego"
                  variant="secondary"
                  size="sm"
                  onClick={() => setMenuOpen(false)}
                >
                  Ir al juego
                </ButtonLink>
              </div>
            </div>

            <nav className="mt-4 grid gap-2 sm:grid-cols-2" aria-label="Navegación móvil">
              {navItems.map((item) => {
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "rounded-2xl border border-transparent bg-white/4 px-4 py-3 text-sm transition-colors hover:bg-white/8 focus-visible:ring-2 focus-visible:ring-ring",
                      active && "border-white/10 bg-white/10",
                    )}
                    aria-current={active ? "page" : undefined}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <div className="mt-4 flex flex-wrap items-center gap-2 rounded-3xl border border-border bg-white/4 p-3">
              <AuthButton />
            </div>
          </Container>
        </div>
      ) : null}
    </header>
  );
}

function ThemeToggleButton({
  theme,
  toggleTheme,
  expanded,
}: {
  theme: string;
  toggleTheme: () => void;
  expanded: boolean;
}) {
  return (
    <button
      type="button"
      className={cn(
        "inline-flex items-center justify-center rounded-full border border-border bg-white/6 hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-ring",
        expanded ? "h-11 gap-2 px-4 text-sm" : "h-10 w-10",
      )}
      onClick={toggleTheme}
      aria-label="Cambiar tema"
      title={theme === "dark" ? "Activar tema claro" : "Activar tema oscuro"}
    >
      <Moon className="h-4 w-4" aria-hidden="true" />
      {expanded ? <span>Tema</span> : null}
    </button>
  );
}
