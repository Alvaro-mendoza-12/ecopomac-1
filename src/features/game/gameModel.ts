import { POMAC_MEDIA } from "@/lib/pomacMedia";

export type GameChoice = {
  id: string;
  label: string;
  explanation: string;
  isCorrect: boolean;
};

export type GameQuestion = {
  id: string;
  eyebrow: string;
  prompt: string;
  support: string;
  fact: string;
  timerSeconds: number;
  image: string;
  imageAlt: string;
  choices: GameChoice[];
};

export type GameResult = {
  questionId: string;
  prompt: string;
  selectedLabel: string;
  correctLabel: string;
  isCorrect: boolean;
  points: number;
  fact: string;
};

export const GAME_CONFIG = {
  questionCount: 4,
  maxPointsPerQuestion: 1000,
  fastestBonusFloor: 300,
} as const;

export function calculateQuestionScore(
  timeLeft: number,
  timerSeconds: number,
  streak: number,
) {
  const normalizedTime = Math.max(0, timeLeft) / timerSeconds;
  const speedPoints = Math.round(normalizedTime * 450);
  const streakPoints = Math.min(180, streak * 60);
  return Math.min(
    GAME_CONFIG.maxPointsPerQuestion,
    GAME_CONFIG.fastestBonusFloor + speedPoints + streakPoints,
  );
}

export function describePerformance(score: number, correctCount: number) {
  if (score >= 3200 && correctCount >= 4) {
    return "Guardian del Bosque: dominaste el reto con decisiones sólidas y veloces.";
  }

  if (score >= 2200 && correctCount >= 3) {
    return "Aliado del Santuario: buen criterio y comprensión de la conservación.";
  }

  if (score >= 1200) {
    return "Explorador en progreso: entendiste parte del reto, pero aún hay margen para mejorar.";
  }

  return "Punto de partida: vuelve a intentarlo y compara mejor tus decisiones ambientales.";
}

