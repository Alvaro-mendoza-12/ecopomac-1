import { notFound } from "next/navigation";
import { Container } from "@/components/layout/Container";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function CertificatePublicPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return (
      <Container className="py-14">
        <Card>
          <CardHeader>
            <p className="text-sm font-medium">Supabase no configurado</p>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Configura `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
          </CardContent>
        </Card>
      </Container>
    );
  }

  const { data, error } = await supabase
    .from("certificates")
    .select("id,display_name,score,created_at,is_public,public_url")
    .eq("id", id)
    .single();

  if (error || !data) notFound();

  // RLS: si no es público, el select solo funcionará para el dueño autenticado.
  const createdAt = new Intl.DateTimeFormat("es-PE", { dateStyle: "long" }).format(
    new Date(data.created_at),
  );

  return (
    <Container className="py-14">
      <div className="max-w-4xl">
        <Card className="overflow-hidden">
          <CardHeader>
            <p className="text-xs text-muted-foreground">EcoPómac</p>
            <p className="text-2xl font-semibold tracking-tight">
              Certificado de participación
            </p>
            <p className="text-xs text-muted-foreground">{createdAt}</p>
          </CardHeader>
          <CardContent>
            <div className="rounded-[2rem] border border-border bg-white p-5 text-zinc-950 sm:p-8">
              {data.public_url ? (
                <div className="mb-6">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={data.public_url}
                    alt="Certificado EcoPómac"
                    className="w-full rounded-2xl border border-zinc-200"
                  />
                </div>
              ) : null}
              <p className="text-sm text-zinc-700">Se certifica que</p>
              <p className="mt-2 text-3xl font-semibold">{data.display_name}</p>
              <p className="mt-4 text-sm text-zinc-700">
                participó en la plataforma educativa sobre la conservación del{" "}
                <span className="font-medium">Santuario Histórico Bosque de Pómac</span>.
              </p>
              <div className="mt-6 rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                <p className="text-xs text-zinc-600">Puntaje (juego educativo)</p>
                <p className="text-2xl font-semibold">{data.score ?? "—"}</p>
              </div>
              <p className="mt-6 text-xs text-zinc-600">
                ID: {data.id} · Público: {data.is_public ? "sí" : "no"}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </Container>
  );
}

