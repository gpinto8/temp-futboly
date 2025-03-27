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
        return [...matches].sort((a, b) => a.week - b.week);
    };

    return {
        getPersonalMatches,
        getMatchStatistics,
        getAllMatches,
    };
}

export type matchStatistics = {
    totalWins: number;
    totalMatchPlayed: number;
    overallScore: number;
    scoredThisWeek: number;
};
