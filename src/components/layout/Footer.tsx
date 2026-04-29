import Link from "next/link";
import { Container } from "@/components/layout/Container";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-border bg-background/40">
      <Container className="py-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Proyecto universitario de Ecología + Ingeniería de Sistemas.
            </p>
            <p className="text-xs text-muted-foreground">
              Datos y simulaciones con fines educativos (no oficiales).
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <Link
              href="/qr"
              className="rounded-full px-3 py-2 hover:bg-white/7 focus-visible:ring-2 focus-visible:ring-ring"
            >
              QR
            </Link>
            <Link
              href="/certificados"
              className="rounded-full px-3 py-2 hover:bg-white/7 focus-visible:ring-2 focus-visible:ring-ring"
            >
              Certificados
            </Link>
            <a
              href="https://www.sernanp.gob.pe/"
              target="_blank"
              rel="noreferrer"
              className="rounded-full px-3 py-2 hover:bg-white/7 focus-visible:ring-2 focus-visible:ring-ring"
            >
              SERNANP
            </a>
          </div>
        </div>
      </Container>
    </footer>
  );
}

