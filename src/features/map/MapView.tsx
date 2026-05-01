"use client";

import { PageHero } from "@/components/content/PageHero";
import { Container } from "@/components/layout/Container";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { ButtonLink } from "@/components/ui/Button";
import { EcoMap3D } from "@/features/map/EcoMap3D";
import { StableLeafletMap } from "@/features/map/StableLeafletMap";

export function MapView() {
  return (
    <div className="relative">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(1000px_600px_at_15%_0%,rgba(52,211,153,0.16),transparent_62%),radial-gradient(900px_500px_at_95%_10%,rgba(176,137,104,0.15),transparent_60%)]"
      />
      <Container className="relative py-14">
        <PageHero
          eyebrow="Lectura territorial"
          title="Relaciona territorio, biodiversidad y presión humana en una sola vista."
          description="El mapa ahora está pensado para exposición: combina una escena 3D, capas temáticas, leyenda y estadísticas rápidas para explicar cómo la deforestación altera la estructura ecológica del Bosque de Pómac."
          note="El ensayo remarca que la fragmentación del hábitat y la ocupación desordenada del territorio incrementan la vulnerabilidad del ecosistema."
          actions={
            <>
              <ButtonLink href="/simulador" size="lg">
                Volver al simulador
              </ButtonLink>
              <ButtonLink href="/reportes" variant="secondary" size="lg">
                Ir a reportes
              </ButtonLink>
            </>
          }
          stats={[
            { label: "Vista principal", value: "Escena 3D + filtros" },
            { label: "Enfoque", value: "Incendios, biodiversidad y presión ecológica" },
            { label: "Respaldo", value: "Mapa 2D estable incluido" },
          ]}
          aside={
            <div className="rounded-[1.8rem] border border-white/10 bg-black/25 p-5">
              <p className="text-sm font-medium">Qué conviene mostrar</p>
              <div className="mt-3 grid gap-2 text-sm text-muted-foreground">
                <p>1. Enciende capas de incendios y biodiversidad.</p>
                <p>2. Señala la zona afectada y la presión sobre el bosque seco.</p>
                <p>3. Usa el respaldo 2D si quieres una lectura más simple.</p>
              </div>
            </div>
          }
        />

        <div className="mt-10 space-y-4">
          <Card className="overflow-hidden border-white/10 bg-black/20">
            <CardContent className="p-3 sm:p-4">
              <EcoMap3D defaultPanelsVisible />
            </CardContent>
          </Card>

          <div className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
            <Card>
              <CardHeader>
                <p className="text-sm font-medium">Cómo leer el mapa</p>
                <p className="text-xs text-muted-foreground">
                  Resumen rápido para exposición
                </p>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <p>
                  - La escena 3D ayuda a visualizar relieve, focos de presión y puntos de biodiversidad.
                </p>
                <p>
                  - Las capas conectan causas del ensayo: incendios, pérdida de cobertura y ocupación del territorio.
                </p>
                <p>
                  - La leyenda y el panel estadístico permiten explicar el problema sin depender solo del discurso oral.
                </p>
                <p>
                  - Si la audiencia necesita una lectura más simple, el respaldo 2D mantiene el contexto espacial.
                </p>
              </CardContent>
            </Card>

            <Card className="overflow-hidden">
              <CardHeader>
                <p className="text-sm font-medium">Referencia 2D estable</p>
                <p className="text-xs text-muted-foreground">
                  Útil para comparar con la escena principal
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <StableLeafletMap compact />
                <p className="text-sm leading-6 text-muted-foreground">
                  EcoPómac mantiene una lectura accesible con apoyo visual y
                  explicación textual para que el mensaje se entienda también en
                  contextos de navegación simple.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </Container>
    </div>
  );
}

