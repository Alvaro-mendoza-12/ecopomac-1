import Link from "next/link";
import { Container } from "@/components/layout/Container";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-border bg-background/45">
      <Container className="py-10 sm:py-12">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.85fr_0.85fr]">
          <div className="space-y-3">
            <p className="text-sm font-medium">EcoPómac</p>
            <p className="max-w-xl text-sm leading-6 text-muted-foreground">
              Plataforma educativa para explicar conservación, deforestación,
              biodiversidad y patrimonio del Santuario Histórico Bosque de Pómac
              en una exposición universitaria.
            </p>
            <p className="text-xs text-muted-foreground">
              Proyecto de Ecología + Ingeniería de Sistemas. Datos y simulaciones
              con fines educativos.
            </p>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-medium">Recorrido sugerido</p>
            <div className="flex flex-wrap gap-2 text-sm">
              <Link
                href="/explorar"
                className="rounded-full px-3 py-2 hover:bg-white/7 focus-visible:ring-2 focus-visible:ring-ring"
              >
                Explorar
              </Link>
              <Link
                href="/simulador"
                className="rounded-full px-3 py-2 hover:bg-white/7 focus-visible:ring-2 focus-visible:ring-ring"
              >
                Simulador
              </Link>
              <Link
                href="/mapa"
                className="rounded-full px-3 py-2 hover:bg-white/7 focus-visible:ring-2 focus-visible:ring-ring"
              >
                Mapa
              </Link>
              <Link
                href="/juego"
                className="rounded-full px-3 py-2 hover:bg-white/7 focus-visible:ring-2 focus-visible:ring-ring"
              >
                Juego
              </Link>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-medium">Recursos</p>
            <div className="flex flex-wrap gap-2 text-sm">
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
              <Link
                href="/ranking"
                className="rounded-full px-3 py-2 hover:bg-white/7 focus-visible:ring-2 focus-visible:ring-ring"
              >
                Ranking
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
        </div>

        <div className="mt-8 flex flex-col gap-2 border-t border-white/10 pt-4 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>Diseñado para verse bien en móvil, laptop y proyección en aula.</p>
          <p>Lambayeque, Perú · EcoPómac</p>
        </div>
      </Container>
    </footer>
  );
}

