# Configuración Supabase (EcoPómac) — paso a paso

## 1) Crear proyecto

1. En Supabase: **New project**
2. Nombre: **EcoPómac**
3. Guarda:
   - **Project URL**
   - **Anon public key**

## 2) Configurar variables de entorno

Crea un archivo `ecopomac/.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://<PROJECT_REF>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<ANON_PUBLIC_KEY>
```

En Vercel: Project → Settings → Environment Variables → agrega las mismas variables.

## 3) Ejecutar el esquema SQL (tablas + RLS)

1. Supabase → **SQL Editor**
2. Pega y ejecuta `supabase/schema.sql`
3. Pega y ejecuta `supabase/enterprise_addons.sql`

Esto crea:
- `profiles`
- `reports`
- `leaderboard` (histórico opcional)
- `leaderboard_best` (récord por usuario + RPC)
- `certificates`
…con **RLS** y políticas seguras.

## 4) Authentication

En Supabase → **Authentication**:
- Providers → Email: **Enabled**
- Para entrar sin verificación por correo: **desactiva** `Confirm email`.
- Ruta exacta: `Authentication > Providers > Email > Confirm email`.
- Si no lo desactivas, el login devolverá error de correo no confirmado.

## 5) Realtime (ranking global “en vivo”)

En Supabase → **Database** → Replication / Realtime:
- Habilita Realtime para la tabla `leaderboard_best`.
- (Opcional) también para `reports`.

## 6) Storage (certificados)

En Supabase → **Storage**:
1. Crea bucket: `certificates`
2. Recomendación:
   - Para esta implementación: bucket **public** (URL pública estable)
3. Las políticas de escritura limitan uploads a `certificates/<auth.uid()>/...`

EcoPómac guarda en DB:
- `storage_path`
- `public_url`

## 7) Ejecutar local

```bash
cd ecopomac
npm install
npm run dev
```

Ir a:
- `/auth` para registro/login
- `/reportes` para reportes persistentes
- `/juego` → guardar puntaje global
- `/ranking` para ranking global + realtime
- `/certificados` para crear certificado

