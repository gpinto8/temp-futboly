import { TEAMS_GOALKEEPER_FORMATION_POSITION } from '@/firebase/db-types';

const formationMap = [
  {
    title: 'Classic Positions',
    formations: ['442', '451', '433', '343', '352', '361', '424', '334'], // MAKE SURE YOU DONT REPEAT THE SAME FORMATION (HERE AND IN THE OTHER ARRAY BELOW)
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

export type FormationPosition =
  | `${string}+${string}+${string}`
  | typeof TEAMS_GOALKEEPER_FORMATION_POSITION;

export const mapFormationPosition = (
  formationTotalPlayers: string, // e.g "4" ("432")
  playerPosition: number, // e.g the first one of the "4" players, from left to right ("432")
  fieldRow: number, // e.g the first row of the 3 to display, from top to bottom ("432")
): FormationPosition => {
  const formation: FormationPosition = `${formationTotalPlayers}+${playerPosition}+${fieldRow}`; // "4+4+3"

  return formation; // We are not including goalkeeper here, since we just gotta use "1" for it and thats it
};
