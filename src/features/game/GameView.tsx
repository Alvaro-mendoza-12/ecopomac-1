"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  BadgeCheck,
  Circle,
  Diamond,
  Flame,
  PlayCircle,
  Square,
  TimerReset,
  Triangle,
  Trophy,
} from "lucide-react";
import { Container } from "@/components/layout/Container";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Button, ButtonLink } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { POMAC_MEDIA } from "@/lib/pomacMedia";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import {
  calculateQuestionScore,
  describePerformance,
  GAME_QUESTIONS,
  type GameResult,
} from "./gameModel";

const STORAGE_KEY = "ecopomac:runs";

const answerDecor = [
  {
    icon: Triangle,
    label: "A",
    className:
      "border-rose-200/20 bg-gradient-to-br from-rose-500/90 via-fuchsia-500/80 to-orange-400/75 text-white",
  },
  {
    icon: Diamond,
    label: "B",
    className:
      "border-sky-200/20 bg-gradient-to-br from-sky-500/90 via-cyan-500/80 to-blue-400/75 text-white",
  },
  {
    icon: Circle,
    label: "C",
    className:
      "border-amber-200/20 bg-gradient-to-br from-amber-400/90 via-yellow-400/80 to-orange-300/75 text-zinc-950",
  },
  {
    icon: Square,
    label: "D",
    className:
      "border-emerald-200/20 bg-gradient-to-br from-emerald-500/90 via-lime-500/80 to-teal-400/75 text-white",
  },
] as const;

function loadLocalBest() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const arr = raw ? (JSON.parse(raw) as Array<{ score: number }>) : [];
    if (!Array.isArray(arr)) return null;
    const best = arr
      .map((item) => item.score)
      .filter((value) => typeof value === "number")
      .sort((a, b) => b - a)[0];
    return typeof best === "number" ? best : null;
  } catch {
    return null;
  }
}

function saveLocalScore(score: number) {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const arr: Array<{ score: number; at: string }> = raw ? JSON.parse(raw) : [];
    arr.unshift({ score, at: new Date().toISOString() });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(arr.slice(0, 30)));
  } catch {
    // ignore local-only persistence errors
  }
}

async function submitBestScoreIfAuthed(finalScore: number) {
  const supabase = createSupabaseBrowserClient();
  if (!supabase) return;
  const { data } = await supabase.auth.getUser();
  if (!data.user) return;
  await supabase.rpc("submit_best_score", { p_score: finalScore });
}

type Phase = "intro" | "playing" | "summary";

