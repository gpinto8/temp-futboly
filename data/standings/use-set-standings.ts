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
    // First I retrieve the competition to make sure it didn't change and Redux is out of sync
    const competitionData = await getCompetitionById(competitionId);
    if (!competitionData) return;
    if (!competitionData.matchSchedule) return;
    // I filter all the matches with a result
    const matchesWithResult = [...competitionData.matchSchedule].filter(
      (match) => Boolean(match.result),
    );
    if (matchesWithResult.length === 0) return;
    // If there are matches with a result I will retrieve all the teams with ShortTeamsProps
    const allCompetitionTeams = await getAllShortTeams();
    if (!allCompetitionTeams) return;
    const mapTeamMatches: any[] = [];
    // For each team I will filter the matches where it is either home or away
    for (let i = 0; i < allCompetitionTeams.length; i++) {
      const team = allCompetitionTeams[i];
      const teamMatches = matchesWithResult.filter(
        (match) =>
          team.shortId === match.home.shortId ||
          team.shortId === match.away.shortId,
      );
      // Once I have all the matches with a result of a team I will calculate all the results
      const teamResults = teamMatches
        .map((match) => calculateMatchResult(match, team))
        .filter((result) => result !== null);
      const teamClone = cloneDeep(team);
      // Then I calculate the points and summing up all the informations such as wins, loses, draws and so on
      const countResultsAndPoint = teamResults.reduce(
        (acc, result) => aggregateTeamResults(acc, result),
        { W: 0, L: 0, D: 0, points: 0 }, // Initialization
      );
      const standingsResults: StandingsResults = {
        lastMatches: teamResults,
        ...countResultsAndPoint,
      };
      teamClone.results = standingsResults;
      // Lastly I push the results and the modified Team into the "final" array
      mapTeamMatches.push(teamClone);
    }
    // Here I have all the teams elaborated so I sort them by points and assign to each team the standing position
    const completeStandings: ShortTeamPropsStandings[] = mapTeamMatches
      .sort((a, b) => a.results.points - b.results.points)
      .toReversed()
      .map((teamStandingsResult, index) => {
        return { ...teamStandingsResult, position: index + 1 };
      });
    // Then I write the updated standings in the db and if no errors are found I dispatch the modified competition
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
