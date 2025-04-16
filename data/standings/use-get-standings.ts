import { useAppSelector } from '@/store/hooks';

export const useGetStandings = () => {
  const activeCompetition = useAppSelector(
    (state) => state.competition.activeCompetition,
  );

  const getTeamPositionFromActiveCompetition = (teamId: String) => {
    // Basic checks
    if (!activeCompetition) return;
    if (!activeCompetition.standings) return;
    // From Redux standings I filter the row of the team requested
    const teamStandings = activeCompetition.standings.filter(
      (row) => row.shortId === teamId,
    );
    // The result should be an array with 1 element of which I return the position element
    if (teamStandings.length !== 1) return;
    return teamStandings[0].position;
  };

  const getStandingsFromActiveCompetition = () => {
    // I do some basics check and then I return the standings
    if (!activeCompetition) return;
    if (!activeCompetition.standings) return;
    return activeCompetition.standings;
  };

  return {
    getTeamPositionFromActiveCompetition,
    getStandingsFromActiveCompetition,
  };
};
