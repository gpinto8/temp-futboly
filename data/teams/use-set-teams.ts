import { useAppDispatch } from '@/store/hooks';
import { teamActions } from '@/store/slices/team';
import { useGetCompetitions } from '../competitions/use-get-competitions';
import { firestoreMethods } from '@/firebase/firestore-methods';
import { CompetitionsCollectionTeamsProps } from '@/firebase/db-types';

export const useSetTeams = () => {
  const dispatch = useAppDispatch();
  const { getActiveCompetition } = useGetCompetitions();

  // ADD TEAM TO CURRENT COMPETITION
  const addTeam = (team: CompetitionsCollectionTeamsProps) => {
    const currentCompetition = getActiveCompetition();
    const competitionDocId = currentCompetition?.id;

    if (competitionDocId && team) {
      firestoreMethods('competitions', competitionDocId as any).addDataToField(
        'teams',
        team,
        'array',
      ); // Update it on firebase

      dispatch(teamActions.setCurrentTeam(team)); // Update redux
    }
  };

  return {
    addTeam,
  };
};
