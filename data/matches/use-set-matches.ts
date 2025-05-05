import { UsersCollectionProps } from '@/firebase/db-types';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { firestoreMethods } from '@/firebase/firestore-methods';
import { competitionActions } from '@/store/slices/competitions';
import { useGetMatches } from '@/data/matches/use-get-matches';
import { useGetTeams } from '@/data/teams/use-get-teams';
import { useSetStandings } from '@/data/standings/use-set-standings';
import { getSportmonksPlayersDataByIds } from '@/sportmonks/common-methods';
import cloneDeep from 'lodash/cloneDeep';
import { useGetCompetitions } from '../competitions/use-get-competitions';

export const useSetMatches = () => {
  const { getActiveCompetition, checkActiveCompetitionFinished } =
    useGetCompetitions();
  const activeCompetition = getActiveCompetition();

  const user = useAppSelector((state) => state.user) as UsersCollectionProps;
  const leagueOwner = useAppSelector((state) => state.league.owner);
  const dispatch = useAppDispatch();
  const matches =
    activeCompetition && activeCompetition.matchSchedule
      ? [...activeCompetition.matchSchedule]
      : null;
  const { getAllPastMatchesWithoutResult, getMatchRatings } = useGetMatches();
  const { calculateAndSaveStandings } = useSetStandings();
  const { getAllTeams } = useGetTeams();

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
      activeCompetition?.id as any,
    ).replaceField('matchSchedule', updatedMatches);
    if (!scheduleResult) {
      console.error('Updating matches failed');
    }
    const currentWeekResult = await firestoreMethods(
      'competitions',
      activeCompetition?.id as any,
    ).replaceField('currentWeek', week + 1);
    if (!currentWeekResult) {
      console.error('Error while updating currentWeek');
    }
    const newActiveCompetition = cloneDeep(activeCompetition);
    newActiveCompetition.matchSchedule = updatedMatches;
    dispatch(competitionActions.setCompetition(newActiveCompetition));
  };

  // Calculate matches result and then writes them in DB and finally updates the standings
  const calculateMatches = async (nextMatchMapped: any[]) => {
    if (!activeCompetition || !nextMatchMapped) return;

    const allTeams = await getAllTeams();
    if (!allTeams) return;

    // Create a Map for each team and assigns all the players
    const teamPlayersMap: Map<String, any[]> = new Map();
    await Promise.all(
      allTeams.map(async (team) => {
        const players = await getSportmonksPlayersDataByIds(
          team.players.map((player) => player.sportmonksId),
        );
        teamPlayersMap.set(team.shortId, players);
      }),
    );

    // Retrieve all the previous matches with no score
    const pastMatchesWithoutScore = getAllPastMatchesWithoutResult();
    const resultsByWeek: Record<string, GameResult[]> = {};
    for (const week of Object.keys(pastMatchesWithoutScore)) {
      // For each week I get the matches and I check the rating of Home and Away using false in getMatchRatings because this is not LIVE
      const weekMatches = pastMatchesWithoutScore[week];
      const weekResult: GameResult[] = [];

      for (const match of weekMatches) {
        const matchResult = await getMatchRatings(
          teamPlayersMap.get(match.home.shortId) as any,
          teamPlayersMap.get(match.away.shortId) as any,
          match,
          false,
        );

        const gameResult: GameResult = {
          home: {
            shortId: match.home.shortId,
            result: matchResult.result.home,
          },
          away: {
            shortId: match.away.shortId,
            result: matchResult.result.away,
          },
        };

        weekResult.push(gameResult);
      }

      resultsByWeek[week] = weekResult;
    }

    // Now that all week result are obtained I cycle on the results and for each week I update the game results calling writeGameResults
    for (const week of Object.keys(resultsByWeek)) {
      const weekGameResult = resultsByWeek[week];
      await writeGameResults(weekGameResult, Number(week));
    }

    // Finally once everything is done I save all the informations in the standings
    await calculateAndSaveStandings(activeCompetition.id);

    // Finish the competition if it can be
    const competitionCanBeFinished = checkActiveCompetitionFinished();
    if (competitionCanBeFinished) {
      await firestoreMethods(
        'competitions',
        activeCompetition?.id as any,
      ).replaceField('competitionFinished', true);
    }
  };

  return {
    writeGameResults,
    calculateMatches,
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
