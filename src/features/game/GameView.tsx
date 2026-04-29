"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Container } from "@/components/layout/Container";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { GAME_NODES, initialGameState, type GameNode, type GameState } from "./gameModel";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

function clamp01(n: number) {
  return Math.max(0, Math.min(100, n));
}

function formatDelta(n?: number) {
  if (!n) return "0";
  return `${n > 0 ? "+" : ""}${n}`;
}

function applyDelta(s: GameState, delta: Partial<GameState>): GameState {
  return {
    biodiversity: clamp01(s.biodiversity + (delta.biodiversity ?? 0)),
    water: clamp01(s.water + (delta.water ?? 0)),
    co2: clamp01(s.co2 + (delta.co2 ?? 0)),
    economy: clamp01(s.economy + (delta.economy ?? 0)),
  };
}

function scoreFromState(s: GameState) {
  // “Salud” prioriza biodiversidad/agua, penaliza CO2 y equilibrio económico.
  const co2Health = 100 - s.co2;
  return Math.round(
    0.34 * s.biodiversity + 0.28 * s.water + 0.22 * co2Health + 0.16 * s.economy,
  );
}

function saveLocalScore(score: number) {
  try {
    const key = "ecopomac:runs";
    const raw = localStorage.getItem(key);
    const arr: Array<{ score: number; at: string }> = raw ? JSON.parse(raw) : [];
    arr.unshift({ score, at: new Date().toISOString() });
    localStorage.setItem(key, JSON.stringify(arr.slice(0, 30)));
  } catch {
    // ignore
  }
}

async function submitBestScoreIfAuthed(finalScore: number) {
  const supabase = createSupabaseBrowserClient();
  if (!supabase) return;
  const { data } = await supabase.auth.getUser();
  if (!data.user) return;
  await supabase.rpc("submit_best_score", { p_score: finalScore });
}

