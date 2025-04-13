import { AllPosibleFormationsProps } from '@/utils/formations';
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
  competitionStarted: Boolean;
  //  startDate: Timestamp; // (Use the "Timestamp.fromDate(new Date())" function to meet this type)
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
  /*matchSchedule: Teams are not anymore just references but they are an array with all the informations
   * I will leave it commented because in the future we will create and apposite collection for Teams
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
    */
  matchSchedule: MatchScheduleProps[] | null;
};

export type MatchScheduleProps = {
  week: number;
  home: ShortTeamProps;
  away: ShortTeamProps;
  date: Date;
  result?: {
    home: number;
    away: number;
  };
};

export type MatchTeamType = {
  teamName: string;
  teamLogo: string;
  position: number;
  module: string;
  players: PlayerType[];
  bench: PlayerType[];
};

export type PlayerType = {
  name: string;
  image: string;
  position: string;
  shirtNumber: number;
  points: number;
  isCaptain: boolean;
};

// TEAMS
export type CompetitionsCollectionTeamsProps = {
  shortId: string;
  userRef: DocumentReference<UsersCollectionProps>;
  leagueRef: DocumentReference<LeaguesCollectionProps>;
  competitionRef: DocumentReference<CompetitionsCollectionProps>;
  name: string;
  coach: string;
  logoId: RealTeamLogoIds; // TODO: To change in the future
  formation?: AllPosibleFormationsProps;
  results?: StandingsResults;
  players: {
    sportmonksId: number;
    position?: string; // Look at the "mapFormationPosition" function for the mapping format
  }[]; // Only 11 players per team (for now)
};

export type GameStandingsResult = 'W' | 'D' | 'L';

export type StandingsResults = {
  lastMatches: GameStandingsResult[];
  W: number;
  L: number;
  D: number;
};

export type ShortTeamProps = {
  name: string;
  userId: string;
  ownerUsername: string;
  shortId: string;
  logoId: RealTeamLogoIds;
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
