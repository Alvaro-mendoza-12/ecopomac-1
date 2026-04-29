"use client";

import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import { Container } from "@/components/layout/Container";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { ECO_POMAC, type EcoPomacYear } from "@/lib/constants";
import { SIMULATOR_STATS } from "@/features/simulator/simData";
import { cn } from "@/lib/cn";

const StableLeafletMap = dynamic(
  () => import("@/features/map/StableLeafletMap").then((m) => m.StableLeafletMap),
  {
    ssr: false,
  },
);

function formatNumber(n: number) {
  return new Intl.NumberFormat("es-PE").format(n);
}

export function SimulatorView() {
  const [year, setYear] = useState<EcoPomacYear>(2020);
  const stats = SIMULATOR_STATS[year];
  const yearIndex = ECO_POMAC.years.indexOf(year);
  const pressure = Math.round(((100 - stats.forestCoverPct) / 100) * 100);

  const forestBars = useMemo(() => {
    const total = 24;
    const filled = Math.round((stats.forestCoverPct / 100) * total);
    return Array.from({ length: total }, (_, i) => i < filled);
  }, [stats.forestCoverPct]);

  return (
    <div className="relative">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(1000px_650px_at_20%_0%,rgba(52,211,153,0.18),transparent_65%),radial-gradient(1000px_650px_at_90%_10%,rgba(251,191,36,0.10),transparent_60%)]"
      />
      <Container className="relative py-14">
        <div className="max-w-2xl space-y-3">
          <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
            Simulador de Deforestación
          </h1>
          <p className="text-pretty text-muted-foreground">
            Desliza la línea temporal para observar la pérdida forestal y su
            impacto. Los valores son educativos (no oficiales).
          </p>
          <p className="text-xs text-emerald-200/80">
            Contexto Lambayeque-Chiclayo: la presión por cambio de uso de suelo
            aumenta la fragmentación del bosque seco.
          </p>
        </div>

        <div className="mt-10 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <Card className="overflow-hidden">
            <CardHeader className="flex flex-col gap-3">
              <div className="flex items-center justify-between gap-4">
                <p className="text-sm font-medium">Línea temporal</p>
                <p className="text-sm text-muted-foreground">
                  {ECO_POMAC.years[0]} → {ECO_POMAC.years[ECO_POMAC.years.length - 1]}
                </p>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-semibold tracking-tight">
                  {year}
                </span>
                <span className="text-xs text-muted-foreground">
                  Cobertura: {stats.forestCoverPct}%
                </span>
              </div>
              <input
                aria-label="Seleccionar año"
                className="w-full accent-emerald-300"
                type="range"
                min={0}
                max={ECO_POMAC.years.length - 1}
                step={1}
                value={ECO_POMAC.years.indexOf(year)}
                onChange={(e) => {
                  const idx = Number(e.target.value);
                  setYear(ECO_POMAC.years[idx] ?? 2020);
                }}
              />
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                {ECO_POMAC.years.map((y) => (
                  <span key={y} className={cn(y === year && "text-foreground")}>
                    {y}
                  </span>
                ))}
              </div>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="grid gap-5">
                <div className="rounded-3xl border border-border bg-white/4 p-5">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">Visualización</p>
                    <p className="text-xs text-muted-foreground">
                      “Bosque” vs. “pérdida”
                    </p>
                  </div>
                  <div className="mt-4 grid grid-cols-12 gap-2">
                    {forestBars.map((filled, i) => (
                      <motion.div
                        key={i}
                        className={cn(
                          "h-6 rounded-xl border border-border",
                          filled
                            ? "bg-emerald-400/22"
                            : "bg-rose-400/14 opacity-70",
                        )}
                        initial={false}
                        animate={{
                          scaleY: filled ? 1 : 0.85,
                          opacity: filled ? 1 : 0.55,
                        }}
                        transition={{ type: "spring", stiffness: 260, damping: 24 }}
                      />
                    ))}
                  </div>
                  <motion.div
                    className="mt-5 h-2 rounded-full bg-white/6 overflow-hidden"
                    initial={false}
                  >
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-emerald-300/90 via-lime-300/70 to-amber-300/60"
                      initial={false}
                      animate={{ width: `${stats.forestCoverPct}%` }}
                      transition={{ type: "spring", stiffness: 220, damping: 26 }}
                      aria-hidden="true"
                    />
                  </motion.div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4">
            <Card className="overflow-hidden">
              <CardHeader>
                <p className="text-sm font-medium">Escenario ecológico (efecto 3D)</p>
                <p className="text-xs text-muted-foreground">
                  Profundidad visual según presión ambiental del año seleccionado.
                </p>
              </CardHeader>
              <CardContent>
                <motion.div
                  className="relative h-44 overflow-hidden rounded-3xl border border-border bg-gradient-to-b from-sky-300/20 via-emerald-300/10 to-amber-300/10"
                  initial={false}
                  animate={{
                    boxShadow:
                      pressure > 35
                        ? "inset 0 -30px 80px rgba(244,63,94,0.22)"
                        : "inset 0 -30px 80px rgba(16,185,129,0.2)",
                  }}
                >
                  <motion.div
                    className="absolute -bottom-4 left-0 h-28 w-full rounded-[50%] bg-emerald-500/30 blur-sm"
                    initial={false}
                    animate={{ scaleX: 1 + yearIndex * 0.08, opacity: 0.75 - yearIndex * 0.12 }}
                  />
                  <motion.div
                    className="absolute bottom-5 left-8 h-16 w-16 rounded-full bg-amber-200/70 blur-[1px]"
                    initial={false}
                    animate={{ x: yearIndex * 24, y: yearIndex * -2, opacity: 1 - yearIndex * 0.12 }}
                  />
                  <div className="absolute inset-x-0 bottom-0 grid h-24 grid-cols-10 items-end gap-1 px-4 pb-3">
                    {Array.from({ length: 10 }).map((_, i) => {
                      const alive = i < Math.max(2, Math.round((stats.forestCoverPct / 100) * 10));
                      return (
                        <motion.div
                          key={i}
                          className={cn(
                            "rounded-t-xl",
                            alive ? "bg-emerald-300/70" : "bg-rose-300/55",
                          )}
                          initial={false}
                          animate={{
                            height: alive ? 40 + (i % 3) * 6 : 12 + (i % 2) * 4,
                            opacity: alive ? 0.95 : 0.7,
                          }}
                          transition={{ type: "spring", stiffness: 210, damping: 24 }}
                        />
                      );
                    })}
                  </div>
                </motion.div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <p className="text-sm font-medium">Estadísticas dinámicas</p>
                <p className="text-xs text-muted-foreground">
                  Resumen de impacto por año
                </p>
              </CardHeader>
              <CardContent className="grid gap-3">
                <StatRow
                  label="Hectáreas perdidas"
                  value={`${formatNumber(stats.hectaresLost)} ha`}
                />
                <StatRow
                  label="Especies afectadas"
                  value={`${formatNumber(stats.speciesAtRisk)}`}
                />
                <StatRow
                  label="CO₂ (estimado)"
                  value={`${formatNumber(stats.co2Kt)} kt`}
                />
                <div className="pt-2 text-xs text-muted-foreground">
                  Índice de presión ecológica: <span className="text-foreground">{pressure}%</span>.
                  Consejo: compara 2010 vs 2030 para ver la aceleración del impacto.
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <p className="text-sm font-medium">Lectura rápida</p>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                La deforestación incrementa la fragmentación del hábitat, reduce
                la regulación hídrica y aumenta emisiones asociadas al cambio de
                uso de suelo. Este simulador traduce esos factores a señales
                visuales.
              </CardContent>
            </Card>

            <Card className="overflow-hidden">
              <CardHeader>
                <p className="text-sm font-medium">Mapa 3D integrado</p>
                <p className="text-xs text-muted-foreground">
                  Referencia espacial en tiempo real para el escenario seleccionado.
                </p>
              </CardHeader>
              <CardContent className="p-3">
                <StableLeafletMap compact />
              </CardContent>
            </Card>
          </div>
        </div>
      </Container>
    </div>
  );
}

function StatRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-border bg-white/4 px-4 py-3">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-sm font-medium">{value}</span>
    </div>
  );
}

