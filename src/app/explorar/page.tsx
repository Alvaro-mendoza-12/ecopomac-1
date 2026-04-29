import { Container } from "@/components/layout/Container";
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
        <div className="flex flex-col gap-4">
          <p className="text-sm text-muted-foreground">
            Navega por módulos interactivos.
          </p>
          <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
            Explorar EcoPómac
          </h1>
          <p className="max-w-2xl text-pretty text-muted-foreground">
            Diseñado para una presentación universitaria con enfoque en
            sostenibilidad, UX premium y arquitectura mantenible.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {modules.map((m) => (
            <Card key={m.href} className="group">
              <CardHeader className="flex flex-row items-center justify-between gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium">{m.title}</p>
                  <p className="text-xs text-muted-foreground">{m.description}</p>
                </div>
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white/6 text-emerald-200 group-hover:bg-white/10">
                  <m.icon className="h-5 w-5" aria-hidden="true" />
                </span>
              </CardHeader>
              <CardContent className="pt-4">
                <ButtonLink href={m.href} variant="secondary" className="w-full">
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

