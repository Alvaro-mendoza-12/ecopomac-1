"use client";

import { cn } from "@/lib/cn";

type LegendPanelProps = {
  className?: string;
};

export function LegendPanel({ className }: LegendPanelProps) {
  return (
    <div className={cn("rounded-2xl border border-border/70 bg-background/85 p-3 backdrop-blur", className)}>
      <p className="text-xs font-medium">Leyenda dinámica</p>
      <div className="mt-2 grid gap-2 text-[11px] text-muted-foreground">
        <p className="font-medium text-foreground">Incendios</p>
        <LegendRow color="bg-yellow-400" label="Severidad baja" />
        <LegendRow color="bg-orange-500" label="Severidad media" />
        <LegendRow color="bg-red-500" label="Severidad alta" />
        <LegendRow color="bg-red-800" label="Severidad crítica" />
        <LegendRow color="bg-gradient-to-r from-yellow-300 to-red-600" label="Heatmap de densidad" />
      </div>
      <div className="mt-3 border-t border-border/70 pt-2 text-[11px] text-muted-foreground">
        <p className="font-medium text-foreground">Biodiversidad</p>
        <LegendRow color="bg-sky-400" label="Especies" />
        <LegendRow color="bg-cyan-400" label="Hábitats" />
        <LegendRow color="bg-emerald-400" label="Área protegida" />
        <LegendRow color="bg-lime-300" label="Conservación estable/vulnerable" />
      </div>
    </div>
  );
}

function LegendRow({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className={cn("inline-block h-2.5 w-5 rounded-sm", color)} />
      <span>{label}</span>
    </div>
  );
}

