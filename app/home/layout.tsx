'use client';

import { app } from '@/firebase/app';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useEffect } from 'react';
import { useSetUsers } from '@/data/users/use-set-users';
import { useSetLeague } from '@/data/leagues/use-set-league';
import { useGetUsers } from '@/data/users/use-get-users';
import { useGetLeagues } from '@/data/leagues/use-get-leagues';

export default ({ children }: any) => {
  const auth = getAuth(app);
  const { setUser } = useSetUsers();
  const { getUser } = useGetUsers();
  const { setLeague } = useSetLeague();
  const { hasLeagues } = useGetLeagues();

  // FETCH USER DATA
  onAuthStateChanged(auth, async (user) => {
    const uid = user?.uid;
    if (uid) await setUser(uid);
  });

  // FETCH LEAGUE DATA
  const uid = getUser()?.id;
  useEffect(() => {
    (async () => {
      const uid = getUser()?.id;
      if (uid) {
        const hasLeagueInside = await hasLeagues(uid);
        console.log({hasLeagueInside, uid})
        if (hasLeagueInside) await setLeague(uid);
      }
    })();
  }, [uid]);

  return <>{children}</>;
};