export const GAME_QUESTIONS: GameQuestion[] = [
  {
    id: "vigilancia",
    eyebrow: "Pregunta 1 · Protección",
    prompt: "¿Qué acción frena mejor la tala ilegal sin romper el vínculo con la comunidad local?",
    support:
      "Piensa en una medida que combine control, participación y sostenibilidad a mediano plazo.",
    fact:
      "La vigilancia comunitaria funciona mejor cuando se combina con alternativas productivas compatibles con el bosque seco.",
    timerSeconds: 20,
    image: POMAC_MEDIA.sanctuary,
    imageAlt: "Vista del Santuario Histórico Bosque de Pómac",
    choices: [
      {
        id: "a",
        label: "Patrullaje comunitario con monitoreo y rutas seguras",
        explanation:
          "Integra prevención, reporte temprano y participación local en la protección del bosque.",
        isCorrect: true,
      },
      {
        id: "b",
        label: "Abrir nuevas trochas para vigilancia vehicular intensiva",
        explanation:
          "Facilita el acceso, pero también fragmenta el hábitat y puede aumentar la presión sobre el bosque.",
        isCorrect: false,
      },
      {
        id: "c",
        label: "Permitir tala temporal mientras llegan más fondos",
        explanation:
          "Postergar el control acelera la degradación y hace más costosa la recuperación posterior.",
        isCorrect: false,
      },
      {
        id: "d",
        label: "Cerrar toda actividad local sin medidas de transición",
        explanation:
          "Puede generar conflicto social y pérdida de apoyo comunitario a la conservación.",
        isCorrect: false,
      },
    ],
  },
  {
    id: "turismo",
    eyebrow: "Pregunta 2 · Turismo responsable",
    prompt: "Si el interés turístico crece en el Bosque de Pómac, ¿qué estrategia mantiene el equilibrio?",
    support:
      "Busca una opción que proteja la experiencia del visitante y reduzca el desgaste del ecosistema.",
    fact:
      "La capacidad de carga evita saturación, erosión y ruido excesivo en áreas sensibles.",
    timerSeconds: 18,
    image: POMAC_MEDIA.millenaryTree,
    imageAlt: "Árbol milenario del Bosque de Pómac",
    choices: [
      {
        id: "a",
        label: "Ingreso libre todo el año sin cupos ni guías",
        explanation:
          "Aumenta la presión sobre senderos, fauna y residuos sin un control real del impacto.",
        isCorrect: false,
      },
      {
        id: "b",
        label: "Capacidad de carga, guías locales y rutas señalizadas",
        explanation:
          "Distribuye mejor el flujo de visitantes y fortalece la economía local compatible con la conservación.",
        isCorrect: true,
      },
      {
        id: "c",
        label: "Eventos masivos semanales cerca de zonas frágiles",
        explanation:
          "El ruido y la concentración de personas incrementan el estrés ambiental.",
        isCorrect: false,
      },
      {
        id: "d",
        label: "Construir accesos rápidos dentro de cualquier zona",
        explanation:
          "Expandir infraestructura sin zonificación puede dañar corredores biológicos y paisaje.",
        isCorrect: false,
      },
    ],
  },
  {
    id: "patrimonio",
    eyebrow: "Pregunta 3 · Paisaje cultural",
    prompt: "¿Por qué las huacas y pirámides del bosque deben incluirse en la estrategia educativa y de manejo?",
    support:
      "El reto no es solo ecológico: el Bosque de Pómac también es territorio histórico y cultural.",
    fact:
      "El santuario protege tanto el bosque seco como un valioso conjunto arqueológico vinculado a la cultura Sicán.",
    timerSeconds: 18,
    image: POMAC_MEDIA.pyramids,
    imageAlt: "Pirámides Sicán en el Bosque de Pómac",
    choices: [
      {
        id: "a",
        label: "Porque el patrimonio cultural ayuda a explicar por qué conservar el territorio completo",
        explanation:
          "Vincular arqueología y ambiente fortalece el valor integral del santuario para visitantes y comunidades.",
        isCorrect: true,
      },
      {
        id: "b",
        label: "Porque permiten ampliar la urbanización alrededor del santuario",
        explanation:
          "Esa expansión no protege el patrimonio ni el ecosistema; suele aumentar presión y fragmentación.",
        isCorrect: false,
      },
      {
        id: "c",
        label: "Porque sustituyen la necesidad de cuidar flora y fauna",
        explanation:
          "El patrimonio cultural complementa la conservación, no reemplaza la protección ecológica.",
        isCorrect: false,
      },
      {
        id: "d",
        label: "Porque justifican retirar los controles de acceso",
        explanation:
          "El valor patrimonial requiere manejo más cuidadoso, no menos regulación.",
        isCorrect: false,
      },
    ],
  },
  {
    id: "agua-incendios",
    eyebrow: "Pregunta 4 · Riesgo climático",
    prompt: "En temporada seca, ¿qué decisión reduce mejor incendios, pérdida de agua y estrés del bosque?",
    support:
      "Relaciona prevención, monitoreo y restauración con el comportamiento del ecosistema.",
    fact:
      "La prevención temprana y la restauración del paisaje reducen vulnerabilidad ante fuego y degradación del suelo.",
    timerSeconds: 20,
    image: POMAC_MEDIA.panorama,
    imageAlt: "Panorámica del Bosque de Pómac",
    choices: [
      {
        id: "a",
        label: "Esperar a que aparezcan focos grandes para recién intervenir",
        explanation:
          "Responder tarde eleva el costo de control y el daño ecológico acumulado.",
        isCorrect: false,
      },
      {
        id: "b",
        label: "Monitoreo temprano, cortafuegos y recuperación de cobertura vegetal",
        explanation:
          "Combina prevención, respuesta y restauración para sostener agua, suelo y biodiversidad.",
        isCorrect: true,
      },
      {
        id: "c",
        label: "Expandir quemas para limpiar rápidamente el territorio",
        explanation:
          "La quema mal manejada incrementa riesgo de incendios y pérdida de hábitat.",
        isCorrect: false,
      },
      {
        id: "d",
        label: "Priorizar solo infraestructura turística en zonas secas",
        explanation:
          "No atiende la raíz del riesgo ambiental ni mejora la resiliencia del paisaje.",
        isCorrect: false,
      },
    ],
  },
];
