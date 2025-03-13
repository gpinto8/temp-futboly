import { AddEditTeamModalSetTeamDataProps } from '@/components/modal/add-edit-team-modal';
import { useAppDispatch } from '@/store/hooks';
import { teamActions } from '@/store/slices/team';
import { useGetCompetitions } from '../competitions/use-get-competitions';

export const useSetTeams = () => {
  const dispatch = useAppDispatch();
  const { getActiveCompetition } = useGetCompetitions();

  // ADD TEAM TO CURRENT COMPETITION
  const addTeam = (team: AddEditTeamModalSetTeamDataProps) => {
    const currentCompetitionId = getActiveCompetition()?.id;
    if (currentCompetitionId && team) {
      dispatch(teamActions.setCurrentTeam(team));
    }
  };

  return {
    addTeam,
  };
};
