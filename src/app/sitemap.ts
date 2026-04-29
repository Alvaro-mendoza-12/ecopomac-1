import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://ecopomac.vercel.app";
  const routes = [
    "",
    "/explorar",
    "/simulador",
    "/mapa",
    "/juego",
    "/huella",
    "/estadisticas",
    "/reportes",
    "/qr",
    "/ranking",
    "/certificados",
  ];

  return routes.map((r) => ({
    url: `${base}${r}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: r === "" ? 1 : 0.7,
  }));
}

