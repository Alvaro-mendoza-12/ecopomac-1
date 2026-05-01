import { Container } from "@/components/layout/Container";
import { PageHero } from "@/components/content/PageHero";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { ButtonLink } from "@/components/ui/Button";
import {
  BarChart3,
  Gamepad2,
  Leaf,
  MapPinned,
  QrCode,
  ShieldAlert,
  Sparkles,
} from "lucide-react";

const modules = [
  {
    title: "Simulador de Deforestación",
    description: "Explora escenarios 2000–2030 con estadísticas dinámicas.",
    href: "/simulador",
    icon: Sparkles,
  },
  {
    title: "Mapa Interactivo",
    description: "Ubicación, zonas afectadas, flora, fauna y áreas protegidas.",
    href: "/mapa",
    icon: MapPinned,
  },
  {
    title: "Juego: Salva el Bosque",
    description: "Decisiones que cambian biodiversidad, agua, CO₂ y economía.",
    href: "/juego",
    icon: Gamepad2,
  },
  {
    title: "Calculadora de Huella Ecológica",
    description: "Transporte, papel y energía para estimar tu impacto.",
    href: "/huella",
    icon: Leaf,
  },
  {
    title: "Panel Estadístico",
    description: "Gráficos interactivos: hectáreas, especies y CO₂.",
    href: "/estadisticas",
    icon: BarChart3,
  },
  {
    title: "Sistema de Reportes",
    description: "Denuncia tala ilegal, incendios o contaminación.",
    href: "/reportes",
    icon: ShieldAlert,
  },
  {
    title: "Acceso rápido (QR)",
    description: "Genera un QR para compartir EcoPómac al instante.",
    href: "/qr",
    icon: QrCode,
  },
] as const;

export default function ExplorarPage() {
  return (
    <div className="relative">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(900px_500px_at_20%_0%,rgba(52,211,153,0.18),transparent_60%),radial-gradient(900px_500px_at_85%_10%,rgba(176,137,104,0.16),transparent_55%)]"
      />
      <Container className="relative py-14">
        <PageHero
          eyebrow="Recorrido guiado"
          title="Explora EcoPómac como una historia visual sobre deforestación y biodiversidad."
          description="Esta vista organiza la exposición por módulos para que el grupo pueda avanzar desde el contexto ecológico de Lambayeque hasta las propuestas de solución, usando un lenguaje visual más claro y una navegación consistente."
          note="El contenido se apoya en el ensayo: causas humanas, fragmentación del hábitat, servicios ecosistémicos y alternativas de conservación."
          actions={
            <>
              <ButtonLink href="/simulador" size="lg">
                Empezar por el simulador
              </ButtonLink>
              <ButtonLink href="/mapa" variant="secondary" size="lg">
                Ir al mapa 3D
              </ButtonLink>
            </>
          }
          stats={[
            { label: "Módulos listos", value: `${modules.length} experiencias conectadas` },
            { label: "Enfoque del ensayo", value: "Causas, impactos y soluciones" },
            { label: "Marco de sostenibilidad", value: "ODS 13 y ODS 15" },
          ]}
          aside={
            <div className="rounded-[1.8rem] border border-white/10 bg-black/25 p-5">
              <p className="text-sm font-medium">Orden sugerido para la exposición</p>
              <div className="mt-3 grid gap-2 text-sm text-muted-foreground">
                <p>1. Contexto regional y bosque seco.</p>
                <p>2. Simulación del problema y lectura de datos.</p>
                <p>3. Mapa, juego y participación del público.</p>
                <p>4. Cierre con ranking, QR y certificados.</p>
              </div>
            </div>
          }
        />

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {modules.map((m) => (
            <Card key={m.href} className="group h-full border-white/10 bg-black/20">
              <CardHeader className="flex flex-row items-start justify-between gap-4">
                <div className="space-y-2">
                  <p className="text-[11px] uppercase tracking-[0.24em] text-emerald-100/70">
                    Módulo interactivo
                  </p>
                  <p className="text-sm font-medium">{m.title}</p>
                  <p className="text-sm leading-6 text-muted-foreground">{m.description}</p>
                </div>
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white/6 text-emerald-200 group-hover:bg-white/10">
                  <m.icon className="h-5 w-5" aria-hidden="true" />
                </span>
              </CardHeader>
              <CardContent className="flex h-full flex-col gap-4 pt-4">
                <div className="rounded-[1.6rem] border border-white/10 bg-white/[0.04] p-4 text-sm text-muted-foreground">
                  Ideal para reforzar una parte específica del ensayo con apoyo visual.
                </div>
                <ButtonLink
                  href={m.href}
                  variant="secondary"
                  className="mt-auto w-full justify-center"
                >
                  Abrir
                </ButtonLink>
              </CardContent>
            </Card>
          ))}
        </div>
      </Container>
    </div>
  );
}

