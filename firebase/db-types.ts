import { RealTeamLogoIds } from '@/utils/real-team-logos';
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
  teams: CompetitionsCollectionTeamsProps[];
  standings:
    | {
        points: number;
        teamId: DocumentReference<CompetitionsCollectionTeamsProps>;
      }[]
    | null;
  matchSchedule:
    | {
        week: number;
        home: DocumentReference<CompetitionsCollectionTeamsProps>;
        away: DocumentReference<CompetitionsCollectionTeamsProps>;
        result?: {
          home: number;
          away: number;
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
  logoId: RealTeamLogoIds; // TODO: to change in the future
  // formation: string; // String with module
  players: {
    sportmonksId: number;
    // actualPosition: {
    //   isBenched: Boolean;
    //   slot: number;
    // };
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