export function GameView() {
  const [nodeId, setNodeId] = useState<string>("start");
  const [state, setState] = useState<GameState>(initialGameState);
  const [presentationMode, setPresentationMode] = useState(false);
  const [comparison, setComparison] = useState<{
    choiceLabel: string;
    before: GameState;
    after: GameState;
  } | null>(null);
  const node: GameNode = GAME_NODES[nodeId] ?? GAME_NODES.start;

  const score = useMemo(() => scoreFromState(state), [state]);
  const step = nodeId === "start" ? 1 : nodeId === "final" ? 3 : 2;
  const progress = Math.round((step / 3) * 100);

  const isFinal = nodeId === "final";

  return (
    <div className="relative">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(900px_520px_at_20%_0%,rgba(52,211,153,0.16),transparent_62%),radial-gradient(900px_520px_at_95%_20%,rgba(163,230,53,0.12),transparent_60%)]"
      />
      <Container className="relative py-14">
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="mb-4 rounded-2xl border border-border bg-white/5 p-3"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs text-muted-foreground">Estado de la partida</p>
              <p className="text-sm font-medium">
                Etapa {step}/3 · Puntaje actual <span className="text-emerald-200">{score}</span>
              </p>
            </div>
            <button
              type="button"
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs transition-colors",
                presentationMode
                  ? "border-emerald-300/50 bg-emerald-300/18 text-emerald-100"
                  : "border-border bg-white/6 hover:bg-white/10",
              )}
              onClick={() => setPresentationMode((prev) => !prev)}
            >
              {presentationMode ? "Modo presentación: ON" : "Modo presentación: OFF"}
            </button>
          </div>
        </motion.div>

        <div className="mb-4 rounded-2xl border border-border bg-white/4 p-3 text-sm">
          <p className="font-medium">Como jugar</p>
          <p className="mt-1 text-muted-foreground">
            1) Elige una decision. 2) Mira el bloque &quot;Antes vs Despues&quot;. 3) Intenta terminar con puntaje mayor a 75.
          </p>
        </div>

        <AnimateDecisionComparison comparison={comparison} presentationMode={presentationMode} />

        <div className="grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
          <Card className={cn("overflow-hidden", presentationMode && "border-emerald-300/25 bg-black/35")}>
            <CardHeader className="space-y-1">
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs text-muted-foreground">Juego educativo</p>
                <span className="rounded-full border border-border bg-white/5 px-2.5 py-1 text-[11px] text-muted-foreground">
                  Etapa: {node.id}
                </span>
              </div>
              <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
                {node.title}
              </h1>
              <p className="text-pretty text-sm text-foreground/90">{node.prompt}</p>
              <div className="mt-3 rounded-2xl border border-border bg-white/4 p-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Progreso de partida</span>
                  <span className="font-medium">{progress}%</span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/8">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-emerald-300/90 via-lime-300/70 to-amber-300/60"
                    initial={false}
                    animate={{ width: `${progress}%` }}
                    transition={{ type: "spring", stiffness: 220, damping: 26 }}
                  />
                </div>
                <div className="mt-2 grid grid-cols-3 gap-2 text-[11px]">
                  <MiniStat label="Biodiv." value={state.biodiversity} />
                  <MiniStat label="Agua" value={state.water} />
                  <MiniStat label="CO2" value={state.co2} />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {node.choices.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  className={cn(
                    "w-full rounded-3xl border border-border bg-white/4 px-5 py-4 text-left transition-all hover:border-emerald-200/30 hover:bg-white/8 focus-visible:ring-2 focus-visible:ring-ring",
                  )}
                  onClick={() => {
                    if (nodeId === "final" && c.id === "restart") {
                      setState(initialGameState);
                      setNodeId("start");
                      return;
                    }

                    const next = c.nextId;
                    const before = state;
                    const nextState = applyDelta(state, c.delta);
                    setComparison({
                      choiceLabel: c.label,
                      before,
                      after: nextState,
                    });
                    setState(nextState);

                    if (nodeId === "final" && c.id === "ranking") {
                      const finalScore = scoreFromState(nextState);
                      saveLocalScore(finalScore);
                      void submitBestScoreIfAuthed(finalScore);
                      window.location.href = "/ranking";
                      return;
                    }

                    if (next) {
                      setNodeId(next);
                      if (next === "final") {
                        const finalScore = scoreFromState(nextState);
                        saveLocalScore(finalScore);
                        void submitBestScoreIfAuthed(finalScore);
                      }
                    }
                  }}
                >
                  {(() => {
                    const projectedState = applyDelta(state, c.delta);
                    const projected = scoreFromState(projectedState);
                    const deltaScore = projected - score;
                    return (
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-base font-semibold text-foreground">{c.label}</p>
                      <p className="mt-1 text-xs text-muted-foreground">{c.note}</p>
                      <div className="mt-3 flex flex-wrap gap-1.5 text-[10px]">
                        <ImpactPill label="Biodiv." value={formatDelta(c.delta.biodiversity)} />
                        <ImpactPill label="Agua" value={formatDelta(c.delta.water)} />
                        <ImpactPill label="CO2" value={formatDelta(c.delta.co2)} negativeIsGood />
                        <ImpactPill label="Economía" value={formatDelta(c.delta.economy)} />
                      </div>
                      <p className="mt-2 text-[11px] text-emerald-100/85">
                        Puntaje proyectado: <span className="font-semibold">{projected}</span>{" "}
                        <span className={cn("font-semibold", deltaScore >= 0 ? "text-emerald-200" : "text-rose-200")}>
                          ({deltaScore >= 0 ? "+" : ""}
                          {deltaScore})
                        </span>
                      </p>
                    </div>
                    <span className="rounded-full border border-emerald-200/30 bg-emerald-400/15 px-3 py-1 text-xs text-emerald-100">
                      Elegir
                    </span>
                  </div>
                    );
                  })()}
                </button>
              ))}

              {isFinal ? (
                <div className="pt-2">
                  <Link
                    href="/certificados"
                    className="text-sm text-emerald-200 hover:underline"
                  >
                    Generar certificado de participación →
                  </Link>
                </div>
              ) : null}
            </CardContent>
          </Card>

          <Card className={cn(presentationMode && "border-emerald-300/25 bg-black/35")}>
            <CardHeader>
              <p className="text-sm font-medium">Indicadores</p>
              <p className="text-xs text-muted-foreground">
                Cada decisión modifica el balance ambiental y social.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-b from-emerald-300/10 via-sky-300/10 to-amber-300/10 p-4">
                <p className="text-xs text-muted-foreground">Estado del territorio (visual)</p>
                <div className="relative mt-3 h-20 rounded-2xl border border-border/60 bg-black/15">
                  <motion.div
                    className="absolute bottom-0 left-0 h-8 rounded-r-full bg-emerald-300/45"
                    initial={false}
                    animate={{ width: `${state.biodiversity}%` }}
                  />
                  <motion.div
                    className="absolute bottom-0 right-0 h-5 rounded-l-full bg-rose-300/45"
                    initial={false}
                    animate={{ width: `${state.co2}%` }}
                  />
                  <motion.div
                    className="absolute bottom-1 left-4 h-3 rounded-full bg-sky-300/70"
                    initial={false}
                    animate={{ width: `${Math.max(10, state.water - 15)}%` }}
                  />
                </div>
              </div>

              <Meter label="Biodiversidad" value={state.biodiversity} tone="good" />
              <Meter label="Agua" value={state.water} tone="good" />
              <Meter label="Emisiones de CO₂ (presión)" value={state.co2} tone="bad" invert />
              <Meter label="Economía local" value={state.economy} tone="neutral" />

              <div className="rounded-3xl border border-border bg-white/4 p-5">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">Puntaje final</p>
                  <span className="text-xs text-muted-foreground">0–100</span>
                </div>
                <div className="mt-2 flex items-baseline justify-between">
                  <p className="text-4xl font-semibold tracking-tight">{score}</p>
                  <p className="text-xs text-muted-foreground">
                    {score >= 75
                      ? "Excelente equilibrio"
                      : score >= 55
                        ? "Buen desempeño"
                        : "Riesgo alto"}
                  </p>
                </div>
                <motion.div
                  className="mt-4 h-2 overflow-hidden rounded-full bg-white/6"
                  initial={false}
                >
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-emerald-300/90 via-lime-300/70 to-amber-300/60"
                    initial={false}
                    animate={{ width: `${score}%` }}
                    transition={{ type: "spring", stiffness: 220, damping: 26 }}
                    aria-hidden="true"
                  />
                </motion.div>
                <div className="mt-4 flex gap-3">
                  <Button
                    type="button"
                    variant="secondary"
                    className="w-full"
                    onClick={() => {
                      saveLocalScore(score);
                      void submitBestScoreIfAuthed(score);
                      window.location.href = "/ranking";
                    }}
                  >
                    Ver ranking
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    className="w-full"
                    onClick={() => {
                      setState(initialGameState);
                      setNodeId("start");
                    }}
                  >
                    Reiniciar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </Container>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-border bg-black/15 px-2 py-1.5">
      <p className="text-[10px] text-muted-foreground">{label}</p>
      <p className="text-xs font-semibold">{value}</p>
    </div>
  );
}

