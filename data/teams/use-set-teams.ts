import { useAppDispatch } from '@/store/hooks';
import { teamActions } from '@/store/slices/team';
import { useGetCompetitions } from '../competitions/use-get-competitions';
import { firestoreMethods } from '@/firebase/firestore-methods';
import { CompetitionsCollectionTeamsProps } from '@/firebase/db-types';
import { useGetTeams } from './use-get-teams';
import merge from 'lodash/merge';

export const useSetTeams = () => {
  const dispatch = useAppDispatch();
  const { getActiveCompetition, getCompetitionById } = useGetCompetitions();
  const { getTeamByUid, getTeam } = useGetTeams();

  // ADD TEAM TO CURRENT COMPETITION AND MAKE IT THE CURRENT ONE
  const addTeam = (team: CompetitionsCollectionTeamsProps) => {
    const currentCompetition = getActiveCompetition();
    const competitionDocId = currentCompetition?.id;

    if (competitionDocId && team) {
      // Update it on firebase
      firestoreMethods('competitions', competitionDocId as any).addDataToField(
        'teams',
        team,
        'array',
      );

      // Update redux as the current team
      dispatch(teamActions.setCurrentTeam(team));
    }
  };

  // GET THE FIREBASE TEAM TO REDUX
  const setCurrentTeam = (userId: string) => {
    const team = getTeamByUid(userId);

    if (team) {
      dispatch(teamActions.setCurrentTeam(team)); // Update redux as the current team
    }
  };

  // DELETE A TEAM BASED ON THE COMPETITION AND THE SHORT ID TEAM PROP
  const deleteTeam = async (competitionId: string, shortId: string) => {
    const competitionData = await getCompetitionById(competitionId);
    if (competitionData) {
      const filteredTeams = competitionData?.teams.filter(
        (team) => team.shortId !== shortId,
      );

      // Update it on firebase
      firestoreMethods('competitions', competitionId as any).replaceField(
        'teams',
        filteredTeams,
      );

      // Refresh the admin team tabs
      dispatch(teamActions.refreshAdminTeams());

      // If the deleted team is the current one then delete it from redux too
      const currentTeamShortId = getTeam()?.shortId;
      if (currentTeamShortId === shortId) {
        dispatch(teamActions.deleteCurrentTeam());
      }
    }
  };

  // EDIT A TEAM BASED ON THE COMPETITION AND THE SHORT ID TEAM PROP
  const editTeam = async (
    competitionId: string,
    shortId: string,
    newTeam: Partial<CompetitionsCollectionTeamsProps>,
  ) => {
    const competitionData = await getCompetitionById(competitionId);
    if (competitionData) {
      const allTeams = competitionData?.teams;

      // First find the team to change from all the competitions and edit it
      const foundTeam = allTeams.find((team) => team.shortId === shortId);
      if (foundTeam) {
        const mergedTeam: CompetitionsCollectionTeamsProps = merge(
          foundTeam,
          newTeam,
        );

        if (mergedTeam) {
          // Then place it inside the other teams, removing the old one with this new edited one
          const filteredTeams = competitionData?.teams.filter(
            (team) => team.shortId !== shortId,
          );
          const newAllTeams = [...filteredTeams, mergedTeam];

          // Update it on firebase
          firestoreMethods('competitions', competitionId as any).replaceField(
            'teams',
            newAllTeams,
          );

          // Refresh the admin team tabs
          dispatch(teamActions.refreshAdminTeams());

          // If the edited team is the current one then update it on redux too
          const currentTeamShortId = getTeam()?.shortId;
          if (currentTeamShortId === shortId) {
            dispatch(teamActions.setCurrentTeam(mergedTeam));
          }
        }
      }
    }
  };

  return {
    addTeam,
    setCurrentTeam,
    deleteTeam,
    editTeam,
  };
};
