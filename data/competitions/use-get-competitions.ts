import { CompetitionsCollectionProps } from '@/firebase/db-types';
import { firestoreMethods } from '@/firebase/firestore-methods';

export const useGetCompetitions = () => {

  // const mapCompetition = (
  //   competition: CompetitionsCollectionProps,
  //   index: number,
  // ) => {
  //   const toDate = (date: Timestamp) =>
  //     date && new Date(date.toDate()).toLocaleDateString();

  //   return {
  //     indexNo: ++index,
  //     startDateText: toDate(competition?.startDate),
  //     endDateText: toDate(competition?.endDate),
  //     active: competition?.active,
  //     id: competition?.id,
  //     name: competition?.name,
  //     players: competition?.players,
  //     usersTotal: 'TODO',
  //     teamsTotal: 'TODO',
  //     type: 'TODO' as any,
  //     activeText: competition?.active ? 'Active' : 'Non-Active',
  //     status: '',
  //     currentWeek: 'TODO',
  //   };
  // };

  // GET COMPETITION BY ID --> TO GET THE ACTIVE WE JUST NEED TO PASS THE ID FORM THE USER FIELD
  const getCompetitionById = async (id: string) => {
    const competition = await firestoreMethods("competitions", id as any).getDocumentData();
    return competition ? competition as CompetitionsCollectionProps : null as null;
  }

  // GET CURRENT ACTIVE COMPETITION FROM CURRENT LEAGUE
  const getCompetitionsByUid = async (uid: string) => {
    const competitions = await firestoreMethods("competitions", uid as any).getDocsByQuery("league", "==", uid);
    return competitions ? competitions as CompetitionsCollectionProps[] : [];
  };

  return { getCompetitionById, getCompetitionsByUid };
};
