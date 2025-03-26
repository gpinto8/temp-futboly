export const realTeamLogos = [
  {
    id: 'athletic-madrid',
    name: 'Athletic Madrid',
    src: 'assets/real-team-logos/athletic-madrid.svg',
    alt: 'Athletic Madrid Logo Icon',
  },
  {
    id: 'barcelona',
    name: 'Barcelona',
    src: 'assets/real-team-logos/barcelona.svg',
    alt: 'Barcelona Logo Icon',
  },
  {
    id: 'bayern-munich',
    name: 'Bayern Munich',
    src: 'assets/real-team-logos/bayern-munich.svg',
    alt: 'Bayern Munich Logo Icon',
  },
  {
    id: 'liverpool',
    name: 'Liverpool',
    src: 'assets/real-team-logos/liverpool.svg',
    alt: 'Liverpool Logo Icon',
  },
  {
    id: 'man-united',
    name: 'Manchester United',
    src: 'assets/real-team-logos/manchester-united.svg',
    alt: 'Manchester United Logo Icon',
  },
  {
    id: 'paris-saint-germain',
    name: 'Paris Saint Germain',
    src: 'assets/real-team-logos/paris-saint-germain.svg',
    alt: 'Paris Saint Germain Logo Icon',
  },
  {
    id: 'real-madrid',
    name: 'Real Madrid',
    src: 'assets/real-team-logos/real-madrid.svg',
    alt: 'Real Madrid Logo Icon',
  },
] as const;

const realTeamLogoIds = realTeamLogos.map((logo) => logo.id);
export type RealTeamLogoIds = (typeof realTeamLogoIds)[number];

export const getRealTeamLogoById = (id?: RealTeamLogoIds) => {
  if (id) {
    const foundLogo = realTeamLogos.find((logo) => logo.id === id);
    if (foundLogo) return foundLogo;
  }
};
