"use client";

import { Container } from "@/components/layout/Container";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { StableLeafletMap } from "@/features/map/StableLeafletMap";

export function MapView() {
  return (
    <div className="relative">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(1000px_600px_at_15%_0%,rgba(52,211,153,0.16),transparent_62%),radial-gradient(900px_500px_at_95%_10%,rgba(176,137,104,0.15),transparent_60%)]"
      />
      <Container className="relative py-14">
        <div className="max-w-2xl space-y-3">
          <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
            Mapa 3D Interactivo
          </h1>
          <p className="text-pretty text-muted-foreground">
            Vista 3D real con cámara inclinada, terreno y extrusión de elementos
            para analizar presión ecológica en Bosque de Pómac.
          </p>
          <p className="text-xs text-emerald-200/80">
            Contexto Chiclayo-Lambayeque con estructura lista para capas
            geoespaciales enterprise.
          </p>
        </div>

        <div className="mt-10 space-y-4">
          <Card className="overflow-hidden">
            <CardContent className="p-3">
              <StableLeafletMap />
            </CardContent>
          </Card>

          <div className="grid gap-4 xl:grid-cols-2">
            <Card>
              <CardHeader>
                <p className="text-sm font-medium">Capas (educativas)</p>
                <p className="text-xs text-muted-foreground">
                  Arquitectura modular lista para crecimiento
                </p>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <p>
                  - Terreno 3D con DEM (MapLibre + raster-dem).
                </p>
                <p>
                  - Extrusión volumétrica para zona afectada e infraestructura.
                </p>
                <p>
                  - Puntos semánticos: flora, fauna, protección y afectación.
                </p>
                <p>
                  - Backlog técnico: incendios, biodiversidad, rutas, IoT,
                  reforestación.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <p className="text-sm font-medium">Accesibilidad</p>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                El mapa está pensado para interacción, pero EcoPómac también
                ofrece métricas y explicaciones textuales para apoyar a usuarios
                con tecnologías de asistencia.
              </CardContent>
            </Card>
          </div>
        </div>
      </Container>
    </div>
  );
}

