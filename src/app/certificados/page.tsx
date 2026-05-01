"use client";

import { useMemo, useRef, useState } from "react";
import { PageHero } from "@/components/content/PageHero";
import { Container } from "@/components/layout/Container";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { toPng } from "html-to-image";

function loadBest(): number | null {
  try {
    const raw = localStorage.getItem("ecopomac:runs");
    const arr = raw ? (JSON.parse(raw) as Array<{ score: number }>) : [];
    if (!Array.isArray(arr)) return null;
    const best = arr.map((r) => r.score).sort((a, b) => b - a)[0];
    return typeof best === "number" ? best : null;
  } catch {
    return null;
  }
}

export default function CertificadosPage() {
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const [name, setName] = useState("Estudiante");
  const [best] = useState<number | null>(() =>
    typeof window === "undefined" ? null : loadBest(),
  );
  const [saving, setSaving] = useState(false);
  const [savedId, setSavedId] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const certRef = useRef<HTMLDivElement | null>(null);

  const today = useMemo(() => {
    try {
      return new Intl.DateTimeFormat("es-PE", { dateStyle: "long" }).format(new Date());
    } catch {
      return new Date().toISOString();
    }
  }, []);

  return (
    <div className="relative">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(950px_520px_at_18%_0%,rgba(52,211,153,0.16),transparent_62%),radial-gradient(950px_520px_at_92%_20%,rgba(176,137,104,0.12),transparent_60%)]"
      />
      <Container className="relative py-14">
        <PageHero
          eyebrow="Cierre de exposición"
          title="Genera un certificado visualmente más sólido y fácil de compartir."
          description="Esta sección sirve como remate de la experiencia: muestra participación, puntaje y una evidencia exportable para PDF o enlace público."
          note="El certificado funciona mejor al final del recorrido, después del juego y del ranking."
          stats={[
            { label: "Salida", value: "Impresión, PDF o enlace público" },
            { label: "Puntaje detectado", value: best === null ? "Aún no disponible" : `${best} puntos` },
            { label: "Uso ideal", value: "Cierre formal de la demo" },
          ]}
          aside={
            <div className="rounded-[1.8rem] border border-white/10 bg-black/25 p-5">
              <p className="text-sm font-medium">Consejo de presentación</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Puedes personalizar el nombre en vivo y exportar el diploma como
                PDF para cerrar la exposición con una evidencia concreta.
              </p>
            </div>
          }
        />

        <div className="mt-10 grid gap-4 lg:grid-cols-[1fr_1fr]">
          <Card>
            <CardHeader>
              <p className="text-sm font-medium">Datos</p>
              <p className="text-xs text-muted-foreground">
                {best === null ? "Tip: juega primero para registrar puntaje." : `Puntaje detectado: ${best}`}
              </p>
            </CardHeader>
            <CardContent className="space-y-3">
              <input
                className="h-11 w-full rounded-2xl border border-border bg-white/4 px-4 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                value={name}
                onChange={(e) => setName(e.target.value)}
                aria-label="Nombre para certificado"
              />
              <Button type="button" onClick={() => window.print()}>
                Imprimir / Guardar como PDF
              </Button>
              <Button
                type="button"
                variant="secondary"
                disabled={saving}
                onClick={async () => {
                  setMsg(null);
                  setSavedId(null);

                  if (!supabase) {
                    setMsg("Falta configurar Supabase (.env.local).");
                    return;
                  }
                  if (best === null) {
                    setMsg("Primero juega para generar un puntaje.");
                    return;
                  }
                  const { data: userData } = await supabase.auth.getUser();
                  if (!userData.user) {
                    setMsg("Debes iniciar sesión para guardar el certificado.");
                    return;
                  }
                  if (!certRef.current) {
                    setMsg("No se pudo generar la imagen del certificado.");
                    return;
                  }

                  setSaving(true);
                  try {
                    // 1) Insert record first to get id (source of truth)
                    const { data: created, error: createErr } = await supabase
                      .from("certificates")
                      .insert({
                        user_id: userData.user.id,
                        display_name: name.trim() || "Estudiante",
                        score: best,
                        is_public: true,
                      })
                      .select("id")
                      .single();

                    if (createErr) throw createErr;
                    const certId = (created as { id: string }).id;

                    // 2) Generate PNG on client from the preview DOM
                    const dataUrl = await toPng(certRef.current, {
                      cacheBust: true,
                      pixelRatio: 2,
                      backgroundColor: "#ffffff",
                    });
                    const blob = await (await fetch(dataUrl)).blob();

                    // 3) Upload to Storage (policies require first folder == auth.uid)
                    const storagePath = `${userData.user.id}/${certId}.png`;
                    const { error: uploadErr } = await supabase.storage
                      .from("certificates")
                      .upload(storagePath, blob, {
                        contentType: "image/png",
                        upsert: true,
                        cacheControl: "3600",
                      });
                    if (uploadErr) throw uploadErr;

                    const { data: urlData } = supabase.storage
                      .from("certificates")
                      .getPublicUrl(storagePath);
                    const publicUrl = urlData.publicUrl;

                    // 4) Update certificate row with storage_path + public_url
                    const { error: updErr } = await supabase
                      .from("certificates")
                      .update({
                        storage_path: storagePath,
                        public_url: publicUrl,
                      })
                      .eq("id", certId);
                    if (updErr) throw updErr;

                    setSavedId(certId);
                    setMsg("Certificado generado (PNG) y guardado. Puedes compartir el enlace.");
                  } catch {
                    setMsg(
                      "No se pudo guardar. Verifica: bucket `certificates`, policies y SQL enterprise_addons.sql.",
                    );
                  } finally {
                    setSaving(false);
                  }
                }}
              >
                {saving ? "Guardando..." : "Guardar certificado (Supabase)"}
              </Button>
              {savedId ? (
                <a
                  href={`/certificados/${savedId}`}
                  className="text-sm text-emerald-200 hover:underline"
                >
                  Abrir certificado público →
                </a>
              ) : null}
              {msg ? <p className="text-sm text-muted-foreground">{msg}</p> : null}
              <p className="text-xs text-muted-foreground">
                Para exportar: usa la opción del navegador “Guardar como PDF”.
              </p>
            </CardContent>
          </Card>

          <Card className="overflow-hidden">
            <CardHeader>
              <p className="text-sm font-medium">Vista previa</p>
              <p className="text-xs text-muted-foreground">Formato A4 friendly</p>
            </CardHeader>
            <CardContent>
              <div
                ref={certRef}
                className="mx-auto flex min-h-[520px] max-w-[560px] flex-col justify-between rounded-[2rem] border border-border bg-white p-5 text-zinc-950 sm:min-h-[660px] sm:p-8"
              >
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold tracking-wide text-emerald-800">
                      EcoPómac
                    </p>
                    <p className="text-xs text-zinc-600">{today}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className="rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-medium text-emerald-900">
                      Conservación ambiental
                    </span>
                    <span className="rounded-full bg-amber-100 px-3 py-1 text-[11px] font-medium text-amber-900">
                      ODS 13 y ODS 15
                    </span>
                  </div>
                  <h2 className="text-2xl font-semibold tracking-tight">
                    Certificado de participación
                  </h2>
                  <p className="text-sm text-zinc-700">
                    Se certifica que
                  </p>
                  <p className="text-3xl font-semibold">{name.trim() || "Estudiante"}</p>
                  <p className="text-sm text-zinc-700">
                    participó en la plataforma educativa sobre la conservación del{" "}
                    <span className="font-medium">Santuario Histórico Bosque de Pómac</span>,
                    completando módulos interactivos y reflexión ambiental.
                  </p>

                  <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                    <p className="text-xs text-zinc-600">Puntaje (juego educativo)</p>
                    <p className="text-2xl font-semibold">{best ?? "—"}</p>
                  </div>

                  <div className="mt-auto pt-6">
                    <div className="h-px bg-zinc-200" />
                    <div className="mt-2 flex items-center justify-between">
                      <p className="text-xs text-zinc-600">Docente / Curso</p>
                      <p className="text-xs text-zinc-600">Universidad</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </Container>
    </div>
  );
}

