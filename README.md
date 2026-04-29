# EcoPómac

Aplicación web **moderna, interactiva y educativa** sobre la deforestación y conservación del **Santuario Histórico Bosque de Pómac (Lambayeque, Perú)**.  
Proyecto universitario para el curso de Ecología integrando Ingeniería de Sistemas y conciencia ambiental.

## Módulos

- **Landing + CTA**: frase central “La tecnología al servicio de la conservación ambiental.”
- **Simulador de deforestación (2000–2030)**: animaciones fluidas con Framer Motion y estadísticas dinámicas.
- **Mapa interactivo**: Leaflet + capas educativas (zonas afectadas, flora, fauna, áreas protegidas).
- **Juego educativo “Salva el Bosque”**: decisiones que afectan biodiversidad, agua, CO₂ y economía.
- **Calculadora de huella ecológica**: transporte, papel, energía → puntaje ambiental.
- **Panel estadístico**: Recharts con métricas (ha perdidas, especies afectadas, CO₂).
- **Sistema de reportes**: formulario + API (`/api/reports`) para demo.
- **QR integrado**: generación + descarga SVG.
- **Dark mode**, **SEO** (`robots.txt`, `sitemap.xml`) y **PWA** (manifest + service worker en build).
- **Ranking** (demo local) y **Certificados** imprimibles (PDF vía navegador).

## Tech stack

- **Next.js (App Router)** + **React** + **TypeScript strict**
- **Tailwind CSS**
- **Framer Motion**, **Leaflet / React-Leaflet**, **Recharts**
- **Zod** + **React Hook Form**
- **next-themes** (Dark Mode)
- **next-pwa** (PWA)

## Arquitectura (carpetas)

- `src/app/`: rutas (landing y módulos)
- `src/components/`: UI reutilizable (layout + UI primitives)
- `src/features/`: lógica por módulo (simulador, mapa, juego, huella, stats, reportes)
- `src/lib/`: utilidades (`cn`, constantes, etc.)
- `public/`: íconos PWA y manifest

## Instalación

Requisitos: **Node.js 20+** y npm.

```bash
cd ecopomac
npm install
npm run dev
```

Configura Supabase en `ecopomac/.env.local` (ver `SUPABASE_SETUP.md`):

```bash
NEXT_PUBLIC_SUPABASE_URL=https://<PROJECT_REF>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<ANON_PUBLIC_KEY>
```

Luego:

```bash
npm run dev
```

Abrir `http://localhost:3000`.

## Build (producción)

```bash
npm run build
npm run start
```

## Despliegue en Vercel

- **Build Command**: `npm run build`
- **Output**: (por defecto Next.js)
- **Framework preset**: Next.js
- **Node version**: 20+

Notas:
- El endpoint `/api/reports` guarda en archivo local para **demo**; en Vercel el filesystem puede ser **efímero**. Para producción, usar DB (Postgres/SQLite/Supabase).

## Licencia / Aviso

Uso educativo. Los datos son **referenciales** para simulación y presentación universitaria (no oficiales).
