import { getFirestoreUsers } from '@/firebase/firestore/get-methods';
import { setFirestoreData } from '@/firebase/firestore/methods';
import { LeaguesCollectionProps } from '@/firebase/firestore/types';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { leagueActions } from '@/store/slices/league';

type Partial<T> = {
  [P in keyof T]?: T[P];
};

export const updateFirestoreRedux = () => {
  const user = useAppSelector(state => state.user);
  const dispatch = useAppDispatch();

  const setLeague = async (data?: Partial<LeaguesCollectionProps>) => {
    const userData = await getFirestoreUsers(user.uid);
    const leagues = userData?.leagues?.map((league: any) => league.id);
    const activeLeagueId = leagues?.[0]; // TODO: to change once we get to the header

    const updatedLeague = await setFirestoreData('leagues', activeLeagueId, data);
    dispatch(leagueActions.setLeague(updatedLeague));
  };

  return { setLeague };
};
