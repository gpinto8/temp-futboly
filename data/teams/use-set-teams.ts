import { useAppDispatch } from '@/store/hooks';
import { teamActions } from '@/store/slices/team';
import { useGetCompetitions } from '../competitions/use-get-competitions';
import { firestoreMethods } from '@/firebase/firestore-methods';
import { CompetitionsCollectionTeamsProps } from '@/firebase/db-types';
import { useGetTeams } from './use-get-teams';

export const useSetTeams = () => {
  const dispatch = useAppDispatch();
  const { getActiveCompetition } = useGetCompetitions();
  const { getTeamByUid } = useGetTeams();

  // ADD TEAM TO CURRENT COMPETITION AND MAKE IT THE CURRENT ONE
  const addTeam = (team: CompetitionsCollectionTeamsProps) => {
    const currentCompetition = getActiveCompetition();
    const competitionDocId = currentCompetition?.id;

    if (competitionDocId && team) {
      firestoreMethods('competitions', competitionDocId as any).addDataToField(
        'teams',
        team,
        'array',
      ); // Update it on firebase

      dispatch(teamActions.setCurrentTeam(team)); // Update redux as the current team
    }
  };

  // GET THE FIREBASE TEAM TO REDUX
  const setCurrentTeam = (userId: string) => {
    const team = getTeamByUid(userId);

    if (team) {
      dispatch(teamActions.setCurrentTeam(team)); // Update redux as the current team
    }
  };

  const deleteTeam = (competitionId: string, teamShortId: string) => {
    console.log({ competitionId, teamShortId });

    firestoreMethods('competitions', competitionId as any).replaceField(
      'teams',
      [],
    ); // Update it on firebase
  };

  return {
    addTeam,
    setCurrentTeam,
    deleteTeam,
  };
};
