import { getFirestoreLeagues, getFirestoreUsers } from '@/firebase/firestore/get-methods';
import { setFirestoreData } from '@/firebase/firestore/methods';
import { LeaguesCollectionProps } from '@/firebase/firestore/types';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { leagueActions } from '@/store/slices/league';
import { useCallback, useEffect, useState } from 'react';

type Partial<T> = {
  [P in keyof T]?: T[P];
};

// state otherwise fetch
export const getAppData = () => {
  const league = useAppSelector(state => state.league);
  const user = useAppSelector(state => state.user);
  const [once, setOnce] = useState(true);
  const [fetchedLeague, setFetchedLeague] = useState<LeaguesCollectionProps>();

  useEffect(() => {
    console.log('state', { league });
  }, [league]);

  const getLeague = (fetch?: boolean) => {
    // console.log({ league });
    return league;
    // console.log({ league });
    // setFetchedLeague(league);
    // setOnce(false);
  };

  const getLeagueFetch = useCallback(async () => {
    if (user?.uid) {
      console.log('fetch');
      await getFirestoreUsers(user?.uid);

      // console.log('fetch asdfasdf', user?.uid);
      const userData = await getFirestoreUsers(user?.uid);
      // console.log({ userData });
      const leagues = userData?.leagues?.map((league: any) => league.id);
      // console.log({ leagues });
      const activeLeagueId = leagues?.[0]; // to change once we get to the header to change league
      // console.log({ activeLeagueId });

      const league2 = await getFirestoreLeagues(activeLeagueId);
      // console.log({ league2 });

      return league2;
    }
  }, [user]);

  // console.log({ result: result() });
  // return result();

  // if (league2) {
  //   setFetchedLeague(league2);
  //   setOnce(false);
  // }
  // return league2;
  return { getLeague, getLeagueFetch };
};

// console.log({ fetchedLeague });
// console.log({ league });
// return { league };
// };

export const setAppData = () => {
  const user = useAppSelector(state => state.user);
  const dispatch = useAppDispatch();

  const setLeague = async (data?: Partial<LeaguesCollectionProps>) => {
    const userData = await getFirestoreUsers(user.uid);
    const leagues = userData?.leagues?.map((league: any) => league.id);
    const activeLeagueId = leagues?.[0]; // to change once we get to the header

    const updatedLeague = await setFirestoreData('leagues', activeLeagueId, data);
    dispatch(leagueActions.setLeague(updatedLeague));
  };

  return { setLeague };
};
