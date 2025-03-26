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
  currentWeek: number;
  maxWeek: number;
  players: DocumentReference<UsersCollectionProps>[];
  teams: DocumentReference<TeamsCollectionProps>[];
  standings:
    | {
        teamId: DocumentReference<TeamsCollectionProps>;
        points: number;
      }[]
    | null;
  matchSchedule:
    | {
        week: number;
        home: DocumentReference<TeamsCollectionProps>;
        away: DocumentReference<TeamsCollectionProps>;
        result?: {
          home: number;
          away: number;
        };
      }[]
    | null;
};

// TEAMS
export type TeamsCollectionProps = {
  id: string;
  uid: DocumentReference<UsersCollectionProps>;
  league: DocumentReference<LeaguesCollectionProps>;
  competition: DocumentReference<CompetitionsCollectionProps>;
  name: string;
  logo: string; // Actual Sportmonks ID
  formation: string; // String with module
  players: {
    sportmonksID: string;
    actualPosition: {
      isBenched: Boolean;
      slot: number;
    };
  }[];
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
