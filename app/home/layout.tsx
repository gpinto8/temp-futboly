'use client';

import { app } from '@/firebase/app';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useEffect } from 'react';
import { useSetUsers } from '@/data/users/use-set-users';
import { useSetLeague } from '@/data/leagues/use-set-league';
// import { useGetUsers } from '@/data/users/use-get-users';
import { useGetLeagues } from '@/data/leagues/use-get-leagues';
import { useAppSelector } from '@/store/hooks';
import { UsersCollectionProps } from '@/firebase/db-types';

export default ({ children }: any) => {
  const auth = getAuth(app);
  const user: UsersCollectionProps = useAppSelector((state) => state.user);
  const { setUser, logoutUser } = useSetUsers();
  // const { getUser } = useGetUsers();
  const { setLeague } = useSetLeague();
  const { getActiveLeagueByUid } = useGetLeagues();

  // FETCH USER DATA
  onAuthStateChanged(auth, async (user) => {
    const uid = user?.uid;
    if (uid) await setUser(uid);  //When it changes it will update the user so the useEffect will run
  });

  // FETCH LEAGUE DATA
  //const uid = getUser()?.id;
  useEffect(() => {
    (async () => {
      const uid = user?.id;
      console.log("UID presente: " + uid);
      if (uid) {
        const league = await getActiveLeagueByUid(uid, user);
        if (league) await setLeague(league, uid);
        // console.log({hasLeagueInside, uid}); //If the user has an active league I have to make sure that it exists
        // If he doesn't have a recent league, then I need to check if he is a partecipant in one
        // if (hasLeagueInside) await setLeague(activeLeague, uid);
      } else {
        //logoutUser();
      }
    })();
  }, [user]);

  return <>{children}</>;
};
