export type UsersCollectionProps = {
  username: string;
  leagues: any[]; // "leagues" refs
};

export type LeaguesCollectionProps = {
  name: string;
  owner: any[]; // "users" refs
  competitions: any[]; // "competitions" ref
};

export type CompetitionsCollectionProps = {
  name: string;
  players: number[]; // The "Sportmonks" players id they use
  startDate: any; // TODO: get the correct type from firestore (TIME)
  endDate: any; // TODO: get the correct type from firestore (TIME)
};
