import { firestoreMethods } from '@/firebase/firestore-methods';
import { LeagueCollectionCompetitionProps } from '@/firebase/db-types';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { leagueActions } from '@/store/slices/league';
import { getRandomId } from '@/utils/id';

export const useSetCompetitions = () => {
  const league = useAppSelector((state) => state.league);
  const dispatch = useAppDispatch();

  // ADD A COMPETITION TO CURRENT LEAGUE
  const addCompetition = async (
    competition?: Omit<LeagueCollectionCompetitionProps, 'id'>,
  ) => {
    if (competition) {
      const newCompetition: LeagueCollectionCompetitionProps = {
        ...competition,
        id: getRandomId(), // We take care of the id here once, not on every function instance // TODO: maybe create an util that does this common to every document? idk
      };

      if (newCompetition) {
        await firestoreMethods(
          'leagues',
          league.documentId as any,
        ).addDataToField('competitions', newCompetition, 'array');
        dispatch(leagueActions.setCompetition(newCompetition));
        return newCompetition;
      }
    }
  };

  // SET A COMPETITION AS ACTIVE FROM CURRENT LEAGUE
  const setActiveCompetition = async (
    id: LeagueCollectionCompetitionProps['id'],
  ) => {
    const mergedCompetitions = league?.competitions.map((competition) => {
      return {
        ...competition,
        active: !!(competition.id === id),
      };
    });
    await firestoreMethods('leagues', league.documentId as any).replaceField(
      'competitions',
      mergedCompetitions,
    );
    dispatch(leagueActions.setAllCompetitions(mergedCompetitions));
  };

  // DELETE COMPETITION FROM CURRENT LEAGUE
  const deleteCompetition = async (
    competitionId: LeagueCollectionCompetitionProps['id'],
  ) => {
    // TODO: check if the competition is active and maybe dont delete it, show feedback to user through a toast?
    const filteredCompetitions = league.competitions?.filter(
      (competition) => competition.id !== competitionId,
    );
    if (filteredCompetitions) {
      await firestoreMethods('leagues', league.documentId as any).replaceField(
        'competitions',
        filteredCompetitions,
      );

      if (filteredCompetitions) {
        dispatch(leagueActions.setAllCompetitions(filteredCompetitions));
      }
    }
  };

  return { addCompetition, setActiveCompetition, deleteCompetition };
};
