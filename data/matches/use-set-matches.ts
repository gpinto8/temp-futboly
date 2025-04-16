import {
  MappedCompetitionsProps,
  UsersCollectionProps,
} from '@/firebase/db-types';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { firestoreMethods } from '@/firebase/firestore-methods';
import { competitionActions } from '@/store/slices/competitions';
import cloneDeep from 'lodash/cloneDeep';

export const useSetMatches = () => {
  // Initial variable an functions setup
  const activeCompetition = useAppSelector(
    (state) => state.competition.activeCompetition,
  ) as MappedCompetitionsProps;
  const user = useAppSelector((state) => state.user) as UsersCollectionProps;
  const leagueOwner = useAppSelector((state) => state.league.owner);
  const dispatch = useAppDispatch();
  const matches =
    activeCompetition && activeCompetition.matchSchedule
      ? [...activeCompetition.matchSchedule]
      : null;

  const writeGameResults = async (gameResults: GameResult[], week: number) => {
    // Basic checks to state the situation of the program
    if (!matches) return;
    if (user.id !== leagueOwner) {
      console.error("You can't calculate game results if you are not an admin");
      return;
    }
    // Here I separate the matches of the week and the others
    const weekMatches = matches.filter((match) => match.week === week);
    const otherMatches = matches.filter((match) => match.week !== week);
    // I create a Map for each "home" team as key with the result
    const gameResultsMap: Map<String, GameResult> = new Map();
    gameResults.forEach((gameResult) => {
      gameResultsMap.set(gameResult.home.shortId, gameResult);
    });
    const weekMatchesResult = weekMatches.map((weekMatch) => {
      // I recover from the map the result of the "home" team and I return the match info plus the result
      const gameResult = gameResultsMap.get(weekMatch.home.shortId);
      if (!gameResult) {
        console.error('Match not found');
        return null as any;
      }
      return {
        ...weekMatch,
        result: {
          home: gameResult.home.result,
          away: gameResult.away.result,
        },
      };
    });
    // Now that I have updated the matches of the week I can merge the 2 arrays and sort them by week
    const updatedMatches = [...otherMatches, ...weekMatchesResult].sort(
      (a, b) => a.date - b.date,
    );
    // Here I write on the db the updatedMatches and the current week and then if no errors are found I dispatch the updated competition
    const scheduleResult = await firestoreMethods(
      'competitions',
      activeCompetition.id as any,
    ).replaceField('matchSchedule', updatedMatches);
    if (!scheduleResult) {
      console.error('Updating matches failed');
    }
    const currentWeekResult = await firestoreMethods(
      'competitions',
      activeCompetition.id as any,
    ).replaceField('currentWeek', week + 1);
    if (!currentWeekResult) {
      console.error('Error while updating currentWeek');
    }
    const newActiveCompetition = cloneDeep(activeCompetition);
    newActiveCompetition.matchSchedule = updatedMatches;
    dispatch(competitionActions.setCompetition(newActiveCompetition));
  };

  return {
    writeGameResults,
  };
};

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
