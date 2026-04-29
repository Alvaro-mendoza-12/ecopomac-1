"use client";

import QRCode from "react-qr-code";
import { useMemo, useRef, useState } from "react";
import { Container } from "@/components/layout/Container";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

function downloadSvg(svgEl: SVGSVGElement, filename: string) {
  const serializer = new XMLSerializer();
  const source = serializer.serializeToString(svgEl);
  const blob = new Blob([source], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export default function QrPage() {
  const [value, setValue] = useState<string>("https://ecopomac.vercel.app");
  const wrapRef = useRef<HTMLDivElement | null>(null);

  const safe = useMemo(() => value.trim() || "https://ecopomac.vercel.app", [value]);

  return (
    <div className="relative">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(900px_520px_at_18%_0%,rgba(52,211,153,0.16),transparent_62%),radial-gradient(900px_520px_at_92%_20%,rgba(176,137,104,0.12),transparent_60%)]"
      />
      <Container className="relative py-14">
        <div className="max-w-2xl space-y-3">
          <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
            Código QR integrado
          </h1>
          <p className="text-pretty text-muted-foreground">
            Genera un QR para acceso rápido y compártelo en presentaciones o
            afiches.
          </p>
        </div>

        <div className="mt-10 grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
          <Card>
            <CardHeader>
              <p className="text-sm font-medium">Contenido del QR</p>
              <p className="text-xs text-muted-foreground">URL o texto</p>
            </CardHeader>
            <CardContent className="space-y-3">
              <input
                className="h-11 w-full rounded-2xl border border-border bg-white/4 px-4 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="https://ecopomac.vercel.app"
                aria-label="Texto del QR"
              />
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setValue("https://ecopomac.vercel.app")}
                >
                  Usar URL de EcoPómac
                </Button>
                <Button
                  type="button"
                  onClick={() => {
                    const svg = wrapRef.current?.querySelector("svg");
                    if (svg) downloadSvg(svg, "ecopomac-qr.svg");
                  }}
                >
                  Descargar SVG
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Tip: para Vercel, actualiza el dominio real y vuelve a descargar.
              </p>
            </CardContent>
          </Card>

          <Card className="overflow-hidden">
            <CardHeader>
              <p className="text-sm font-medium">Vista previa</p>
              <p className="text-xs text-muted-foreground">Contraste optimizado</p>
            </CardHeader>
            <CardContent>
              <div
                ref={wrapRef}
                className="mx-auto grid w-full place-items-center rounded-3xl border border-border bg-white p-8"
              >
                <QRCode
                  value={safe}
                  size={220}
                  bgColor="#ffffff"
                  fgColor="#0b1210"
                />
              </div>
              <p className="mt-3 break-all text-xs text-muted-foreground">{safe}</p>
            </CardContent>
          </Card>
        </div>
      </Container>
    </div>
  );
}

