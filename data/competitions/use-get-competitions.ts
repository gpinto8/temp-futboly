import { CompetitionsCollectionProps, MappedCompetitionsProps, UsersCollectionProps } from '@/firebase/db-types';
import { firestoreMethods } from '@/firebase/firestore-methods';
import { Timestamp, DocumentReference } from 'firebase/firestore';

export const useGetCompetitions = () => {

  const mapCompetition = async (
    competition: CompetitionsCollectionProps,
    //index: number,
  ) => {
    const toDate = (date: Timestamp) =>
      date && new Date(date.toDate()).toLocaleDateString();
    const active = competition.endDate.toDate() > new Date() && competition.startDate.toDate() < new Date();

    return {
      ...competition,
      startDateText: toDate(competition?.startDate),
      endDateText: toDate(competition?.endDate),
      active: active
    };
  };

  // GET COMPETITION BY ID --> TO GET THE ACTIVE WE JUST NEED TO PASS THE ID FORM THE USER FIELD
  const getCompetitionById = async (id: DocumentReference<CompetitionsCollectionProps>) => {
    const competition = await firestoreMethods("competitions", id as any).getDocumentData();
    if (competition) {
      const mappedCompetitions = await mapCompetition(competition as CompetitionsCollectionProps);
      return mappedCompetitions as MappedCompetitionsProps;
    } else {
      return null as null;
    }
  }

  // GET CURRENT ACTIVE COMPETITION FROM CURRENT LEAGUE
  const getCompetitionsByUid = async (uid: string) => {
    const competitions = await firestoreMethods("competitions", uid as any).getDocsByQuery("league", "==", uid);
    if (competitions) {
      const mappedCompetitions = await Promise.all(competitions.map(async (competition: CompetitionsCollectionProps) => await mapCompetition(competition as CompetitionsCollectionProps)));
      return mappedCompetitions as MappedCompetitionsProps[];
    } else {
      return [];
    }
  };

  const getCompetitionsByLeagueId = async (leagueId: string) => {
    const competitions = await firestoreMethods("competitions", "id").getDocsByQuery("league", "==", leagueId);
    if (competitions) {
      const mappedCompetitions = await Promise.all(competitions.map(async (competition: CompetitionsCollectionProps) => await mapCompetition(competition as CompetitionsCollectionProps)));
      return mappedCompetitions as MappedCompetitionsProps[];
    } else {
      return [];
    }
  };

  const getActiveCompetitionByUid = async (uid: string, leagueId: string, user?: UsersCollectionProps | undefined) => {
    if (user) {
      console.log(user);
      console.log(user.activeCompetitions);
      const competitionRef = user.activeCompetitions[leagueId];
      if (competitionRef) {
        const competition = await getCompetitionById(competitionRef);  //If league doesn't exist has to be handled
        if (competition) return competition as CompetitionsCollectionProps;
      }
    }
    const competitions = await firestoreMethods("leagues", "id").getDocsByQuery(`players.${uid}`, ">", "");
    return competitions ? competitions[0] as CompetitionsCollectionProps : null as null; //Return the first one it finds --> TODO put limit 1
  };

  return { getCompetitionById, getCompetitionsByUid, getCompetitionsByLeagueId, getActiveCompetitionByUid };
};
