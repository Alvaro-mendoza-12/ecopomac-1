# Guía de despliegue en Vercel (EcoPómac)

## 1) Preparación

- Verifica que el build local funcione:

```bash
cd ecopomac
npm install
npm run build
```

## 2) Desplegar

1. Crea un repositorio (GitHub/GitLab/Bitbucket) y sube el proyecto.
2. En Vercel: **New Project** → importa el repo.
3. Configuración recomendada:
   - **Framework Preset**: Next.js
   - **Build Command**: `npm run build`
   - **Install Command**: `npm install`
   - **Output Directory**: (vacío / default)
   - **Node.js Version**: 20+

## 3) PWA

- El service worker se genera en build (en dev está deshabilitado por defecto).
- Verifica en producción:
  - `manifest.webmanifest` accesible
  - el sitio instala (Chrome/Edge: “Install app”)

## 4) Consideración importante: Reportes

El endpoint `src/app/api/reports/route.ts` intenta escribir en `data/reports.json`.

- En Vercel, el filesystem puede ser **solo lectura o efímero**.
- Para una versión “producción real”, reemplazar por:
  - **Supabase** (Postgres)
  - **Neon** (Postgres) + Prisma
  - **Upstash Redis** (cola / cache)

## 5) Dominio

Si tu dominio final no es `https://ecopomac.vercel.app`:
- Actualiza `metadataBase` en `src/app/layout.tsx`
- Actualiza `src/app/sitemap.ts` y `src/app/robots.ts`
- Re-genera el QR desde `/qr` para que apunte al dominio real

