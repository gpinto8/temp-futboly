import {
  MappedCompetitionsProps,
  UsersCollectionProps,
} from '@/firebase/db-types';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { competitionActions } from '@/store/slices/competitions';

export const useSetMatches = () => {
    const activeCompetition = useAppSelector((state) => state.competition.activeCompetition) as MappedCompetitionsProps;
    const user = useAppSelector((state) => state.user) as UsersCollectionProps;
    const dispatch = useAppDispatch();
    const matches = activeCompetition ? activeCompetition.matchSchedule : null;

    // TODO: Check if when I update the active competition also the competitions gets update to avoid 
    // problems when I make some changes and if I switch competition I don't see them until I refresh the page
    
    const writeGameResults = (gameResults: GameResult[], week: number) => {
        if (!matches) return;
        const weekMatches = matches.filter((match) => match.week === week);
        const otherMatches = matches.filter((match) => match.week !== week);
        const gameResultsMap : Map<String, GameResult>= new Map();
        gameResults.forEach((gameResult) => {
            gameResultsMap.set(gameResult.home.shortId, gameResult);
        });
        weekMatches.map((weekMatch) => {
            const gameResult = gameResultsMap.get(weekMatch.home.shortId);
            if (!gameResult) {
                console.error("Match not found");
                return null;
            }
            weekMatch.result = {
                home: gameResult.home.result, 
                away: gameResult.away.result,
            };
            return weekMatch;
        });
        // Now that I have updated the matches of the week I can merge the 2 arrays and sort them by week
        const updatedMatches = [...otherMatches, ...weekMatches];
        const newActiveCompetition = structuredClone(activeCompetition);
        newActiveCompetition.matchSchedule = updatedMatches;
        dispatch(competitionActions.setActiveCompetition(newActiveCompetition));
    };

    return {
        writeGameResults,
    };
}

export type GameResult = {
    home: {
        shortId: string;
        result: number;
    };
    away: {
        shortId: string;
        result: number;
    };
};
