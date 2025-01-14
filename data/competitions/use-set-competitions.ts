import { firestoreMethods } from '@/firebase/firestore-methods';
import {
  CompetitionsCollectionProps,
  UsersCollectionProps,
  MappedCompetitionsProps,
} from '@/firebase/db-types';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { competitionActions } from '@/store/slices/competitions';
import { DocumentReference } from 'firebase/firestore';
import { useGetCompetitions } from './use-get-competitions';

export const useSetCompetitions = () => {
  const user = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const {
    getCompetitions,
    getActiveCompetition,
    getCompetitionById,
    getCompetitionsByLeagueId,
    getActiveCompetitionByUid,
  } = useGetCompetitions();

  // SET ALL FETCHED COMPETITIONS TO THE REDUX STATE
  const setCompetitions = async (leagueId: string) => {
    if (leagueId) {
      const competitions = await getCompetitionsByLeagueId(leagueId);
      if (competitions) {
        dispatch(competitionActions.setAllCompetitions(competitions));
      }

      const activeCompetition = await getActiveCompetitionByUid(leagueId, user);
      if (activeCompetition) {
        dispatch(competitionActions.setActiveCompetition(activeCompetition));
      }
    }
  };

  // ADD A COMPETITION TO CURRENT LEAGUE
  const addCompetition = async (
    competition?: Omit<CompetitionsCollectionProps, 'id'>,
  ) => {
    if (competition) {
      if (!(competition.players.length > 0)) {
        const userRef: DocumentReference<UsersCollectionProps> =
          firestoreMethods(
            'users',
            user.id as any,
          ).getDocRef() as DocumentReference<UsersCollectionProps>;
        competition.players = [userRef];
      }

      const objCreated = await firestoreMethods(
        'competitions',
        'id',
      ).createDocument(competition);

      if (objCreated) {
        dispatch(competitionActions.setCompetition(objCreated));
        return objCreated as CompetitionsCollectionProps;
      }
    } else {
      console.error('No competition data provided');
    }
  };

  const setActiveCompetition = async (
    competitionId: CompetitionsCollectionProps['id'] | undefined,
    user: UsersCollectionProps,
    leagueId: string,
    competition?: CompetitionsCollectionProps | MappedCompetitionsProps,
  ) => {
    const setActiveCompetitionToUser = async (competitionId: string) => {
      const competitionRef = firestoreMethods(
        'competitions',
        competitionId as any,
      ).getDocRef();
      if (!competitionRef) return;

      const createField = user.activeCompetitions ? false : true;
      if (createField) {
        await firestoreMethods('users', user.id as any).createField(
          `activeCompetitions`,
          { [leagueId]: competitionRef },
        );
      } else {
        await firestoreMethods('users', user.id as any).replaceRefField(
          `activeCompetitions.${leagueId}`,
          competitionRef,
        );
      }
    };

    if (competition) {
      await setActiveCompetitionToUser(competition.id as string);
      dispatch(competitionActions.setActiveCompetition(competition));
    } else {
      const competition = await getCompetitionById(competitionId as any);
      if (competition) {
        dispatch(competitionActions.setActiveCompetition(competition));
      }
    }
  };

  // DELETE COMPETITION FROM CURRENT LEAGUE
  const deleteCompetition = async (
    competitionId: CompetitionsCollectionProps['id'],
  ) => {
    // ??
    await firestoreMethods('teams', 'id').deleteDocumentsByQuery(
      'competition',
      '==',
      competitionId,
    );

    // Deletes the object
    await firestoreMethods(
      'competitions',
      competitionId as any,
    ).deleteDocument();

    // Update the redux state
    const competitions = getCompetitions();
    const filteredCompetitions = competitions?.filter(
      (competition) => competition.id !== competitionId,
    );
    dispatch(competitionActions.setAllCompetitions(filteredCompetitions));

    // Checking if the current active competition is being deleted, so we remove its redux state data
    const currentCompetition = getActiveCompetition();
    if (currentCompetition?.id === competitionId) {
      dispatch(competitionActions.setActiveCompetition(undefined));
    }
  };

  return {
    setCompetitions,
    setActiveCompetition,
    addCompetition,
    deleteCompetition,
  };
};
