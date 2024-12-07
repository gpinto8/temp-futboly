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

  const getCompetitionByRef = async (competitionRef: DocumentReference<CompetitionsCollectionProps>) => {
    const competition = await firestoreMethods("competitions", "competitionRef" as any).getDocumentDataByRef(competitionRef);
    return competition ? await mapCompetition(competition as CompetitionsCollectionProps) as MappedCompetitionsProps : null as null;
  }

  // GET CURRENT ACTIVE COMPETITION FROM CURRENT LEAGUE
  const getCompetitionsByUid = async (leagueId: string, userId: string) => {
    const leagueRef = firestoreMethods("leagues", leagueId as any).getDocRef();
    const userRef = firestoreMethods("users", userId as any).getDocRef();
    const competitionsFirestoreObj = firestoreMethods("competitions", "id" as any);
    competitionsFirestoreObj.setWhereFilter("league", "==", leagueRef);
    competitionsFirestoreObj.setWhereFilter("players", "array-contains", userRef);
    const competitions = await competitionsFirestoreObj.executeQuery() as CompetitionsCollectionProps[];
      
    if (competitions && competitions.length > 0) {
      const mappedCompetitions = await Promise.all(competitions.map(async (competition: CompetitionsCollectionProps) => await mapCompetition(competition as CompetitionsCollectionProps)));
      return mappedCompetitions as MappedCompetitionsProps[];
    } else {
      return [];
    }
  };

  const getCompetitionsByLeagueId = async (leagueId: string) => {
    const leagueRef = firestoreMethods("leagues", leagueId as any).getDocRef();
    const competitions = await firestoreMethods("competitions", "id").getDocsByQuery("league", "==", leagueRef);
    if (competitions && competitions.length > 0) {
      const mappedCompetitions = await Promise.all(competitions.map(async (competition: CompetitionsCollectionProps) => await mapCompetition(competition as CompetitionsCollectionProps)));
      return mappedCompetitions as MappedCompetitionsProps[];
    } else {
      return [];
    }
  };

  const getActiveCompetitionByUid = async (leagueId: string, user: UsersCollectionProps) => {
    if (user.activeCompetitions) {
      const competitionRef = user.activeCompetitions[leagueId];
      if (competitionRef) {
        const competition = await getCompetitionByRef(competitionRef); //If league doesn't exist returns the first one it finds
        if (competition) return competition as CompetitionsCollectionProps;
      }
    }
    const userRef = firestoreMethods("users", user.id as any).getDocRef();
    const leagueRef = firestoreMethods("leagues", leagueId as any).getDocRef();
    const competitionsQueryBuilder = firestoreMethods("competitions", "id");
    competitionsQueryBuilder.setWhereFilter("league", "==", leagueRef);
    competitionsQueryBuilder.setWhereFilter("players", "array-contains", userRef);
    const competitions = await competitionsQueryBuilder.executeQuery() as CompetitionsCollectionProps[];
    if (!competitions || !(competitions.length > 0)) return null as null;
    const competition = competitions[0];  // Return the first one it finds --> TODO put limit 1
    return competition as CompetitionsCollectionProps;
  };

  const getCompetitionRefById = (id: string) => {
    const competition = firestoreMethods("competitions", id as any).getDocRef();
    return competition ? competition as DocumentReference<CompetitionsCollectionProps> : null as null;
  };

  return { getCompetitionById, getCompetitionByRef, getCompetitionsByUid, getCompetitionsByLeagueId, getActiveCompetitionByUid, getCompetitionRefById };
};
