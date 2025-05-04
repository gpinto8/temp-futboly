const filenames = [
  'axes',
  'bear',
  'bird',
  'bull',
  'crow',
  'fish',
  'ghost',
  'horse',
  'mountain',
  'rhino',
  'snake',
  'swan',
  'thunder',
  'tornado-2',
  'tornado',
  'tower-2',
  'tower',
  'train',
  'wolf',
] as const;

export const customTeamLogos = filenames.map((id) => {
  const filename = `${id}.png`;
  const name = id.replace(/\b\w/g, (char) => char.toUpperCase());
  const alt = `${name} Image`;
  const src = `assets/custom-team-logos/${filename}`;

  return { id, name, src, alt };
});

export type CustomTeamLogoIds = (typeof filenames)[number];

export const getCustomTeamLogoById = (id?: CustomTeamLogoIds) => {
  if (id) {
    const foundLogo = customTeamLogos.find((logo) => logo.id === id);
    if (foundLogo) return foundLogo;
  }
};
