import {
  AllPosibleFormationsProps,
  FormationPosition,
} from '@/utils/formations';
import { CustomTeamLogoIds } from '@/utils/real-team-logos';
import { Timestamp } from 'firebase/firestore';
import { DocumentReference } from 'firebase/firestore';

/****************************************  USERS  ****************************************/
export type UsersCollectionProps = {
  id: string;
  username: string;
  activeLeague: DocumentReference<LeaguesCollectionProps> | null;
  activeCompetitions: {
    [key: string]: DocumentReference<CompetitionsCollectionProps>;
  };
};

/****************************************  LEAGUES  ****************************************/
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

/****************************************  COMPETITIONS  ****************************************/
export type CompetitionsCollectionProps = {
  id: string;
  name: string;
  competitionStarted: boolean;
  competitionFinished?: boolean;
  endDate: Timestamp; // (Use the "Timestamp.fromDate(new Date())" function to meet this type)
  specificPosition: boolean;
  league: DocumentReference<LeaguesCollectionProps>;
  currentWeek: number;
  maxWeek: number;
  players: DocumentReference<UsersCollectionProps>[];
  teams: CompetitionsCollectionTeamsProps[];
  standings: ShortTeamPropsStandings[] | null;
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

/****************************************  TEAMS  ****************************************/
export const TEAMS_GOALKEEPER_FORMATION_POSITION = '1';
export const TEAMS_PLAYERS_LIMIT = 25;
export const TEAM_PLAYERS_GOALKEEPER_LIMIT = 3;
export const TEAM_PLAYERS_DEFENDER_LIMIT = 8;
export const TEAM_PLAYERS_MIDFIELDER_LIMIT = 8;
export const TEAM_PLAYERS_ATTACKER_LIMIT = 6;
export const TEAMS_MAX_BENCH_PLAYERS = 3;

export type CompetitionsCollectionTeamsProps = {
  shortId: string;
  userRef: DocumentReference<UsersCollectionProps>;
  leagueRef: DocumentReference<LeaguesCollectionProps>;
  competitionRef: DocumentReference<CompetitionsCollectionProps>;
  name: string;
  coach: string;
  logoId: CustomTeamLogoIds; // TODO: To change in the future
  formation?: AllPosibleFormationsProps;
  results?: StandingsResults;
  players: {
    sportmonksId: number;
    position?: FormationPosition; // Look at the "mapFormationPosition" function for the mapping format
    bench?: (number | undefined)[]; // An array of sportmonksId's, limit of {TEAMS_MAX_BENCH_PLAYERS}, and the order is based on the array index
  }[]; // Only {TEAMS_PLAYERS_LIMIT} players per team (for now)
};

/****************************************  STANDINGS  ****************************************/
export type GameStandingsResult = 'W' | 'D' | 'L';

export type StandingsResults = {
  lastMatches: GameStandingsResult[];
  W: number;
  L: number;
  D: number;
  points: number;
};

export type ShortTeamProps = {
  name: string;
  userId: string;
  ownerUsername: string;
  shortId: string;
  logoId: CustomTeamLogoIds;
  /*players: any[];*/
};

export type ShortTeamPropsStandings = ShortTeamProps & {
  results: StandingsResults;
  position: number;
};

/****************************************  MAPPED PROPS  ****************************************/
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
