'use client';

import { setAppData } from '@/data/get-app-data';
import { app } from '@/firebase/app';
import { getFirestoreLeagues, getFirestoreUsers } from '@/firebase/firestore/get-methods';
import { getFirebaseAuthMethods } from '@/firebase/functions/authentication';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { errorActions } from '@/store/slices/error';
import { leagueActions } from '@/store/slices/league';
import { userActions } from '@/store/slices/user';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useEffect } from 'react';

export default ({ children }: any) => {
  const dispatch = useAppDispatch();
  const auth = getAuth(app);
  const firebaseMethods = getFirebaseAuthMethods();
  const user = useAppSelector(state => state.user);
  // const { setLeague } = setAppData();

  const handleLogout = async () => {
    await firebaseMethods.logoutUser();
    dispatch(
      errorActions.setError({ message: 'User exists but is not registered on the database.' })
    );
  };

  useEffect(() => {
    (async () => {
      if (user.uid) {
        const userData = await getFirestoreUsers(user?.uid);
        const leagues = userData?.leagues?.map((league: any) => league.id);
        const activeLeagueId = leagues?.[0]; // to change once we get to the header to change league

        const league = await getFirestoreLeagues(activeLeagueId);
        // console.log({ league });
        dispatch(leagueActions.setLeague(league));
      }
    })();
  }, [user]);

  // TODO: To revalidate user existance on every page refresh in case we delete the user from the "users" firestore collection
  // useEffect(() => {
  //   (async () => {
  //     console.log('useEffect');
  //     if (!user.uid) await handleLogout();
  //   })();
  // }, []);

  onAuthStateChanged(auth, async user => {
    const uid = user?.uid;
    if (uid) {
      const data = await getFirestoreUsers(uid as any);
      if (data?.username) {
        dispatch(userActions.setUser({ uid, username: data?.username })); // If it exists then ok
      } else handleLogout(); // Otherwise the user doesn't exist in Firestore so we cant't proceed
    }
  });

  return <>{children}</>;
};
