"use client";

import { useEffect, useMemo, useState } from "react";
import { PageHero } from "@/components/content/PageHero";
import { Container } from "@/components/layout/Container";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import type { LeaderboardBestRow, Profile } from "@/lib/supabase/types";

type Row = LeaderboardBestRow & { profiles?: Pick<Profile, "display_name"> | null };

function fmt(iso: string) {
  try {
    return new Intl.DateTimeFormat("es-PE", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export function LeaderboardView({
  localBest,
}: {
  localBest: number | null;
}) {
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const [rows, setRows] = useState<Row[]>([]);
  const [email, setEmail] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function loadTop() {
    const sb = supabase;
    if (!sb) return;
    const { data, error } = await sb
      .from("leaderboard_best")
      .select("user_id,best_score,created_at,updated_at,profiles(display_name)")
      .order("best_score", { ascending: false })
      .order("updated_at", { ascending: true })
      .limit(25);
    if (error) throw error;
    setRows((data ?? []) as unknown as Row[]);
  }

  useEffect(() => {
    const sb = supabase;
    if (!sb) return;
    let mounted = true;
    void (async () => {
      try {
        const { data } = await sb.auth.getUser();
        if (!mounted) return;
        setEmail(data.user?.email ?? null);
        await loadTop();
      } catch {
        // ignore
      }
    })();

    const channel = sb
      .channel("leaderboard-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "leaderboard_best" },
        () => {
          void loadTop();
        },
      )
      .subscribe();

    return () => {
      mounted = false;
      void sb.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supabase]);

  return (
    <div className="relative">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(950px_520px_at_18%_0%,rgba(52,211,153,0.16),transparent_62%),radial-gradient(950px_520px_at_92%_20%,rgba(163,230,53,0.10),transparent_60%)]"
      />
      <Container className="relative py-14">
        <PageHero
          eyebrow="Cierre competitivo"
          title="Muestra resultados, participación y continuidad del proyecto."
          description="El ranking le da ritmo a la exposición porque convierte el juego en evidencia visible de participación. Además, demuestra conexión con Supabase y actualización en tiempo real."
          note="Puedes usarlo al final para que la audiencia vea quién obtuvo el mejor puntaje y cómo la experiencia no termina en una sola pantalla."
          stats={[
            { label: "Persistencia", value: "Supabase + Realtime" },
            { label: "Ranking visible", value: "Top 25" },
            { label: "Puntaje local", value: localBest === null ? "Aún no registrado" : `${localBest} puntos` },
          ]}
          aside={
            <div className="rounded-[1.8rem] border border-white/10 bg-black/25 p-5">
              <p className="text-sm font-medium">Sugerencia para la demo</p>
              <div className="mt-3 grid gap-2 text-sm text-muted-foreground">
                <p>1. Juega una ronda corta.</p>
                <p>2. Publica el mejor puntaje.</p>
                <p>3. Abre esta vista para cerrar con participación real.</p>
              </div>
            </div>
          }
        />

        <div className="mt-10 grid gap-4 lg:grid-cols-[1fr_1fr]">
          <Card>
            <CardHeader>
              <p className="text-sm font-medium">Publicar mi puntaje</p>
              <p className="text-xs text-muted-foreground">
                {email ? `Sesión: ${email}` : "Inicia sesión para publicar."}
              </p>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="rounded-3xl border border-border bg-white/4 p-5">
                <p className="text-xs text-muted-foreground">Mejor puntaje local detectado</p>
                <p className="mt-1 text-3xl font-semibold tracking-tight">
                  {localBest ?? "—"}
                </p>
              </div>

              <Button
                type="button"
                disabled={busy || !email || localBest === null}
                onClick={async () => {
                  setMsg(null);
                  if (!supabase) {
                    setMsg("Falta configurar Supabase (.env.local).");
                    return;
                  }
                  setBusy(true);
                  try {
                    const { data: userData } = await supabase.auth.getUser();
                    if (!userData.user) {
                      setMsg("Debes iniciar sesión.");
                      return;
                    }

                    const { error } = await supabase.rpc("submit_best_score", {
                      p_score: localBest,
                    });
                    if (error) throw error;

                    setMsg("Puntaje publicado (si mejoró tu récord).");
                    await loadTop();
                  } catch {
                    setMsg("No se pudo publicar. Revisa RLS / Realtime.");
                  } finally {
                    setBusy(false);
                  }
                }}
              >
                {busy ? "Publicando..." : "Publicar en ranking global"}
              </Button>

              {msg ? <p className="text-sm text-muted-foreground">{msg}</p> : null}
              <p className="text-xs text-muted-foreground">
                Consejo: juega “Salva el Bosque” para generar puntaje.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <p className="text-sm font-medium">Top 25 (Realtime)</p>
              <p className="text-xs text-muted-foreground">
                Se actualiza automáticamente.
              </p>
            </CardHeader>
            <CardContent className="space-y-3">
              {rows.length > 0 ? (
                <div className="grid gap-3 sm:grid-cols-3">
                  {rows.slice(0, 3).map((r, idx) => (
                    <div
                      key={`${r.user_id}-podium`}
                      className="rounded-[1.8rem] border border-white/10 bg-black/20 p-4"
                    >
                      <p className="text-xs uppercase tracking-[0.24em] text-emerald-100/70">
                        #{idx + 1}
                      </p>
                      <p className="mt-2 truncate text-sm font-medium">
                        {r.profiles?.display_name ?? "Usuario"}
                      </p>
                      <p className="mt-1 text-2xl font-semibold tracking-tight">
                        {r.best_score}
                      </p>
                    </div>
                  ))}
                </div>
              ) : null}

              {rows.length === 0 ? (
                <div className="rounded-3xl border border-border bg-white/4 p-5 text-sm text-muted-foreground">
                  Sin datos aún.
                </div>
              ) : null}
              {rows.map((r, idx) => (
                <div
                  key={r.user_id}
                  className="flex items-center justify-between gap-4 rounded-3xl border border-border bg-white/4 px-4 py-3"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">
                      #{idx + 1} · {r.profiles?.display_name ?? "Usuario"}
                    </p>
                    <p className="text-xs text-muted-foreground">{fmt(r.updated_at)}</p>
                  </div>
                  <span className="rounded-full bg-emerald-400/15 px-3 py-1 text-sm font-medium text-emerald-100">
                    {r.best_score}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="mt-4">
          <Card>
            <CardHeader>
              <p className="text-sm font-medium">Compatibilidad</p>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              La app sigue funcionando sin login (puntaje local), pero la
              publicación global requiere sesión para cumplir RLS.
            </CardContent>
          </Card>
        </div>
      </Container>
    </div>
  );
}

