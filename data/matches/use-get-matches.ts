import {
  MappedCompetitionsProps,
  UsersCollectionProps,
} from '@/firebase/db-types';
import { useAppSelector } from '@/store/hooks';
import { useGetTeams } from '../teams/use-get-teams';
import { DAY_OF_WEEK_MATCH } from '@/firebase/config';
import { CompetitionsCollectionTeamsExtraProps } from '../teams/use-get-teams'; 

export const useGetMatches = () => {
    const { getTeamByUid } = useGetTeams();
    const activeCompetition = useAppSelector((state) => state.competition.activeCompetition) as MappedCompetitionsProps;
    const user = useAppSelector((state) => state.user) as UsersCollectionProps;
    const matches = activeCompetition ? activeCompetition.matchSchedule : null;

    // Return personal matches ordered by week
    const getPersonalMatches = () => {
        if (!matches) return [];
        return [...matches].filter((match) => (match.home.userId === user.id || match.away.userId === user.id)).sort((a, b) => a.week - b.week);
    };

    const getMatchStatistics = () => {
        const personalMatches = getPersonalMatches();
        let totalWins = 0, totalMatchPlayed = 0, totalScore = 0, scoredThisWeek = 0;
        personalMatches.forEach((personalMatch) => {
            const matchSide = personalMatch.home.userId === user.id ? "Home" : "Away";
            if (personalMatch.result) {
                totalMatchPlayed++; // If match has a result 
                const winnerSide = personalMatch.result.home > personalMatch.result.away ? "Home" :  personalMatch.result.home !== personalMatch.result.away ? "Away" : "Draw"; 
                if (winnerSide === matchSide) totalWins++;
                totalScore += personalMatch.result[matchSide.toLowerCase()];
                scoredThisWeek = personalMatch.result[matchSide.toLowerCase()];
            }
        });
        return {
            totalWins,
            totalMatchPlayed,
            overallScore: Math.round(totalScore/totalMatchPlayed),
            scoredThisWeek
        } as matchStatistics;
    };

    // Return all the matches but sorted by week
    const getAllMatches = () => {
        if (!matches) return [];
        const matchesClone = [...matches];
        let grouped = matchesClone.reduce((acc, curr) => {
            acc[curr.week] = acc[curr.week] || [];
            acc[curr.week].push(curr);
            return acc;
        }, {} as any);
        const keys = Object.keys(grouped);
        const groupedMatches = keys.map((key) => { return {
            week: key,
            matches: grouped[key]
        }});
        return groupedMatches;
    };

    const getUpcomingMatches = (matchesNumber: number) => {
        if (!matches) return [];
        const personalMatches = getPersonalMatches();
        const upcomingPersonalMatches = personalMatches.filter((match) => !match.result);
        if (upcomingPersonalMatches.length > matchesNumber) {
            return upcomingPersonalMatches.slice(0, matchesNumber);
        } else {
            return upcomingPersonalMatches;
        }
    };

    const getTimeToNextMatch = () => {
        const HOURS = 16;
        const today = new Date(Date.now());
        const todayDay = today.getUTCDay();
        const todayHours = today.getUTCHours();
        if (todayDay === 6 || todayDay === 0) return -1;
        if (todayDay === DAY_OF_WEEK_MATCH && todayHours >= HOURS) return -1;
        let daysLeft = DAY_OF_WEEK_MATCH - todayDay;
        const start = today.getTime();
        today.setUTCDate(today.getDate() + daysLeft);
        today.setUTCHours(HOURS);
        today.setUTCMinutes(0);
        today.setUTCSeconds(0);
        return today.getTime() - start;
    };

    const getNextMatch = () => {
        const nextPersonalMatch = getUpcomingMatches(1)[0];
        const homeUserId = nextPersonalMatch.home.userId;
        const awayUserId = nextPersonalMatch.away.userId;
        if (!homeUserId || !awayUserId) return;
        const homeTeam = getTeamByUid(homeUserId);
        const awayTeam = getTeamByUid(awayUserId);
        if (!homeTeam || !awayTeam) return;
        return {
            ...nextPersonalMatch,
            home: homeTeam,
            away: awayTeam,
        };
    };

    return {
        getPersonalMatches,
        getMatchStatistics,
        getAllMatches,
        getUpcomingMatches,
        getTimeToNextMatch,
        getNextMatch,
    };
}

export type matchStatistics = {
    totalWins: number;
    totalMatchPlayed: number;
    overallScore: number;
    scoredThisWeek: number;
};

export type LiveMatchProps = {
    home: CompetitionsCollectionTeamsExtraProps;
    away: CompetitionsCollectionTeamsExtraProps;
    date: Date;
    week: number;
    result?: {
        home: number;
        away: number;
    };
};
