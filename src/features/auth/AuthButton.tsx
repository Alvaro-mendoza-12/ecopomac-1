"use client";

import { useEffect, useMemo, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { ButtonLink } from "@/components/ui/Button";
import { Button } from "@/components/ui/Button";

export function AuthButton() {
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    if (!supabase) return;
    let mounted = true;
    void supabase.auth.getUser().then(({ data }) => {
      if (!mounted) return;
      setEmail(data.user?.email ?? null);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setEmail(session?.user?.email ?? null);
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, [supabase]);

  if (!supabase) {
    return (
      <ButtonLink href="/auth" variant="secondary" size="sm">
        Configurar Supabase
      </ButtonLink>
    );
  }

  if (!email) {
    return (
      <ButtonLink href="/auth" variant="secondary" size="sm">
        Ingresar
      </ButtonLink>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <span className="hidden max-w-[180px] truncate text-xs text-muted-foreground sm:inline">
        {email}
      </span>
      <Button
        type="button"
        variant="secondary"
        size="sm"
        onClick={async () => {
          await supabase.auth.signOut();
          window.location.href = "/";
        }}
      >
        Salir
      </Button>
    </div>
  );
}

