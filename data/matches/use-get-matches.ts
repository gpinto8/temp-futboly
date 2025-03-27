import {
  CompetitionsCollectionProps,
  MappedCompetitionsProps,
  UsersCollectionProps,
} from '@/firebase/db-types';
import { firestoreMethods } from '@/firebase/firestore-methods';
// import { Timestamp, DocumentReference } from 'firebase/firestore';
import { useAppSelector } from '@/store/hooks';

export const useGetMatches = () => {
    const activeCompetition = useAppSelector((state) => state.competition.activeCompetition);
    const matches = activeCompetiton ? activeCompetition.matchSchedule : null;

    const getPersonalMatches = () => {

    };

    const getMatchStatistics = () => {

    };
}
/*  matchSchedule:
    | {
        week: Number;
        home: DocumentReference<TeamsCollectionProps>;
        away: DocumentReference<TeamsCollectionProps>;
        result: {
          home: Number;
          away: Number;
        };
      }[]
*/ 
