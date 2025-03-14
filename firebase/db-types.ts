import { Timestamp } from 'firebase/firestore';
import { DocumentReference } from 'firebase/firestore';

// USERS
export type UsersCollectionProps = {
  id: string;
  username: string;
  activeLeague: DocumentReference<LeaguesCollectionProps> | null;
  activeCompetitions: {
    [key: string]: DocumentReference<CompetitionsCollectionProps>;
  };
};

// LEAGUES
export type LeaguesCollectionProps = {
  id: string;
  name: string;
  leaguePassword?: string;
  shortId: string;
  isPrivate: boolean;
  players: {
    [key: string]: 'owner' | 'guest';
  };
  owner: string;
  ownerUsername: string;
};

// COMPETITIONS
export type CompetitionsCollectionProps = {
  id: string;
  name: string;
  startDate: Timestamp; // (Use the "Timestamp.fromDate(new Date())" function to meet this type)
  endDate: Timestamp; // (Use the "Timestamp.fromDate(new Date())" function to meet this type)
  specificPosition: boolean;
  league: DocumentReference<LeaguesCollectionProps>;
  currentWeek: Number;
  maxWeek: Number;
  players: DocumentReference<UsersCollectionProps>[];
  teams: DocumentReference<CompetitionsCollectionTeamsProps>[];
  standings:
    | {
        teamId: DocumentReference<CompetitionsCollectionTeamsProps>;
        points: Number;
      }[]
    | null;
  matchSchedule:
    | {
        week: Number;
        home: DocumentReference<CompetitionsCollectionTeamsProps>;
        away: DocumentReference<CompetitionsCollectionTeamsProps>;
        result: {
          home: Number;
          away: Number;
        };
      }[]
    | null;
};

// TEAMS
export type CompetitionsCollectionTeamsProps = {
  shortId: string;
  userRef: DocumentReference<UsersCollectionProps>;
  leagueRef: DocumentReference<LeaguesCollectionProps>;
  competitionRef: DocumentReference<CompetitionsCollectionProps>;
  name: string;
  coach: string;
  logoId: string;
  // formation: string; // String with module
  // players: {
  //   sportmonksID: string;
  //   actualPosition: {
  //     isBenched: Boolean;
  //     slot: Number;
  //   };
  // }[];
};

export type MappedPlayerProps = {
  uid: string;
  role: 'owner' | 'guest';
  username: string;
};

export type MappedLeaguesProps = Omit<LeaguesCollectionProps, 'players'> & {
  players: MappedPlayerProps[];
  ownerUsername: string | '';
  competitionsNo?: number | undefined;
  leagueCompetitions?: MappedCompetitionsProps[] | undefined;
};

export type MappedCompetitionsProps = CompetitionsCollectionProps & {
  startDateText: string;
  endDateText: string;
  active: boolean;
};
