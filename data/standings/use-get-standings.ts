import { useAppSelector } from '@/store/hooks';

export const useGetStandings = () => {
  const activeCompetition = useAppSelector(
    (state) => state.competition.activeCompetition,
  );

  const getTeamPositionFromActiveCompetition = (teamId: String) => {
    if (!activeCompetition) return;
    if (!activeCompetition.standings) return;
    const teamStandings = activeCompetition.standings.filter(
      (row) => row.shortId === teamId,
    );
    if (teamStandings.length !== 1) return;
    return teamStandings[0].position;
  };

  const getStandingsFromActiveCompetition = () => {
    if (!activeCompetition) return;
    if (!activeCompetition.standings) return;
    return activeCompetition.standings;
  };

  return {
    getTeamPositionFromActiveCompetition,
    getStandingsFromActiveCompetition,
  };
};
