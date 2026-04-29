export type GameState = {
  biodiversity: number; // 0..100
  water: number; // 0..100
  co2: number; // 0..100 (lower is better but we normalize “health” as inverse)
  economy: number; // 0..100
};

export type GameChoice = {
  id: string;
  label: string;
  nextId: string | null;
  delta: Partial<GameState>;
  note: string;
};

export type GameNode = {
  id: string;
  title: string;
  prompt: string;
  choices: GameChoice[];
};

export const initialGameState: GameState = {
  biodiversity: 72,
  water: 64,
  co2: 55,
  economy: 58,
};

export const GAME_NODES: Record<string, GameNode> = {
  start: {
    id: "start",
    title: "Salva el Bosque",
    prompt:
      "Eres parte de un equipo que coordina acciones para reducir deforestación y mejorar el bienestar local. ¿Qué priorizas primero?",
    choices: [
      {
        id: "c1",
        label: "Vigilancia comunitaria y patrullaje",
        nextId: "enforcement",
        delta: { biodiversity: +6, co2: -2, economy: +2 },
        note: "Reduce actividades ilegales y mejora gobernanza.",
      },
      {
        id: "c2",
        label: "Expansión rápida agrícola sin zonificación",
        nextId: "expansion",
        delta: { biodiversity: -10, water: -8, co2: +9, economy: +6 },
        note: "Aumenta ingresos a corto plazo con alto costo ambiental.",
      },
      {
        id: "c3",
        label: "Educación ambiental + turismo responsable",
        nextId: "education",
        delta: { biodiversity: +3, water: +2, co2: -1, economy: +5 },
        note: "Cambio cultural gradual con beneficio económico sostenible.",
      },
    ],
  },
  enforcement: {
    id: "enforcement",
    title: "Gobernanza y control",
    prompt:
      "Se detectan focos de tala ilegal. ¿Cómo respondes sin afectar a comunidades vulnerables?",
    choices: [
      {
        id: "c1",
        label: "Control + alternativas productivas (agroforestería)",
        nextId: "final",
        delta: { biodiversity: +7, water: +4, co2: -4, economy: +6 },
        note: "Equilibra control con transición económica.",
      },
      {
        id: "c2",
        label: "Solo sanciones duras",
        nextId: "final",
        delta: { biodiversity: +4, water: +1, economy: -4 },
        note: "Efectivo al inicio, pero puede generar conflicto social.",
      },
    ],
  },
  expansion: {
    id: "expansion",
    title: "Presión de uso de suelo",
    prompt:
      "La expansión aumenta incendios y fragmentación. ¿Qué medida correctiva implementas?",
    choices: [
      {
        id: "c1",
        label: "Zonificación + corredores biológicos",
        nextId: "final",
        delta: { biodiversity: +5, water: +2, co2: -2, economy: -1 },
        note: "Recupera conectividad, reduce impacto a mediano plazo.",
      },
      {
        id: "c2",
        label: "Ignorar alertas y mantener crecimiento",
        nextId: "final",
        delta: { biodiversity: -8, water: -6, co2: +7, economy: +3 },
        note: "Escala el problema y eleva riesgo climático.",
      },
    ],
  },
  education: {
    id: "education",
    title: "Cultura y economía local",
    prompt:
      "El turismo crece. ¿Cómo aseguras que sea compatible con conservación?",
    choices: [
      {
        id: "c1",
        label: "Capacidad de carga + guías locales certificados",
        nextId: "final",
        delta: { biodiversity: +6, water: +2, co2: -2, economy: +6 },
        note: "Mejora ingresos y reduce degradación por sobrecarga.",
      },
      {
        id: "c2",
        label: "Promoción masiva sin control",
        nextId: "final",
        delta: { biodiversity: -5, water: -3, co2: +3, economy: +5 },
        note: "Beneficio rápido con desgaste del ecosistema.",
      },
    ],
  },
  final: {
    id: "final",
    title: "Resultado",
    prompt:
      "Fin de la simulación. Revisa el impacto agregado y compáralo con un enfoque más equilibrado.",
    choices: [
      {
        id: "restart",
        label: "Jugar de nuevo",
        nextId: "start",
        delta: {},
        note: "Prueba otras rutas.",
      },
      {
        id: "ranking",
        label: "Ver ranking",
        nextId: null,
        delta: {},
        note: "Guarda tu resultado.",
      },
    ],
  },
};

