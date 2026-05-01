import { cn } from "@/lib/cn";

type PageHeroStat = {
  value: string;
  label: string;
};

type PageHeroProps = {
  eyebrow?: string;
  title: string;
  description: string;
  note?: string;
  actions?: React.ReactNode;
  stats?: PageHeroStat[];
  aside?: React.ReactNode;
  className?: string;
};

export function PageHero({
  eyebrow,
  title,
  description,
  note,
  actions,
  stats,
  aside,
  className,
}: PageHeroProps) {
  return (
    <section
      className={cn(
        "overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.03] p-5 shadow-[0_30px_70px_-50px_rgba(15,23,42,0.75)] backdrop-blur sm:p-7 lg:p-8",
        className,
      )}
    >
      <div
        className={cn(
          "grid gap-6",
          aside ? "xl:grid-cols-[1.08fr_0.92fr] xl:items-end" : "",
        )}
      >
        <div className="min-w-0 space-y-4">
          {eyebrow ? (
            <p className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-black/20 px-4 py-2 text-xs uppercase tracking-[0.24em] text-emerald-100/80">
              {eyebrow}
            </p>
          ) : null}

          <div className="space-y-3">
            <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
              {title}
            </h1>
            <p className="max-w-3xl text-pretty text-sm leading-6 text-muted-foreground sm:text-base sm:leading-7">
              {description}
            </p>
            {note ? (
              <p className="max-w-3xl text-sm leading-6 text-emerald-100/80">{note}</p>
            ) : null}
          </div>

          {actions ? (
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              {actions}
            </div>
          ) : null}
        </div>

        {aside ? <div className="min-w-0">{aside}</div> : null}
      </div>

      {stats?.length ? (
        <div
          className={cn(
            "mt-6 grid gap-3",
            stats.length === 1
              ? "sm:grid-cols-1"
              : stats.length === 2
                ? "sm:grid-cols-2"
                : "sm:grid-cols-2 xl:grid-cols-3",
          )}
        >
          {stats.map((stat) => (
            <div
              key={`${stat.label}-${stat.value}`}
              className="min-w-0 rounded-[1.6rem] border border-white/10 bg-black/20 px-4 py-3"
            >
              <p className="text-xs text-muted-foreground">{stat.label}</p>
              <p className="mt-1 text-sm font-semibold text-emerald-50 sm:text-base">
                {stat.value}
              </p>
            </div>
          ))}
        </div>
      ) : null}
    </section>
  );
}
