import { type EcoPomacYear } from "@/lib/constants";

export type SimulatorStats = {
  year: EcoPomacYear;
  forestCoverPct: number; // 0..100
  hectaresLost: number;
  speciesAtRisk: number;
  co2Kt: number;
};

export const SIMULATOR_STATS: Record<EcoPomacYear, SimulatorStats> = {
  2000: {
    year: 2000,
    forestCoverPct: 92,
    hectaresLost: 0,
    speciesAtRisk: 9,
    co2Kt: 18,
  },
  2010: {
    year: 2010,
    forestCoverPct: 84,
    hectaresLost: 2100,
    speciesAtRisk: 14,
    co2Kt: 44,
  },
  2020: {
    year: 2020,
    forestCoverPct: 71,
    hectaresLost: 5200,
    speciesAtRisk: 22,
    co2Kt: 88,
  },
  2030: {
    year: 2030,
    forestCoverPct: 60,
    hectaresLost: 7800,
    speciesAtRisk: 29,
    co2Kt: 121,
  },
};

