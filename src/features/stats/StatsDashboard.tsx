"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  BarChart,
  Bar,
} from "recharts";
import { Container } from "@/components/layout/Container";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { ECO_POMAC } from "@/lib/constants";
import { SIMULATOR_STATS } from "@/features/simulator/simData";

const data = ECO_POMAC.years.map((y) => ({
  year: y,
  hectaresLost: SIMULATOR_STATS[y].hectaresLost,
  speciesAtRisk: SIMULATOR_STATS[y].speciesAtRisk,
  co2Kt: SIMULATOR_STATS[y].co2Kt,
}));

function nf(n: number) {
  return new Intl.NumberFormat("es-PE").format(n);
}

export function StatsDashboard() {
  const latest = data[data.length - 1]!;

  return (
    <div className="relative">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(950px_520px_at_20%_0%,rgba(52,211,153,0.16),transparent_62%),radial-gradient(950px_520px_at_95%_20%,rgba(163,230,53,0.10),transparent_60%)]"
      />
      <Container className="relative py-14">
        <div className="max-w-2xl space-y-3">
          <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
            Panel Estadístico
          </h1>
          <p className="text-pretty text-muted-foreground">
            Gráficos interactivos para exposición: hectáreas perdidas, especies
            afectadas y CO₂ estimado.
          </p>
        </div>

        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          <Kpi label="Hectáreas perdidas (2030)" value={`${nf(latest.hectaresLost)} ha`} />
          <Kpi label="Especies afectadas (2030)" value={`${nf(latest.speciesAtRisk)}`} />
          <Kpi label="CO₂ estimado (2030)" value={`${nf(latest.co2Kt)} kt`} />
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <Card className="overflow-hidden">
            <CardHeader>
              <p className="text-sm font-medium">Hectáreas perdidas</p>
              <p className="text-xs text-muted-foreground">2000 → 2030</p>
            </CardHeader>
            <CardContent className="h-[340px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                  <CartesianGrid stroke="rgba(255,255,255,0.08)" />
                  <XAxis dataKey="year" stroke="rgba(255,255,255,0.55)" />
                  <YAxis stroke="rgba(255,255,255,0.55)" />
                  <Tooltip
                    contentStyle={{
                      background: "rgba(10,12,12,0.9)",
                      border: "1px solid rgba(255,255,255,0.12)",
                      borderRadius: 14,
                      color: "rgba(255,255,255,0.92)",
                    }}
                    formatter={(value) => [`${nf(Number(value))} ha`, "Pérdida"]}
                  />
                  <Bar dataKey="hectaresLost" fill="rgba(251,113,133,0.55)" radius={[12, 12, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="overflow-hidden">
            <CardHeader>
              <p className="text-sm font-medium">Especies afectadas</p>
              <p className="text-xs text-muted-foreground">Tendencia</p>
            </CardHeader>
            <CardContent className="h-[340px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <CartesianGrid stroke="rgba(255,255,255,0.08)" />
                  <XAxis dataKey="year" stroke="rgba(255,255,255,0.55)" />
                  <YAxis stroke="rgba(255,255,255,0.55)" />
                  <Tooltip
                    contentStyle={{
                      background: "rgba(10,12,12,0.9)",
                      border: "1px solid rgba(255,255,255,0.12)",
                      borderRadius: 14,
                      color: "rgba(255,255,255,0.92)",
                    }}
                    formatter={(value) => [`${nf(Number(value))}`, "Especies"]}
                  />
                  <Line
                    type="monotone"
                    dataKey="speciesAtRisk"
                    stroke="rgba(52,211,153,0.85)"
                    strokeWidth={3}
                    dot={{ r: 5, stroke: "rgba(255,255,255,0.2)", strokeWidth: 2 }}
                    activeDot={{ r: 7 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="overflow-hidden lg:col-span-2">
            <CardHeader>
              <p className="text-sm font-medium">CO₂ emitido (estimado)</p>
              <p className="text-xs text-muted-foreground">Indicador de presión climática</p>
            </CardHeader>
            <CardContent className="h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <CartesianGrid stroke="rgba(255,255,255,0.08)" />
                  <XAxis dataKey="year" stroke="rgba(255,255,255,0.55)" />
                  <YAxis stroke="rgba(255,255,255,0.55)" />
                  <Tooltip
                    contentStyle={{
                      background: "rgba(10,12,12,0.9)",
                      border: "1px solid rgba(255,255,255,0.12)",
                      borderRadius: 14,
                      color: "rgba(255,255,255,0.92)",
                    }}
                    formatter={(value) => [`${nf(Number(value))} kt`, "CO₂"]}
                  />
                  <Line
                    type="monotone"
                    dataKey="co2Kt"
                    stroke="rgba(251,191,36,0.80)"
                    strokeWidth={3}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </Container>
    </div>
  );
}

function Kpi({ label, value }: { label: string; value: string }) {
  return (
    <Card>
      <CardContent className="p-6">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="mt-2 text-2xl font-semibold tracking-tight">{value}</p>
      </CardContent>
    </Card>
  );
}