function AnimateDecisionComparison({
  comparison,
  presentationMode,
}: {
  comparison: { choiceLabel: string; before: GameState; after: GameState } | null;
  presentationMode: boolean;
}) {
  return (
    <AnimatePresence>
      {comparison ? (
        <motion.div
          key={`${comparison.choiceLabel}-${comparison.after.biodiversity}-${comparison.after.water}-${comparison.after.co2}-${comparison.after.economy}`}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.26 }}
          className={cn(
            "mb-4 rounded-2xl border border-border bg-white/4 p-3",
            presentationMode && "border-emerald-300/25 bg-black/35",
          )}
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-xs text-muted-foreground">
              Antes vs Despues de: <span className="text-foreground">{comparison.choiceLabel}</span>
            </p>
            <span className="text-[11px] text-emerald-100/90">Actualizacion en tiempo real</span>
          </div>
          <div className="mt-2 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            <CompareItem label="Biodiversidad" before={comparison.before.biodiversity} after={comparison.after.biodiversity} />
            <CompareItem label="Agua" before={comparison.before.water} after={comparison.after.water} />
            <CompareItem label="CO2" before={comparison.before.co2} after={comparison.after.co2} invert />
            <CompareItem label="Economia" before={comparison.before.economy} after={comparison.after.economy} />
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function CompareItem({
  label,
  before,
  after,
  invert,
}: {
  label: string;
  before: number;
  after: number;
  invert?: boolean;
}) {
  const deltaRaw = after - before;
  const delta = invert ? -deltaRaw : deltaRaw;
  const good = delta >= 0;
  return (
    <div className="rounded-xl border border-border bg-black/15 p-2">
      <p className="text-[11px] text-muted-foreground">{label}</p>
      <p className="text-sm">
        <span className="font-semibold">{before}</span>{" "}
        <span className="text-muted-foreground">{"->"}</span>{" "}
        <span className="font-semibold">{after}</span>
      </p>
      <p className={cn("text-[11px] font-medium", good ? "text-emerald-200" : "text-rose-200")}>
        {good ? "Mejora" : "Deterioro"} ({deltaRaw >= 0 ? "+" : ""}
        {deltaRaw})
      </p>
    </div>
  );
}

function ImpactPill({
  label,
  value,
  negativeIsGood,
}: {
  label: string;
  value: string;
  negativeIsGood?: boolean;
}) {
  const numeric = Number(value);
  const positive = negativeIsGood ? numeric <= 0 : numeric >= 0;
  return (
    <span
      className={cn(
        "rounded-full border px-2 py-0.5 font-medium",
        positive
          ? "border-emerald-300/40 bg-emerald-300/15 text-emerald-100"
          : "border-rose-300/40 bg-rose-300/12 text-rose-100",
      )}
    >
      {label} {value}
    </span>
  );
}

function Meter({
  label,
  value,
  tone,
  invert,
}: {
  label: string;
  value: number;
  tone: "good" | "neutral" | "bad";
  invert?: boolean;
}) {
  const bar = invert ? 100 - value : value;
  const color =
    tone === "good"
      ? "from-emerald-300/90 via-lime-300/70 to-emerald-200/70"
      : tone === "bad"
        ? "from-rose-300/80 via-amber-300/55 to-rose-200/60"
        : "from-sky-300/70 via-emerald-200/40 to-amber-200/40";

  return (
    <div className="rounded-3xl border border-border bg-white/4 p-4">
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-foreground/90">{label}</p>
        <p className="text-sm font-semibold">{value}</p>
      </div>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/6">
        <div
          className={cn("h-full rounded-full bg-gradient-to-r", color)}
          style={{ width: `${bar}%` }}
          aria-hidden="true"
        />
      </div>
    </div>
  );
}

