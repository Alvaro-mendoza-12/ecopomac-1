"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Container } from "@/components/layout/Container";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(72),
  displayName: z.string().max(60).optional(),
});

type Values = z.infer<typeof schema>;

function normalizeAuthError(message: string) {
  const m = message.toLowerCase();
  if (m.includes("email not confirmed") || m.includes("confirm your email")) {
    return "Tu cuenta existe, pero el proyecto Supabase sigue exigiendo confirmación de correo. Desactiva 'Confirm email' en Authentication > Providers > Email, o confirma el correo y vuelve a intentar.";
  }
  if (m.includes("invalid login credentials")) {
    return "Correo o contraseña incorrectos.";
  }
  return message;
}

export default function AuthPage() {
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const [mode, setMode] = useState<"login" | "register">("login");
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "", displayName: "" },
  });

  return (
    <div className="relative">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(950px_520px_at_18%_0%,rgba(52,211,153,0.16),transparent_62%),radial-gradient(950px_520px_at_92%_20%,rgba(176,137,104,0.12),transparent_60%)]"
      />
      <Container className="relative py-14">
        <div className="max-w-2xl space-y-3">
          <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
            Acceso
          </h1>
          <p className="text-pretty text-muted-foreground">
            Inicia sesión para persistir reportes, ranking global y certificados.
          </p>
        </div>

        <div className="mt-10 grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
          <Card>
            <CardHeader>
              <p className="text-sm font-medium">
                {mode === "login" ? "Iniciar sesión" : "Crear cuenta"}
              </p>
              <p className="text-xs text-muted-foreground">
                {mode === "login"
                  ? "Accede a tu perfil EcoPómac."
                  : "Crea una cuenta gratuita (correo + contraseña)."}
              </p>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid gap-2">
                <label className="text-sm font-medium" htmlFor="email">
                  Correo
                </label>
                <input
                  id="email"
                  type="email"
                  className="h-11 w-full rounded-2xl border border-border bg-white/4 px-4 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  {...form.register("email")}
                />
              </div>

              <div className="grid gap-2">
                <label className="text-sm font-medium" htmlFor="password">
                  Contraseña
                </label>
                <input
                  id="password"
                  type="password"
                  className="h-11 w-full rounded-2xl border border-border bg-white/4 px-4 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  {...form.register("password")}
                />
                <p className="text-xs text-muted-foreground">
                  Mínimo 8 caracteres.
                </p>
              </div>

              {mode === "register" ? (
                <div className="grid gap-2">
                  <label className="text-sm font-medium" htmlFor="displayName">
                    Nombre (opcional)
                  </label>
                  <input
                    id="displayName"
                    className="h-11 w-full rounded-2xl border border-border bg-white/4 px-4 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    placeholder="Ej: Equipo EcoPómac"
                    {...form.register("displayName")}
                  />
                </div>
              ) : null}

              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <Button
                  type="button"
                  disabled={busy}
                  onClick={async () => {
                    setMsg(null);
                    if (!supabase) {
                      setMsg(
                        "Falta configurar Supabase. Crea .env.local con NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY.",
                      );
                      return;
                    }
                    const ok = await form.trigger(
                      mode === "login" ? ["email", "password"] : ["email", "password", "displayName"],
                    );
                    if (!ok) return;
                    const v = form.getValues();
                    setBusy(true);
                    try {
                      if (mode === "login") {
                        const { error } = await supabase.auth.signInWithPassword({
                          email: v.email,
                          password: v.password,
                        });
                        if (error) {
                          setMsg(normalizeAuthError(error.message));
                          return;
                        }
                        window.location.href = "/explorar";
                      } else {
                        const normalizedName = v.displayName?.trim();
                        if (normalizedName && normalizedName.length < 2) {
                          setMsg("El nombre debe tener al menos 2 caracteres.");
                          return;
                        }
                        const { data, error } = await supabase.auth.signUp({
                          email: v.email,
                          password: v.password,
                          options: {
                            data: {
                              display_name: normalizedName || undefined,
                            },
                          },
                        });
                        if (error) {
                          setMsg(normalizeAuthError(error.message));
                          return;
                        }
                        if (data.session) {
                          window.location.href = "/explorar";
                          return;
                        }

                        // Fallback: if signUp did not create a session, try explicit login.
                        const loginAfterSignup = await supabase.auth.signInWithPassword({
                          email: v.email,
                          password: v.password,
                        });
                        if (loginAfterSignup.error) {
                          setMsg(normalizeAuthError(loginAfterSignup.error.message));
                          return;
                        }
                        window.location.href = "/explorar";
                      }
                    } finally {
                      setBusy(false);
                    }
                  }}
                >
                  {busy
                    ? "Procesando..."
                    : mode === "login"
                      ? "Ingresar"
                      : "Crear cuenta"}
                </Button>

                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setMode((m) => (m === "login" ? "register" : "login"))}
                >
                  {mode === "login" ? "Crear cuenta" : "Ya tengo cuenta"}
                </Button>
              </div>

              {msg ? <p className="text-sm text-muted-foreground">{msg}</p> : null}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <p className="text-sm font-medium">Privacidad y seguridad</p>
              <p className="text-xs text-muted-foreground">RLS habilitado</p>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>
                - Tu sesión se guarda de forma segura en el navegador.
              </p>
              <p>
                - Los reportes y puntajes se protegen con Row Level Security.
              </p>
              <p>
                - Los certificados pueden ser públicos para compartir en la presentación.
              </p>
            </CardContent>
          </Card>
        </div>
      </Container>
    </div>
  );
}

