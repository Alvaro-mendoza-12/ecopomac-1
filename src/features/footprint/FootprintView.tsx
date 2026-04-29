"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { useMemo } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { Container } from "@/components/layout/Container";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

const schema = z.object({
  transportKmWeek: z.number().min(0).max(5000),
  paperPagesWeek: z.number().min(0).max(5000),
  energyKwhMonth: z.number().min(0).max(5000),
});

type FormValues = z.infer<typeof schema>;

function clamp(n: number) {
  return Math.max(0, Math.min(100, n));
}

function score(values: FormValues) {
  // Normalización simple (educativa):
  // - transporte: 0..300 km/sem -> 0..45 pts presión
  // - papel: 0..200 páginas/sem -> 0..25 pts
  // - energía: 0..250 kWh/mes -> 0..30 pts
  const t = Math.min(45, (values.transportKmWeek / 300) * 45);
  const p = Math.min(25, (values.paperPagesWeek / 200) * 25);
  const e = Math.min(30, (values.energyKwhMonth / 250) * 30);
  const pressure = t + p + e; // 0..100
  const good = 100 - pressure;
  return clamp(Math.round(good));
}

export function FootprintView() {
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      transportKmWeek: 60,
      paperPagesWeek: 35,
      energyKwhMonth: 180,
    },
    mode: "onChange",
  });

  const values = useWatch({ control: form.control }) as FormValues;
  const s = useMemo(() => score(values), [values]);

  return (
    <div className="relative">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(900px_520px_at_18%_0%,rgba(52,211,153,0.16),transparent_62%),radial-gradient(900px_520px_at_90%_20%,rgba(176,137,104,0.14),transparent_60%)]"
      />
      <Container className="relative py-14">
        <div className="max-w-2xl space-y-3">
          <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
            Calculadora de Huella Ecológica
          </h1>
          <p className="text-pretty text-muted-foreground">
            Estima tu puntaje ambiental con base en hábitos cotidianos. Modelo
            educativo (no clínico) para reflexión y mejora.
          </p>
        </div>

        <div className="mt-10 grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
          <Card>
            <CardHeader>
              <p className="text-sm font-medium">Tus consumos</p>
              <p className="text-xs text-muted-foreground">
                Ajusta los valores y observa el puntaje.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <Field
                label="Transporte (km por semana)"
                hint="Incluye bus/auto/moto. Menos km, mejor."
                input={
                  <input
                    className="h-11 w-full rounded-2xl border border-border bg-white/4 px-4 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    type="number"
                    inputMode="numeric"
                    {...form.register("transportKmWeek", { valueAsNumber: true })}
                  />
                }
              />
              <Field
                label="Consumo de papel (páginas por semana)"
                hint="Considera impresiones y cuadernos."
                input={
                  <input
                    className="h-11 w-full rounded-2xl border border-border bg-white/4 px-4 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    type="number"
                    inputMode="numeric"
                    {...form.register("paperPagesWeek", { valueAsNumber: true })}
                  />
                }
              />
              <Field
                label="Energía (kWh por mes)"
                hint="Aproximación de consumo en casa."
                input={
                  <input
                    className="h-11 w-full rounded-2xl border border-border bg-white/4 px-4 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    type="number"
                    inputMode="numeric"
                    {...form.register("energyKwhMonth", { valueAsNumber: true })}
                  />
                }
              />

              <div className="pt-1">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() =>
                    form.reset({
                      transportKmWeek: 25,
                      paperPagesWeek: 10,
                      energyKwhMonth: 120,
                    })
                  }
                >
                  Sugerir escenario “mejorado”
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden">
            <CardHeader>
              <p className="text-sm font-medium">Puntaje ambiental</p>
              <p className="text-xs text-muted-foreground">0–100 (más alto es mejor)</p>
            </CardHeader>
            <CardContent>
              <div className="rounded-3xl border border-border bg-white/4 p-6">
                <div className="flex items-baseline justify-between gap-6">
                  <p className="text-5xl font-semibold tracking-tight">{s}</p>
                  <p className="text-sm text-muted-foreground">
                    {s >= 80
                      ? "Excelente"
                      : s >= 60
                        ? "Bueno"
                        : s >= 40
                          ? "Regular"
                          : "Alto impacto"}
                  </p>
                </div>
                <motion.div className="mt-5 h-2 overflow-hidden rounded-full bg-white/6">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-emerald-300/90 via-lime-300/70 to-amber-300/60"
                    initial={false}
                    animate={{ width: `${s}%` }}
                    transition={{ type: "spring", stiffness: 220, damping: 26 }}
                    aria-hidden="true"
                  />
                </motion.div>
                <div className="mt-5 space-y-2 text-sm text-muted-foreground">
                  <p>
                    Recomendación: prioriza transporte compartido, reduce
                    impresiones y optimiza consumo eléctrico (LED, stand-by).
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </Container>
    </div>
  );
}

function Field({
  label,
  hint,
  input,
}: {
  label: string;
  hint: string;
  input: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <div>
        <p className="text-sm font-medium">{label}</p>
        <p className="text-xs text-muted-foreground">{hint}</p>
      </div>
      {input}
    </div>
  );
}

