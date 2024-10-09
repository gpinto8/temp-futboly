import { firestoreMethods } from '@/firebase/firestore-methods';
import { CompetitionsCollectionProps } from '@/firebase/db-types';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { competitionActions } from '@/store/slices/competitions';

export const useSetCompetitions = () => {
  const competitionState = useAppSelector((state) => state.league);
  const dispatch = useAppDispatch();

  // ADD A COMPETITION TO CURRENT LEAGUE
  const addCompetition = async (
    competition?: Omit<CompetitionsCollectionProps, 'id'>,
  ) => {
    if (competition) {
      const objCreated = await firestoreMethods(
        'competitions',
        'id',
      ).createDocument(competition);
      if (objCreated) {
        dispatch(competitionActions.setCompetition(objCreated));
        return objCreated;
      }
    } else {
      console.error('No competition data provided');
    }
  };

  // // SET A COMPETITION AS ACTIVE FROM CURRENT LEAGUE   --> Commented because it is tricky to handle when you swap between leagues,
  // const setActiveCompetition = async (
  //   id: CompetitionsCollectionProps['id'] | undefined,
  // ) => {
  //   if (!id) {

  //   }
  //   const mergedCompetitions = league?.competitions.map((competition) => {
  //     return {
  //       ...competition,
  //       active: !!(competition.id === id),
  //     };
  //   });
  //   await firestoreMethods('leagues', league.documentId as any).replaceField(
  //     'competitions',
  //     mergedCompetitions,
  //   );
  //   dispatch(leagueActions.setAllCompetitions(mergedCompetitions));
  // };

  // DELETE COMPETITION FROM CURRENT LEAGUE
  const deleteCompetition = async (
    competitionId: CompetitionsCollectionProps['id'],
  ) => {
    await firestoreMethods('teams', "id").deleteDocumentsByQuery('competition', '==', competitionId);
    await firestoreMethods('competitions', competitionState.id as any).deleteDocument(); //Deletes the object
    
      //dispatch(leagueActions.setAllCompetitions(filteredCompetitions)); We need to get the competitions and once we have then then we filter the deleted one and update the state
      location.reload();
  };

  return { addCompetition, deleteCompetition };
};