export function GameView() {
  const totalQuestions = GAME_QUESTIONS.length;
  const [phase, setPhase] = useState<Phase>("intro");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_QUESTIONS[0]?.timerSeconds ?? 0);
  const [selectedChoiceId, setSelectedChoiceId] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [results, setResults] = useState<GameResult[]>([]);
  const [localBest, setLocalBest] = useState<number | null>(() =>
    typeof window === "undefined" ? null : loadLocalBest(),
  );
  const scoreSavedRef = useRef(false);

  const currentQuestion = GAME_QUESTIONS[Math.min(questionIndex, totalQuestions - 1)];
  const selectedChoice =
    currentQuestion?.choices.find((choice) => choice.id === selectedChoiceId) ?? null;
  const correctChoice =
    currentQuestion?.choices.find((choice) => choice.isCorrect) ?? currentQuestion?.choices[0];
  const progress =
    phase === "intro"
      ? 0
      : phase === "summary"
        ? 100
        : Math.round((questionIndex / totalQuestions) * 100);
  const timerProgress = currentQuestion
    ? Math.max(0, Math.round((timeLeft / currentQuestion.timerSeconds) * 100))
    : 0;
  const performanceText = describePerformance(score, correctCount);
  const displayedLocalBest =
    phase === "summary"
      ? Math.max(localBest ?? 0, score)
      : localBest;

  const revealCurrentQuestion = useCallback(
    (choiceId: string | null) => {
      if (phase !== "playing" || revealed || !currentQuestion || !correctChoice) return;

      const choice =
        currentQuestion.choices.find((item) => item.id === choiceId) ?? null;
      const isCorrect = Boolean(choice?.isCorrect);
      const nextStreak = isCorrect ? streak + 1 : 0;
      const gainedPoints = isCorrect
        ? calculateQuestionScore(timeLeft, currentQuestion.timerSeconds, streak)
        : 0;

      setSelectedChoiceId(choiceId);
      setRevealed(true);
      setScore((previous) => previous + gainedPoints);
      setCorrectCount((previous) => previous + (isCorrect ? 1 : 0));
      setStreak(nextStreak);
      setBestStreak((previous) => Math.max(previous, nextStreak));
      setResults((previous) => [
        ...previous,
        {
          questionId: currentQuestion.id,
          prompt: currentQuestion.prompt,
          selectedLabel: choice?.label ?? "Tiempo agotado",
          correctLabel: correctChoice.label,
          isCorrect,
          points: gainedPoints,
          fact: currentQuestion.fact,
        },
      ]);
    },
    [correctChoice, currentQuestion, phase, revealed, streak, timeLeft],
  );

  useEffect(() => {
    if (phase !== "playing" || revealed || !currentQuestion) return;

    const timerId = window.setTimeout(() => {
      if (timeLeft <= 1) {
        revealCurrentQuestion(null);
        return;
      }

      setTimeLeft((previous) => previous - 1);
    }, 1000);

    return () => window.clearTimeout(timerId);
  }, [currentQuestion, phase, revealed, timeLeft, revealCurrentQuestion]);

  useEffect(() => {
    if (phase !== "summary" || scoreSavedRef.current) return;
    scoreSavedRef.current = true;
    saveLocalScore(score);
    void submitBestScoreIfAuthed(score);
  }, [phase, score]);

  function beginChallenge() {
    scoreSavedRef.current = false;
    setLocalBest(loadLocalBest());
    setPhase("playing");
    setQuestionIndex(0);
    setTimeLeft(GAME_QUESTIONS[0]?.timerSeconds ?? 0);
    setSelectedChoiceId(null);
    setRevealed(false);
    setScore(0);
    setCorrectCount(0);
    setStreak(0);
    setBestStreak(0);
    setResults([]);
  }

  function goToNextQuestion() {
    if (!currentQuestion) return;
    const isLastQuestion = questionIndex >= totalQuestions - 1;

    if (isLastQuestion) {
      setPhase("summary");
      return;
    }

    const nextQuestion = GAME_QUESTIONS[questionIndex + 1];
    setQuestionIndex((previous) => previous + 1);
    setTimeLeft(nextQuestion.timerSeconds);
    setSelectedChoiceId(null);
    setRevealed(false);
  }

  return (
    <div className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(980px_560px_at_18%_0%,rgba(52,211,153,0.16),transparent_62%),radial-gradient(1000px_620px_at_92%_16%,rgba(59,130,246,0.12),transparent_58%),radial-gradient(840px_540px_at_50%_110%,rgba(176,137,104,0.18),transparent_56%)]"
      />
      <div aria-hidden="true" className="noise absolute inset-0 opacity-70" />

      <Container className="relative py-10 sm:py-14">
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-2">
            <p className="inline-flex w-fit items-center gap-2 rounded-full border border-border bg-white/6 px-4 py-2 text-xs text-muted-foreground backdrop-blur">
              Desafío tipo Kahoot · Bosque de Pómac
            </p>
            <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
              Responde rápido, aprende mejor y conecta tu puntaje con el resto de la plataforma.
            </h1>
            <p className="max-w-3xl text-pretty text-sm leading-6 text-muted-foreground sm:text-base">
              Este reto usa imágenes reales del Bosque de Pómac y guarda tu mejor
              resultado para publicarlo en el ranking o llevarlo al módulo de certificados.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <SummaryChip label="Preguntas" value={`${totalQuestions}`} />
            <SummaryChip label="Racha actual" value={`${streak}`} />
            <SummaryChip
              label="Mejor local"
              value={displayedLocalBest === null ? "—" : `${displayedLocalBest}`}
            />
          </div>
        </div>

        {phase !== "intro" ? (
          <Card className="mb-5 border-white/10 bg-white/5">
            <CardContent className="p-4">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex flex-wrap items-center gap-3 text-sm">
                  <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-muted-foreground">
                    Progreso general {progress}%
                  </span>
                  <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-muted-foreground">
                    Pregunta {Math.min(questionIndex + 1, totalQuestions)}/{totalQuestions}
                  </span>
                  <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-muted-foreground">
                    Aciertos {correctCount}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <div
                    className={cn(
                      "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm",
                      timeLeft <= 5
                        ? "border-rose-300/40 bg-rose-300/12 text-rose-100"
                        : "border-sky-300/30 bg-sky-300/10 text-sky-100",
                    )}
                  >
                    <TimerReset className="h-4 w-4" aria-hidden="true" />
                    {timeLeft}s
                  </div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300/30 bg-emerald-300/12 px-3 py-1 text-sm text-emerald-100">
                    <Trophy className="h-4 w-4" aria-hidden="true" />
                    {score} pts
                  </div>
                </div>
              </div>

              <div className="mt-4 h-2 overflow-hidden rounded-full bg-black/20">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-300 via-lime-300 to-sky-300"
                  animate={{ width: `${progress}%` }}
                  transition={{ type: "spring", stiffness: 180, damping: 24 }}
                />
              </div>
            </CardContent>
          </Card>
        ) : null}

        <div className="grid gap-5 xl:grid-cols-[1.08fr_0.92fr]">
          <div className="space-y-5">
            {phase === "intro" ? (
              <Card className="overflow-hidden border-white/10 bg-black/25">
                <CardContent className="grid gap-5 p-0 lg:grid-cols-[1.05fr_0.95fr]">
                  <div className="space-y-5 p-6">
                    <div className="space-y-3">
                      <p className="text-xs uppercase tracking-[0.28em] text-emerald-100/75">
                        Cómo funciona
                      </p>
                      <h2 className="text-3xl font-semibold tracking-tight">
                        Un reto rápido, visual y conectado con ranking y certificados.
                      </h2>
                      <p className="text-sm leading-6 text-muted-foreground">
                        Tendrás preguntas con tiempo limitado, respuestas de gran
                        formato al estilo concurso y retroalimentación instantánea
                        sobre conservación, turismo responsable y patrimonio del
                        Bosque de Pómac.
                      </p>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-3">
                      <SummaryChip label="Tiempo" value="18–20s" />
                      <SummaryChip label="Máximo" value="4000 pts" />
                      <SummaryChip label="Conexión" value="Ranking + certificado" />
                    </div>

                    <div className="rounded-[2rem] border border-white/10 bg-white/5 p-4">
                      <p className="text-sm font-medium">Ruta del puntaje</p>
                      <p className="mt-2 text-sm leading-6 text-muted-foreground">
                        Al terminar, tu resultado se guarda localmente. Si tienes
                        sesión iniciada, también se envía al ranking global y el
                        módulo de certificados podrá reutilizar tu mejor marca.
                      </p>
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row">
                      <Button type="button" size="lg" onClick={beginChallenge}>
                        Empezar desafío <PlayCircle className="h-4 w-4" />
                      </Button>
                      <ButtonLink href="/ranking" variant="secondary" size="lg">
                        Ver ranking global <ArrowRight className="h-4 w-4" />
                      </ButtonLink>
                    </div>
                  </div>

                  <div className="relative min-h-80 overflow-hidden">
                    <video
                      className="h-full w-full object-cover"
                      autoPlay
                      muted
                      loop
                      playsInline
                      preload="metadata"
                      poster={POMAC_MEDIA.heroPoster}
                    >
                      <source src={POMAC_MEDIA.heroVideo} type="video/mp4" />
                      Tu navegador no soporta video HTML5.
                    </video>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 space-y-2 p-6">
                      <p className="text-xs uppercase tracking-[0.28em] text-emerald-100/75">
                        Video desde IMG
                      </p>
                      <p className="max-w-sm text-lg font-semibold">
                        El juego abre con el paisaje real del santuario para dar más contexto a cada pregunta.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : null}

            {phase === "playing" && currentQuestion ? (
              <Card className="overflow-hidden border-white/10 bg-black/30">
                <CardContent className="p-0">
                  <div className="border-b border-white/10 p-6">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <p className="rounded-full border border-white/10 bg-white/6 px-3 py-1 text-xs uppercase tracking-[0.22em] text-emerald-100/80">
                        {currentQuestion.eyebrow}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Bonus por velocidad + racha
                      </p>
                    </div>

                    <h2 className="mt-4 text-balance text-2xl font-semibold tracking-tight sm:text-3xl">
                      {currentQuestion.prompt}
                    </h2>
                    <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">
                      {currentQuestion.support}
                    </p>

                    <div className="mt-4 h-2 overflow-hidden rounded-full bg-black/20">
                      <motion.div
                        className={cn(
                          "h-full rounded-full",
                          timeLeft <= 5
                            ? "bg-gradient-to-r from-rose-400 via-amber-300 to-yellow-200"
                            : "bg-gradient-to-r from-sky-300 via-cyan-300 to-emerald-300",
                        )}
                        animate={{ width: `${timerProgress}%` }}
                        transition={{ type: "spring", stiffness: 180, damping: 22 }}
                      />
                    </div>
                  </div>

                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentQuestion.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.22 }}
                      className="grid gap-3 p-5 sm:grid-cols-2"
                    >
                      {currentQuestion.choices.map((choice, index) => (
                        <AnswerTile
                          key={choice.id}
                          choice={choice}
                          selected={selectedChoiceId === choice.id}
                          revealed={revealed}
                          onSelect={() => revealCurrentQuestion(choice.id)}
                          decor={answerDecor[index]}
                        />
                      ))}
                    </motion.div>
                  </AnimatePresence>

                  <div className="border-t border-white/10 bg-white/[0.03] p-5">
                    {revealed ? (
                      <div className="space-y-4">
                        <div
                          className={cn(
                            "rounded-[2rem] border p-4",
                            selectedChoice?.isCorrect
                              ? "border-emerald-300/35 bg-emerald-300/10"
                              : "border-rose-300/35 bg-rose-300/10",
                          )}
                        >
                          <p className="text-sm font-medium">
                            {selectedChoice?.isCorrect
                              ? "Respuesta correcta"
                              : selectedChoice
                                ? "Respuesta incorrecta"
                                : "Tiempo agotado"}
                          </p>
                          <p className="mt-2 text-sm leading-6 text-muted-foreground">
                            {selectedChoice?.explanation ?? correctChoice?.explanation}
                          </p>
                          {!selectedChoice?.isCorrect && correctChoice ? (
                            <p className="mt-2 text-sm text-emerald-100">
                              Correcta: <span className="font-medium">{correctChoice.label}</span>
                            </p>
                          ) : null}
                        </div>

                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                          <p className="text-sm text-muted-foreground">
                            Dato clave: <span className="text-foreground">{currentQuestion.fact}</span>
                          </p>
                          <Button type="button" onClick={goToNextQuestion}>
                            {questionIndex >= totalQuestions - 1
                              ? "Ver resultados"
                              : "Siguiente pregunta"}
                            <ArrowRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-2 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
                        <p>Selecciona una respuesta antes de que termine el tiempo.</p>
                        <p>Más rapidez = más puntos.</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ) : null}

            {phase === "summary" ? (
              <Card className="overflow-hidden border-white/10 bg-black/30">
                <CardHeader className="space-y-3">
                  <p className="rounded-full border border-white/10 bg-white/6 px-3 py-1 text-xs uppercase tracking-[0.22em] text-emerald-100/80">
                    Resultado final
                  </p>
                  <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                    {score} puntos
                  </h2>
                  <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
                    {performanceText}
                  </p>
                </CardHeader>

                <CardContent className="space-y-5">
                  <div className="grid gap-3 sm:grid-cols-3">
                    <SummaryChip label="Aciertos" value={`${correctCount}/${totalQuestions}`} />
                    <SummaryChip label="Mejor racha" value={`${bestStreak}`} />
                    <SummaryChip
                      label="Mejor local"
                      value={`${displayedLocalBest ?? score}`}
                    />
                  </div>

                  <div className="grid gap-3 sm:grid-cols-3">
                    <ButtonLink href="/ranking" className="w-full justify-center">
                      Publicar / ver ranking
                    </ButtonLink>
                    <ButtonLink
                      href="/certificados"
                      variant="secondary"
                      className="w-full justify-center"
                    >
                      Generar certificado
                    </ButtonLink>
                    <Button
                      type="button"
                      variant="ghost"
                      className="w-full"
                      onClick={beginChallenge}
                    >
                      Jugar otra vez
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {results.map((result, index) => (
                      <div
                        key={`${result.questionId}-${index}`}
                        className="rounded-[2rem] border border-white/10 bg-white/5 p-4"
                      >
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                          <div className="space-y-2">
                            <p className="text-sm font-medium">{result.prompt}</p>
                            <p className="text-xs text-muted-foreground">
                              Tu respuesta: {result.selectedLabel}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Correcta: {result.correctLabel}
                            </p>
                          </div>
                          <span
                            className={cn(
                              "inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1 text-xs",
                              result.isCorrect
                                ? "border-emerald-300/35 bg-emerald-300/10 text-emerald-100"
                                : "border-rose-300/35 bg-rose-300/10 text-rose-100",
                            )}
                          >
                            {result.isCorrect ? (
                              <BadgeCheck className="h-4 w-4" aria-hidden="true" />
                            ) : (
                              <TimerReset className="h-4 w-4" aria-hidden="true" />
                            )}
                            {result.isCorrect ? `+${result.points} pts` : "Sin puntos"}
                          </span>
                        </div>
                        <p className="mt-3 text-sm leading-6 text-muted-foreground">
                          {result.fact}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ) : null}
          </div>

          <div className="space-y-5">
            <Card className="overflow-hidden border-white/10 bg-black/25">
              <CardContent className="p-0">
                <div className="relative aspect-[16/11] overflow-hidden">
                  {phase === "intro" ? (
                    <Image
                      src={POMAC_MEDIA.huaca}
                      alt="Huaca del Bosque de Pómac"
                      fill
                      className="object-cover"
                      sizes="(max-width: 1280px) 100vw, 40vw"
                    />
                  ) : currentQuestion ? (
                    <Image
                      src={currentQuestion.image}
                      alt={currentQuestion.imageAlt}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1280px) 100vw, 40vw"
                    />
                  ) : null}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-5">
                    <p className="text-xs uppercase tracking-[0.28em] text-emerald-100/75">
                      {phase === "intro"
                        ? "Contexto visual"
                        : currentQuestion?.eyebrow ?? "Bosque de Pómac"}
                    </p>
                    <p className="mt-2 text-lg font-semibold">
                      {phase === "intro"
                        ? "Las preguntas usan imágenes reales del bosque, sus huacas y su paisaje seco."
                        : currentQuestion?.fact}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-white/10 bg-white/5">
              <CardHeader>
                <p className="text-sm font-medium">Estado del desafío</p>
                <p className="text-xs text-muted-foreground">
                  Puntaje, velocidad y constancia determinan el resultado final.
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <SummaryMeter label="Puntaje" value={score} max={4000} />
                <SummaryMeter label="Aciertos" value={correctCount} max={totalQuestions} />
                <SummaryMeter label="Racha" value={bestStreak} max={4} />

                <div className="rounded-[2rem] border border-white/10 bg-black/20 p-4">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <Flame className="h-4 w-4 text-amber-200" aria-hidden="true" />
                    Racha actual
                  </div>
                  <p className="mt-2 text-3xl font-semibold tracking-tight">{streak}</p>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    Cada respuesta correcta consecutiva aumenta el bonus de velocidad.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-white/10 bg-white/5">
              <CardHeader>
                <p className="text-sm font-medium">Verificación de conexión entre módulos</p>
                <p className="text-xs text-muted-foreground">
                  Esta vista quedó enlazada con el resto del flujo de EcoPómac.
                </p>
              </CardHeader>
              <CardContent className="space-y-3">
                <ConnectionItem
                  title="Juego → almacenamiento local"
                  text="El puntaje final se guarda en localStorage con la clave ecopomac:runs."
                />
                <ConnectionItem
                  title="Juego → ranking global"
                  text="Si hay sesión activa y Supabase disponible, se ejecuta submit_best_score automáticamente."
                />
                <ConnectionItem
                  title="Juego → certificados"
                  text="El módulo `/certificados` reutiliza el mejor puntaje local para generar el diploma."
                />
                <ConnectionItem
                  title="Juego → navegación"
                  text="Desde esta pantalla puedes saltar directamente a `/ranking` y `/certificados`."
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </Container>
    </div>
  );
}

function AnswerTile({
  choice,
  selected,
  revealed,
  onSelect,
  decor,
}: {
  choice: {
    label: string;
    explanation: string;
    isCorrect: boolean;
  };
  selected: boolean;
  revealed: boolean;
  onSelect: () => void;
  decor: {
    icon: LucideIcon;
    label: string;
    className: string;
  };
}) {
  const Icon = decor.icon;
  const revealedClassName = choice.isCorrect
    ? "border-emerald-200/40 bg-emerald-400/15 text-emerald-50"
    : selected
      ? "border-rose-200/40 bg-rose-400/15 text-rose-50"
      : "border-white/10 bg-white/[0.03] text-foreground/65";

  return (
    <button
      type="button"
      disabled={revealed}
      onClick={onSelect}
      className={cn(
        "group relative min-h-44 rounded-[2rem] border p-5 text-left transition-all focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-default",
        revealed ? revealedClassName : decor.className,
        !revealed && "hover:-translate-y-0.5 hover:shadow-[0_18px_35px_-24px_rgba(15,23,42,0.8)]",
        selected && !revealed && "ring-2 ring-white/60",
      )}
    >
      <div className="flex h-full flex-col justify-between gap-5">
        <div className="flex items-start justify-between gap-3">
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/20 bg-black/15">
            <Icon className="h-5 w-5" aria-hidden="true" />
          </span>
          <span className="rounded-full border border-white/20 bg-black/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em]">
            {decor.label}
          </span>
        </div>
        <p className="text-base font-semibold leading-7">{choice.label}</p>
      </div>
    </button>
  );
}

function SummaryChip({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.6rem] border border-white/10 bg-white/5 px-4 py-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-sm font-semibold">{value}</p>
    </div>
  );
}

function SummaryMeter({
  label,
  value,
  max,
}: {
  label: string;
  value: number;
  max: number;
}) {
  const width = Math.max(0, Math.min(100, Math.round((value / max) * 100)));

  return (
    <div className="rounded-[2rem] border border-white/10 bg-black/20 p-4">
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm">{label}</p>
        <p className="text-sm font-semibold">
          {value}/{max}
        </p>
      </div>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/8">
        <div
          className="h-full rounded-full bg-gradient-to-r from-emerald-300 via-lime-300 to-sky-300"
          style={{ width: `${width}%` }}
          aria-hidden="true"
        />
      </div>
    </div>
  );
}

function ConnectionItem({
  title,
  text,
}: {
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-[1.6rem] border border-white/10 bg-black/20 p-4">
      <p className="text-sm font-medium">{title}</p>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{text}</p>
    </div>
  );
}
