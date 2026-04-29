"use client";

import { useEffect, useMemo, useState } from "react";
import { LeaderboardView } from "@/features/leaderboard/LeaderboardView";

function loadRuns(): Array<{ score: number; at: string }> {
  try {
    const raw = localStorage.getItem("ecopomac:runs");
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

export default function RankingPage() {
  const [runs, setRuns] = useState<Array<{ score: number; at: string }>>([]);

  useEffect(() => {
    const id = window.setTimeout(() => {
      setRuns(loadRuns());
    }, 0);
    return () => window.clearTimeout(id);
  }, []);

  const best = useMemo(() => runs.map((r) => r.score).sort((a, b) => b - a)[0] ?? null, [runs]);

  return <LeaderboardView localBest={best} />;
}

