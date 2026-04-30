import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  MapPinned,
  PlayCircle,
  ShieldCheck,
  Sprout,
  Trophy,
  Trees,
} from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Container } from "@/components/layout/Container";
import { ECO_POMAC } from "@/lib/constants";
import { HOME_METRICS, HOME_SPOTLIGHTS, POMAC_MEDIA } from "@/lib/pomacMedia";

const featurePills = [
  {
    icon: Trees,
    label: "Bosque seco",
    text: "Paisaje, flora y fauna del santuario.",
  },
  {
    icon: ShieldCheck,
    label: "Conservación",
    text: "Retos, decisiones y participación ciudadana.",
  },
  {
    icon: Trophy,
    label: "Juego + ranking",
    text: "Puntaje local y global conectado con certificados.",
  },
] as const;

export default function Home() {
  return (
    <div className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(1100px_650px_at_12%_8%,rgba(52,211,153,0.20),transparent_58%),radial-gradient(950px_580px_at_88%_18%,rgba(163,230,53,0.12),transparent_54%),radial-gradient(900px_650px_at_48%_102%,rgba(176,137,104,0.18),transparent_58%)]"
      />
      <div aria-hidden="true" className="noise absolute inset-0 opacity-70" />

      <Container className="relative py-12 sm:py-16 lg:py-20">
        <section className="grid items-start gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
          <div className="space-y-6">
            <p className="inline-flex items-center gap-2 rounded-full border border-border bg-white/6 px-4 py-2 text-xs text-muted-foreground backdrop-blur">
              {ECO_POMAC.name} · {ECO_POMAC.region}
            </p>

            <div className="space-y-4">
              <h1 className="max-w-3xl text-balance text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
                Aprende el Bosque de Pómac con imágenes reales, video y retos interactivos.
              </h1>
              <p className="max-w-2xl text-pretty text-base leading-7 text-muted-foreground sm:text-lg">
                EcoPómac ahora conecta la exploración visual del santuario con un
                juego más dinámico, simulación ambiental, ranking y generación de
                certificados en una experiencia optimizada para escritorio y móvil.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <ButtonLink href="/juego" size="lg">
                Jugar desafío Bosque de Pómac <PlayCircle className="h-4 w-4" />
              </ButtonLink>
              <ButtonLink href="/explorar" variant="secondary" size="lg">
                Explorar el santuario <ArrowRight className="h-4 w-4" />
              </ButtonLink>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {HOME_METRICS.map((metric) => (
                <Card key={metric.value} className="border-white/10 bg-white/5">
                  <CardContent className="space-y-2 p-4">
                    <p className="text-sm font-semibold text-emerald-100">{metric.value}</p>
                    <p className="text-sm text-muted-foreground">{metric.label}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid gap-3 md:grid-cols-3">
              {featurePills.map((item) => (
                <Card key={item.label} className="border-white/10 bg-black/20">
                  <CardContent className="flex gap-3 p-4">
                    <span className="mt-0.5 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-emerald-400/15 text-emerald-200">
                      <item.icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-medium">{item.label}</p>
                      <p className="text-xs leading-5 text-muted-foreground">{item.text}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="grid gap-4">
            <Card className="overflow-hidden border-white/10 bg-black/30">
              <CardContent className="p-0">
                <div className="relative aspect-[16/10] overflow-hidden">
                  <video
                    className="h-full w-full object-cover"
                    controls
                    playsInline
                    preload="metadata"
                    poster={POMAC_MEDIA.heroPoster}
                  >
                    <source src={POMAC_MEDIA.heroVideo} type="video/mp4" />
                    Tu navegador no soporta video HTML5.
                  </video>
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                    <p className="text-xs uppercase tracking-[0.3em] text-emerald-100/80">
                      Recorrido audiovisual
                    </p>
                    <p className="mt-2 max-w-md text-lg font-semibold sm:text-xl">
                      Video integrado desde la carpeta IMG para presentar el paisaje real del santuario.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-4 sm:grid-cols-2">
              <Card className="overflow-hidden border-white/10 bg-white/5">
                <CardContent className="p-0">
                  <div className="relative aspect-[4/5] overflow-hidden">
                    <Image
                      src={POMAC_MEDIA.panorama}
                      alt="Vista panorámica del Bosque de Pómac"
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, 50vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-5">
                      <p className="text-xs uppercase tracking-[0.25em] text-emerald-100/75">
                        Territorio vivo
                      </p>
                      <p className="mt-2 text-lg font-semibold">
                        Bosque seco, corredores biológicos y patrimonio Sicán.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-white/10 bg-gradient-to-br from-emerald-400/12 via-black/25 to-amber-300/10">
                <CardContent className="flex h-full flex-col justify-between gap-5 p-5">
                  <div className="space-y-3">
                    <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/6 px-3 py-1 text-xs text-muted-foreground">
                      <MapPinned className="h-3.5 w-3.5" aria-hidden="true" />
                      Experiencia conectada
                    </div>
                    <h2 className="text-2xl font-semibold tracking-tight">
                      Del video al reto, y del reto al certificado.
                    </h2>
                    <p className="text-sm leading-6 text-muted-foreground">
                      La portada ahora guía mejor a los visitantes hacia el mapa,
                      el simulador y el juego, con contenidos visuales reales del
                      Bosque de Pómac.
                    </p>
                  </div>
                  <div className="rounded-3xl border border-white/10 bg-black/25 p-4">
                    <p className="text-xs text-muted-foreground">Ruta recomendada</p>
                    <p className="mt-1 text-sm font-medium">
                      1. Explorar · 2. Jugar · 3. Publicar puntaje · 4. Generar certificado
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="mt-12 space-y-5 sm:mt-16">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.3em] text-emerald-100/70">
                Módulos destacados
              </p>
              <h2 className="text-balance text-2xl font-semibold tracking-tight sm:text-3xl">
                Accesos más visuales y mejor conectados entre sí.
              </h2>
            </div>
            <ButtonLink href="/ranking" variant="secondary" size="sm">
              Ver ranking global <Trophy className="h-4 w-4" />
            </ButtonLink>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            {HOME_SPOTLIGHTS.map((spotlight) => (
              <Card
                key={spotlight.title}
                className="group overflow-hidden border-white/10 bg-black/25"
              >
                <CardContent className="p-0">
                  <div className="relative aspect-[16/11] overflow-hidden">
                    <Image
                      src={spotlight.image}
                      alt={spotlight.alt}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 1024px) 100vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                    <div className="absolute left-4 top-4 rounded-full border border-white/10 bg-black/35 px-3 py-1 text-[11px] uppercase tracking-[0.25em] text-emerald-100/80 backdrop-blur">
                      {spotlight.eyebrow}
                    </div>
                  </div>

                  <div className="space-y-4 p-5">
                    <div className="space-y-2">
                      <h3 className="text-xl font-semibold tracking-tight">{spotlight.title}</h3>
                      <p className="text-sm leading-6 text-muted-foreground">
                        {spotlight.description}
                      </p>
                    </div>

                    <Link
                      href={spotlight.href}
                      className="inline-flex items-center gap-2 text-sm font-medium text-emerald-200 transition-colors hover:text-emerald-100"
                    >
                      {spotlight.cta}
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="overflow-hidden border-white/10 bg-white/5">
            <CardContent className="grid gap-4 p-5 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
              <div className="space-y-3">
                <p className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs text-muted-foreground">
                  <Sprout className="h-3.5 w-3.5" aria-hidden="true" />
                  Mejoras responsive
                </p>
                <h3 className="text-2xl font-semibold tracking-tight">
                  Navegación móvil más clara y contenido adaptable para todas las pantallas.
                </h3>
                <p className="text-sm leading-6 text-muted-foreground">
                  Reordenamos la portada en bloques fluidos, incorporamos un video
                  con carga liviana y reforzamos la transición entre módulos para que
                  la experiencia se mantenga consistente desde el celular.
                </p>
              </div>

              <div className="relative min-h-64 overflow-hidden rounded-[2rem] border border-white/10">
                <Image
                  src={POMAC_MEDIA.pyramids}
                  alt="Pirámides del complejo Sicán en el Bosque de Pómac"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <p className="text-xs uppercase tracking-[0.25em] text-emerald-100/75">
                    Patrimonio y paisaje
                  </p>
                  <p className="mt-2 max-w-sm text-sm leading-6 text-foreground/90">
                    El contenido visual ya no es genérico: ahora representa el
                    bosque, las huacas y la identidad del santuario.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </Container>
    </div>
  );
}
