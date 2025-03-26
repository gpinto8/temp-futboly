const formationMap = [
  {
    title: 'Classic Positions',
    formations: ['442', '451', '433', '343', '352', '361', '424', '334'],
  },
  {
    title: 'Speficic Positions',
    formations: [
      '343',
      '3412',
      '3421',
      '352',
      '3511',
      '433',
      '4312',
      '442',
      '4141',
      '4411',
      '4231',
    ],
  },
] as const;

const allFormationsMap = formationMap.map((item) => item.formations).flat();
export type AllPosibleFormationsProps = (typeof allFormationsMap)[number];

export const getFormations = () => {
  const isValidFormation = (formation: AllPosibleFormationsProps) => {
    const total = formation
      .split('')
      .reduce((sum, num) => sum + parseInt(num), 0);
    return total === 10;
  };

  const filterValidFormations = (formations: typeof formationMap) => {
    return formations.map((category) => ({
      ...category,
      formations: category.formations.filter(isValidFormation),
    }));
  };

  const filteredFormationMap = filterValidFormations(formationMap); // We gotta make sure that the formation combination are of 10 players
  return filteredFormationMap;
};
