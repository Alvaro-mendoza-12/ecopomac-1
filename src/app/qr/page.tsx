"use client";

import QRCode from "react-qr-code";
import { useMemo, useRef, useState } from "react";
import { PageHero } from "@/components/content/PageHero";
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
  const [copyMsg, setCopyMsg] = useState<string | null>(null);
  const wrapRef = useRef<HTMLDivElement | null>(null);

  const safe = useMemo(() => value.trim() || "https://ecopomac.vercel.app", [value]);

  return (
    <div className="relative">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(900px_520px_at_18%_0%,rgba(52,211,153,0.16),transparent_62%),radial-gradient(900px_520px_at_92%_20%,rgba(176,137,104,0.12),transparent_60%)]"
      />
      <Container className="relative py-14">
        <PageHero
          eyebrow="Difusión rápida"
          title="Comparte EcoPómac en segundos con un QR listo para proyectar."
          description="Esta vista sirve muy bien para el cierre o para una diapositiva de invitación. El QR ahora se adapta mejor a pantallas pequeñas y también luce más limpio en una proyección."
          stats={[
            { label: "Entrada", value: "URL o texto libre" },
            { label: "Salida", value: "QR descargable en SVG" },
            { label: "Uso ideal", value: "Pantalla final o afiche" },
          ]}
          aside={
            <div className="rounded-[1.8rem] border border-white/10 bg-black/25 p-5">
              <p className="text-sm font-medium">Tip para exponer</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Déjalo abierto al final de la presentación para que tus compañeros
                escaneen el proyecto y naveguen desde sus celulares.
              </p>
            </div>
          }
        />

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
                <Button
                  type="button"
                  variant="ghost"
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(safe);
                      setCopyMsg("Enlace copiado al portapapeles.");
                    } catch {
                      setCopyMsg("No se pudo copiar el enlace.");
                    }
                  }}
                >
                  Copiar enlace
                </Button>
              </div>
              {copyMsg ? <p className="text-sm text-muted-foreground">{copyMsg}</p> : null}
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
                className="mx-auto grid w-full place-items-center rounded-3xl border border-border bg-white p-6 sm:p-8"
              >
                <div className="w-full max-w-[320px]">
                  <QRCode
                    value={safe}
                    size={256}
                    bgColor="#ffffff"
                    fgColor="#0b1210"
                    style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                  />
                </div>
              </div>
              <p className="mt-3 break-all text-xs text-muted-foreground">{safe}</p>
            </CardContent>
          </Card>
        </div>
      </Container>
    </div>
  );
}

