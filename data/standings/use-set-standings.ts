import { firestoreMethods } from '@/firebase/firestore-methods';
import { useGetCompetitions } from '../competitions/use-get-competitions';
import { useGetTeams } from '../teams/use-get-teams';
import {
  MatchScheduleProps,
  StandingsResults,
  ShortTeamPropsStandings,
  ShortTeamProps,
} from '@/firebase/db-types';
import { competitionActions } from '@/store/slices/competitions';
import { useAppDispatch } from '@/store/hooks';
import cloneDeep from 'lodash/cloneDeep';

export const useSetStandings = () => {
  const { getCompetitionById } = useGetCompetitions();
  const { getAllShortTeams } = useGetTeams();
  const dispatch = useAppDispatch();

  const calculateAndSaveStandings = async (competitionId: string) => {
    const competitionData = await getCompetitionById(competitionId);
    if (!competitionData) return;
    if (!competitionData.matchSchedule) return;
    const matchesWithResult = [...competitionData.matchSchedule].filter(
      (match) => Boolean(match.result),
    );
    if (matchesWithResult.length === 0) return;
    const allCompetitionTeams = await getAllShortTeams();
    if (!allCompetitionTeams) return;
    const mapTeamMatches: any[] = [];
    for (let i = 0; i < allCompetitionTeams.length; i++) {
      const team = allCompetitionTeams[i];
      const teamMatches = matchesWithResult.filter(
        (match) =>
          team.shortId === match.home.shortId ||
          team.shortId === match.away.shortId,
      );
      const teamResults = teamMatches
        .map((match) => calculateMatchResult(match, team))
        .filter((result) => result !== null);
      const teamClone = cloneDeep(team);
      const countResultsAndPoint = teamResults.reduce(
        (acc, result) => aggregateTeamResults(acc, result),
        { W: 0, L: 0, D: 0, points: 0 }, // Initialization
      );
      const standingsResults: StandingsResults = {
        lastMatches: teamResults,
        ...countResultsAndPoint,
      };
      teamClone.results = standingsResults;
      mapTeamMatches.push(teamClone);
    }
    const completeStandings: ShortTeamPropsStandings[] = mapTeamMatches
      .sort((a, b) => a.results.points - b.results.points)
      .toReversed()
      .map((teamStandingsResult, index) => {
        return { ...teamStandingsResult, position: index + 1 };
      });
    const updateStandingResult = await firestoreMethods(
      'competitions',
      competitionData.id as any,
    ).replaceField('standings', completeStandings);
    if (!updateStandingResult) {
      console.error('Error while updating standings');
      return;
    }
    competitionData.standings = completeStandings;
    dispatch(competitionActions.setCompetition(competitionData));
  };

  return {
    calculateAndSaveStandings,
  };
};

function aggregateTeamResults(
  acc: { W: number; L: number; D: number; points: number },
  result: 'W' | 'L' | 'D',
): { W: number; L: number; D: number; points: number } {
  if (result !== 'W' && result !== 'L' && result !== 'D') {
    return acc; // Skip all the invalid results
  }
  const points = result === 'W' ? 3 : result === 'D' ? 1 : 0;
  acc[result] = (acc[result] || 0) + 1;
  acc.points += points;
  return acc;
}

function calculateMatchResult(
  match: MatchScheduleProps,
  team: ShortTeamProps,
): 'W' | 'L' | 'D' | null {
  if (!match.result) return null;
  const winner =
    match.result.home > match.result.away
      ? match.home
      : match.result.home !== match.result.away
        ? match.away
        : 'Draw';
  return winner === 'Draw' ? 'D' : team.shortId === winner.shortId ? 'W' : 'L';
}
