export const POMAC_MEDIA = {
  heroVideo: "/pomac-media/bosque-pomac-hero.mp4",
  heroPoster: "/pomac-media/bosque-pomac-principal.webp",
  panorama: "/pomac-media/bosque-pomac-panorama.webp",
  sanctuary: "/pomac-media/santuario-bosque.webp",
  millenaryTree: "/pomac-media/arbol-milenario.webp",
  huaca: "/pomac-media/huaca-del-oro.webp",
  pyramids: "/pomac-media/piramides-sican.webp",
} as const;

export type PomacSpotlight = {
  title: string;
  description: string;
  href: string;
  cta: string;
  image: string;
  alt: string;
  eyebrow: string;
};

export const HOME_SPOTLIGHTS: PomacSpotlight[] = [
  {
    title: "Explora el santuario con contexto real",
    description:
      "Integra paisaje, patrimonio arqueológico y biodiversidad para entender cómo cambia el Bosque de Pómac.",
    href: "/explorar",
    cta: "Abrir recorrido",
    image: POMAC_MEDIA.sanctuary,
    alt: "Vista del Santuario Histórico Bosque de Pómac",
    eyebrow: "Narrativa ambiental",
  },
  {
    title: "Juega un reto dinámico con presión de tiempo",
    description:
      "Responde preguntas, suma puntaje y descubre decisiones clave para conservar el bosque seco.",
    href: "/juego",
    cta: "Entrar al juego",
    image: POMAC_MEDIA.millenaryTree,
    alt: "Árbol milenario del Bosque de Pómac",
    eyebrow: "Desafío tipo Kahoot",
  },
  {
    title: "Relaciona territorio, datos y acción",
    description:
      "Cruza el mapa, el simulador y los reportes para identificar riesgos y oportunidades de conservación.",
    href: "/mapa",
    cta: "Ver mapa",
    image: POMAC_MEDIA.huaca,
    alt: "Huaca del Bosque de Pómac",
    eyebrow: "Capas interactivas",
  },
];

export const HOME_METRICS = [
  {
    value: "13 zonas de vida",
    label: "Lambayeque concentra una gran diversidad ecológica",
  },
  {
    value: "7 000–10 000 ha/año",
    label: "Rango reportado de presión por deforestación en la región",
  },
  {
    value: "ODS 13 y 15",
    label: "Cambio climático y vida de ecosistemas terrestres",
  },
] as const;
