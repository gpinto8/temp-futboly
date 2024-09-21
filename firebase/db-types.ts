import { Timestamp } from 'firebase/firestore';
import { DocumentReference } from 'firebase/firestore';

// USERS
export type UsersCollectionProps = {
  username: string;
  leagues: DocumentReference<LeaguesCollectionProps>[];
};

// LEAGUES
export type LeaguesCollectionProps = {
  id: string;
  name: string;
  leaguePassword?: string;
  owner: string;
  // owner: DocumentReference<UsersCollectionProps>; // "users" refs
  ownerUsername: string;
  competitions: LeagueCollectionCompetitionProps[];
  teams: LeagueCollectionTeamProps[]; //Still empty
  shortId: string;
  isPrivate: boolean;
  players: string[]; // The actual "Sportmonks" players id
  specificPosition: boolean;
};

// COMPETITIONS
export type LeagueCollectionCompetitionProps = {
  id: string; // self.crypto.randomUUID()
  name: string;
  players: number[]; // The actual "Sportmonks" players id
  startDate: Timestamp; // (Use the "Timestamp.fromDate(new Date())" function to meet this type)
  endDate: Timestamp; // (Use the "Timestamp.fromDate(new Date())" function to meet this type)
  active: boolean;
  type: 'Classic';
};

// TEAMS
type LeagueCollectionTeamProps = {
  id: string; // self.crypto.randomUUID()
  owner: string;
  // owner: DocumentReference<UsersCollectionProps>; // "users" refs
  name: string;
  coach: string;
  players: number[]; // The actual "Sportmonks" players id
};
