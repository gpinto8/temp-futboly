import { firestoreMethods } from '@/firebase/firestore-methods';
import { CompetitionsCollectionProps, UsersCollectionProps, MappedCompetitionsProps } from '@/firebase/db-types';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { competitionActions } from '@/store/slices/competitions';
import { DocumentReference } from 'firebase/firestore';
import { useGetCompetitions } from './use-get-competitions';

export const useSetCompetitions = () => {
  const competitionState = useAppSelector((state) => state.league);
  const user = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const { getCompetitionById } = useGetCompetitions();

  // ADD A COMPETITION TO CURRENT LEAGUE
  const addCompetition = async (
    competition?: Omit<CompetitionsCollectionProps, 'id'>,
  ) => {
    if (competition) {
      if (!(competition.players.length > 0)) {
        const userRef: DocumentReference<UsersCollectionProps>= firestoreMethods('users', user.id as any).getDocRef() as DocumentReference<UsersCollectionProps>;
        competition.players = [userRef];
      }
      const objCreated = await firestoreMethods('competitions', 'id').createDocument(competition);
      if (objCreated) {
        dispatch(competitionActions.setCompetition(objCreated));
        return objCreated as CompetitionsCollectionProps;
      }
    } else {
      console.error('No competition data provided');
    }
  };

  const setActiveCompetition = async (competitionId: CompetitionsCollectionProps['id'] | undefined, user: UsersCollectionProps, leagueId: string, competition?: CompetitionsCollectionProps | MappedCompetitionsProps ) => {
    const setActiveCompetitionToUser = async (competitionId: string) => {
      const competitionRef = firestoreMethods('competitions', competitionId as any).getDocRef();
      const userUpdate = await firestoreMethods('users', user.id as any).replaceRefField(`activeCompetitions.${leagueId}`, competitionRef);
      // if (userUpdate) {
      //   dispatch(competitionActions.setCompetition(competition));  //TODO: Dispatch also the updated user info
      // }
    };

    if (competition) {
      await setActiveCompetitionToUser(competition.id as string);
      dispatch(competitionActions.setCompetition(competition));
    } else {
      const competition = await getCompetitionById(competitionId as any);
      if (competition) {
        dispatch(competitionActions.setCompetition(competition));
      } else {
        console.error('No competition found');
      }
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

  return { setActiveCompetition, addCompetition, deleteCompetition };
};
