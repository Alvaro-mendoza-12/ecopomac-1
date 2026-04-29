export const ECO_POMAC = {
  name: "Santuario Histórico Bosque de Pómac",
  region: "Lambayeque, Perú",
  coords: {
    lat: -6.4486,
    lng: -79.8626,
  },
  years: [2000, 2010, 2020, 2030] as const,
};

export type EcoPomacYear = (typeof ECO_POMAC.years)[number];

