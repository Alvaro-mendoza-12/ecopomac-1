import { ArrowRight, Shield, Sprout, Waves } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Container } from "@/components/layout/Container";

export default function Home() {
  return (
    <div className="relative min-h-[calc(100vh-0px)] overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(1000px_600px_at_20%_15%,rgba(52,211,153,0.22),transparent_60%),radial-gradient(900px_500px_at_85%_20%,rgba(163,230,53,0.14),transparent_55%),radial-gradient(900px_600px_at_50%_110%,rgba(176,137,104,0.20),transparent_55%)]"
      />
      <div aria-hidden="true" className="noise absolute inset-0 opacity-70" />

      <Container className="relative pt-20 pb-14">
        <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <p className="inline-flex items-center gap-2 rounded-full border border-border bg-white/6 px-4 py-2 text-xs text-muted-foreground backdrop-blur">
              Santuario Histórico Bosque de Pómac · Lambayeque, Perú
            </p>
            <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
              La tecnología al servicio de la conservación ambiental.
            </h1>
            <p className="max-w-xl text-pretty text-base leading-7 text-muted-foreground sm:text-lg">
              EcoPómac integra visualización de datos, simulación, cartografía
              interactiva y aprendizaje basado en decisiones para comprender la
              deforestación y actuar.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <ButtonLink href="/explorar" size="lg">
                Explorar EcoPómac <ArrowRight className="h-4 w-4" />
              </ButtonLink>
              <ButtonLink href="/reportes" variant="secondary" size="lg">
                Reportar incidencia
              </ButtonLink>
            </div>
            <div className="grid gap-3 pt-6 sm:grid-cols-3">
              <Card>
                <CardContent className="flex items-start gap-3">
                  <span className="mt-0.5 inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-emerald-400/15 text-emerald-200">
                    <Sprout className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-sm font-medium">Educación</p>
                    <p className="text-xs text-muted-foreground">
                      Aprende con simulaciones y datos.
                    </p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="flex items-start gap-3">
                  <span className="mt-0.5 inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-emerald-400/15 text-emerald-200">
                    <Waves className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-sm font-medium">Impacto</p>
                    <p className="text-xs text-muted-foreground">
                      Visualiza agua, CO₂ y biodiversidad.
                    </p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="flex items-start gap-3">
                  <span className="mt-0.5 inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-emerald-400/15 text-emerald-200">
                    <Shield className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-sm font-medium">Acción</p>
                    <p className="text-xs text-muted-foreground">
                      Reporta y participa en retos.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-3 rounded-[2.5rem] bg-[radial-gradient(closest-side,rgba(52,211,153,0.18),transparent)] blur-2xl" />
            <Card className="relative overflow-hidden">
              <CardContent className="p-0">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-[radial-gradient(600px_300px_at_15%_20%,rgba(52,211,153,0.35),transparent_60%),radial-gradient(600px_300px_at_75%_20%,rgba(163,230,53,0.22),transparent_60%),linear-gradient(to_bottom,rgba(2,6,5,0.10),rgba(2,6,5,0.55))]"
                  />
                  <div
                    aria-hidden="true"
                    className="absolute -left-16 -top-12 h-64 w-64 rounded-full bg-emerald-400/18 blur-3xl animate-[pulse_6s_ease-in-out_infinite]"
                  />
                  <div
                    aria-hidden="true"
                    className="absolute -right-20 top-12 h-72 w-72 rounded-full bg-lime-300/14 blur-3xl animate-[pulse_7s_ease-in-out_infinite]"
                  />
                  <div className="relative h-full w-full">
                    <svg
                      viewBox="0 0 900 675"
                      className="h-full w-full"
                      role="img"
                      aria-label="Ilustración abstracta inspirada en el bosque"
                    >
                      <defs>
                        <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
                          <stop offset="0" stopColor="rgba(52,211,153,0.30)" />
                          <stop offset="1" stopColor="rgba(176,137,104,0.18)" />
                        </linearGradient>
                      </defs>
                      <rect width="900" height="675" fill="rgba(255,255,255,0.02)" />
                      <path
                        d="M0,520 C120,450 220,480 320,520 C430,565 520,560 640,510 C760,455 830,470 900,510 L900,675 L0,675 Z"
                        fill="url(#g)"
                        opacity="0.9"
                      />
                      <path
                        d="M0,560 C150,520 260,540 360,575 C480,620 590,610 720,570 C820,540 860,545 900,560"
                        fill="rgba(52,211,153,0.18)"
                      />
                      <path
                        d="M110,520 C130,410 190,360 230,300 C280,225 305,165 330,120"
                        stroke="rgba(52,211,153,0.35)"
                        strokeWidth="10"
                        fill="none"
                        strokeLinecap="round"
                      />
                      <path
                        d="M670,530 C650,430 600,380 565,330 C520,265 495,205 470,155"
                        stroke="rgba(163,230,53,0.25)"
                        strokeWidth="10"
                        fill="none"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/5 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <p className="text-sm font-medium">
                      Bosques secos del norte del Perú
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Experiencia inmersiva + animaciones premium.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </Container>
    </div>
  );
}
