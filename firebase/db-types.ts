import { Timestamp } from 'firebase/firestore';
import { DocumentReference } from 'firebase/firestore';

// USERS
export type UsersCollectionProps = {
    id: string;
    username: string;
    activeLeague: DocumentReference<LeaguesCollectionProps>;
};

// LEAGUES
export type LeaguesCollectionProps = {
    id: string;
    name: string;
    leaguePassword?: string;
    shortId: string;
    isPrivate: boolean;
    players: any;
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
    teams: DocumentReference<TeamsCollectionProps>[];
    standings: {
        teamId: DocumentReference<TeamsCollectionProps>,
        points: Number
    }[];
    matchSchedule: {
        week: Number,
        home: DocumentReference<TeamsCollectionProps>,
        away: DocumentReference<TeamsCollectionProps>
        result: {
            home: Number,
            away: Number
        }
    }[];
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
        sportmonksID: string,
        actualPosition: {
            isBenched: Boolean,
            slot: Number
        }
    }[];
};
