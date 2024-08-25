export type UsersCollectionProps = {
  username: string;
  leagues: any; // "leagues" refs
};

export type LeagueCollectionCompetitionProps = {
  id: number;
  name: string;
  players: number[]; // The "Sportmonks" players id they use
  startDate: any; // TODO: get the correct type from firestore (TIME)
  endDate: any; // TODO: get the correct type from firestore (TIME)
  active: boolean;
};

export type LeaguesCollectionProps = {
  name: string;
  owner: any; // "users" refs
  competitions: LeagueCollectionCompetitionProps[];
  teams: {
    owner: any; // "users" refs
    name: string;
    coach: string;
    players: number[]; // The "Sportmonks" players id they use
  }[];
};
