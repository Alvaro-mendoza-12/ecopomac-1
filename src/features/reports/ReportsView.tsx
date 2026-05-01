"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { PageHero } from "@/components/content/PageHero";
import { Container } from "@/components/layout/Container";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import {
  reportSchema,
  type ReportDbRow,
  type ReportRecord,
} from "@/features/reports/reportSchema";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

type FormValues = z.infer<typeof reportSchema>;

function formatDate(iso: string) {
  try {
    return new Intl.DateTimeFormat("es-PE", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export function ReportsView() {
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const [reports, setReports] = useState<ReportRecord[] | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [serverMsg, setServerMsg] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      type: "Tala ilegal",
      description: "",
      locationHint: "",
      contact: "",
    },
  });

  const errors = form.formState.errors;
  const hasErrors = useMemo(() => Object.keys(errors).length > 0, [errors]);

  useEffect(() => {
    const sb = supabase;
    if (!sb) return;
    let cancelled = false;
    async function load(client: NonNullable<typeof sb>) {
      try {
        const { data: userData } = await client.auth.getUser();
        if (!userData.user) {
          if (!cancelled) setReports([]);
          return;
        }

        const { data, error } = await client
          .from("reports")
          .select("id,type,description,location_hint,contact_email,created_at")
          .order("created_at", { ascending: false })
          .limit(50);
        if (error) throw error;

        const mapped = (data as ReportDbRow[]).map((r) => ({
          id: r.id,
          type: r.type,
          description: r.description,
          locationHint: r.location_hint,
          contact: r.contact_email ?? "",
          createdAt: r.created_at,
        }));
        if (!cancelled) setReports(mapped);
      } catch {
        // ignore
      }
    }
    void load(sb);
    return () => {
      cancelled = true;
    };
  }, [supabase]);

  const loading = !!supabase && reports === null;

  return (
    <div className="relative">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(950px_520px_at_18%_0%,rgba(52,211,153,0.16),transparent_62%),radial-gradient(950px_520px_at_92%_20%,rgba(251,113,133,0.10),transparent_60%)]"
      />
      <Container className="relative py-14">
        <PageHero
          eyebrow="Participación comunitaria"
          title="Convierte la preocupación ambiental en acción reportable."
          description="El ensayo subraya que la conservación requiere vigilancia, respuesta institucional y participación social. Este módulo representa esa idea con un flujo simple para reportar incidentes ambientales."
          note="Funciona bien para explicar que la tecnología no solo informa: también puede apoyar prevención, monitoreo y organización comunitaria."
          stats={[
            { label: "Reportes posibles", value: "Tala, incendios y contaminación" },
            { label: "Propósito", value: "Prevención y seguimiento" },
            { label: "Uso en demo", value: "Flujo completo con Supabase" },
          ]}
          aside={
            <div className="rounded-[1.8rem] border border-white/10 bg-black/25 p-5">
              <p className="text-sm font-medium">Qué conviene mencionar</p>
              <div className="mt-3 grid gap-2 text-sm text-muted-foreground">
                <p>1. Qué pasó.</p>
                <p>2. Dónde ocurrió.</p>
                <p>3. Por qué registrar evidencia ayuda a la conservación.</p>
              </div>
            </div>
          }
        />

        <div className="mt-10 grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
          <Card>
            <CardHeader>
              <p className="text-sm font-medium">Nuevo reporte</p>
              <p className="text-xs text-muted-foreground">
                Campos obligatorios: tipo, descripción y referencia de ubicación.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <label className="text-sm font-medium" htmlFor="type">
                  Tipo
                </label>
                <select
                  id="type"
                  className="h-11 w-full rounded-2xl border border-border bg-white/4 px-4 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  {...form.register("type")}
                >
                  <option value="Tala ilegal">Tala ilegal</option>
                  <option value="Incendio">Incendio</option>
                  <option value="Contaminación">Contaminación</option>
                </select>
              </div>

              <div className="grid gap-2">
                <label className="text-sm font-medium" htmlFor="locationHint">
                  Ubicación (referencia)
                </label>
                <input
                  id="locationHint"
                  className="h-11 w-full rounded-2xl border border-border bg-white/4 px-4 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  placeholder="Ej: Cerca del acceso X / coordenadas aproximadas"
                  {...form.register("locationHint")}
                />
                {errors.locationHint ? (
                  <p className="text-xs text-rose-200">{errors.locationHint.message}</p>
                ) : null}
              </div>

              <div className="grid gap-2">
                <label className="text-sm font-medium" htmlFor="description">
                  Descripción
                </label>
                <textarea
                  id="description"
                  className="min-h-32 w-full rounded-2xl border border-border bg-white/4 px-4 py-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  placeholder="Describe lo ocurrido, evidencia, hora aproximada, etc."
                  {...form.register("description")}
                />
                {errors.description ? (
                  <p className="text-xs text-rose-200">{errors.description.message}</p>
                ) : null}
              </div>

              <div className="grid gap-2">
                <label className="text-sm font-medium" htmlFor="contact">
                  Contacto (opcional)
                </label>
                <input
                  id="contact"
                  className="h-11 w-full rounded-2xl border border-border bg-white/4 px-4 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  placeholder="correo@ejemplo.com"
                  {...form.register("contact")}
                />
                {errors.contact ? (
                  <p className="text-xs text-rose-200">{errors.contact.message}</p>
                ) : null}
              </div>

              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <Button
                  type="button"
                  disabled={submitting}
                  onClick={async () => {
                    setServerMsg(null);
                    if (!supabase) {
                      setServerMsg(
                        "Falta configurar Supabase (.env.local). Revisa SUPABASE_SETUP.md.",
                      );
                      return;
                    }
                    const { data: userData } = await supabase.auth.getUser();
                    if (!userData.user) {
                      setServerMsg("Debes iniciar sesión para enviar un reporte.");
                      return;
                    }

                    const ok = await form.trigger();
                    if (!ok) return;
                    const values = form.getValues();
                    setSubmitting(true);
                    try {
                      const insert = {
                        created_by: userData.user.id,
                        type: values.type,
                        description: values.description,
                        location_hint: values.locationHint,
                        contact_email: values.contact ? values.contact : null,
                      };

                      const { data, error } = await supabase
                        .from("reports")
                        .insert(insert)
                        .select("id,type,description,location_hint,contact_email,created_at")
                        .single();

                      if (error) throw error;

                      const r = data as unknown as ReportDbRow;
                      setReports((prev) => {
                        const current = prev ?? [];
                        return [
                          {
                            id: r.id,
                            type: r.type,
                            description: r.description,
                            locationHint: r.location_hint,
                            contact: r.contact_email ?? "",
                            createdAt: r.created_at,
                          },
                          ...current,
                        ];
                      });

                      form.reset({
                        ...values,
                        description: "",
                        locationHint: "",
                      });
                      setServerMsg("Reporte enviado. Gracias por contribuir.");
                    } catch {
                      setServerMsg("Error de red. Intenta nuevamente.");
                    } finally {
                      setSubmitting(false);
                    }
                  }}
                >
                  {submitting ? "Enviando..." : "Enviar reporte"}
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => form.reset()}
                >
                  Limpiar
                </Button>
                {hasErrors ? (
                  <span className="text-xs text-rose-200">
                    Corrige los campos marcados.
                  </span>
                ) : null}
              </div>

              {serverMsg ? (
                <p className="text-sm text-muted-foreground">{serverMsg}</p>
              ) : null}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <p className="text-sm font-medium">Reportes recientes</p>
              <p className="text-xs text-muted-foreground">
                {loading ? "Cargando..." : `${(reports ?? []).length} visibles`}
              </p>
            </CardHeader>
            <CardContent className="space-y-3">
              {!supabase ? (
                <div className="rounded-3xl border border-border bg-white/4 p-5 text-sm text-muted-foreground">
                  Supabase no está configurado. Revisa `SUPABASE_SETUP.md`.
                </div>
              ) : null}

              {(reports ?? []).length === 0 && !loading ? (
                <div className="rounded-3xl border border-border bg-white/4 p-5 text-sm text-muted-foreground">
                  No hay reportes visibles. Si no has iniciado sesión, ve a “Ingresar”.
                </div>
              ) : null}
              {(reports ?? []).slice(0, 8).map((r) => (
                <div
                  key={r.id}
                  className="rounded-3xl border border-border bg-white/4 p-4"
                >
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-sm font-medium">{r.type}</p>
                    <p className="text-xs text-muted-foreground">{formatDate(r.createdAt)}</p>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {r.locationHint}
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {r.description}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </Container>
    </div>
  );
}

