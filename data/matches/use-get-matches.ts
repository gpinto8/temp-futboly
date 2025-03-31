import {
  MappedCompetitionsProps,
  UsersCollectionProps,
} from '@/firebase/db-types';
import { useAppSelector } from '@/store/hooks';

export const useGetMatches = () => {
    const activeCompetition = useAppSelector((state) => state.competition.activeCompetition) as MappedCompetitionsProps;
    const user = useAppSelector((state) => state.user) as UsersCollectionProps;
    const matches = activeCompetition ? activeCompetition.matchSchedule : null;

    // Return personal matches ordered by week
    const getPersonalMatches = () => {
        if (!matches) return [];
        return [...matches].filter((match) => (match.home.ownerUsername === user.username || match.away.ownerUsername === user.username)).sort((a, b) => a.week - b.week);
    };

    const getMatchStatistics = () => {
        const personalMatches = getPersonalMatches();
        let totalWins = 0, totalMatchPlayed = 0, totalScore = 0, scoredThisWeek = 0;
        personalMatches.forEach((personalMatch) => {
            const matchSide = personalMatch.home.ownerUsername === user.username ? "Home" : "Away";
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

    return {
        getPersonalMatches,
        getMatchStatistics,
        getAllMatches,
        getUpcomingMatches,
    };
}

export type matchStatistics = {
    totalWins: number;
    totalMatchPlayed: number;
    overallScore: number;
    scoredThisWeek: number;
};
