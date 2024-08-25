'use client';

import { app } from '@/firebase/app';
import { getFirestoreData } from '@/firebase/firestore/methods';
import { getFirebaseAuthMethods } from '@/firebase/functions/authentication';
import { useAppDispatch } from '@/store/hooks';
import { errorActions } from '@/store/slices/error';
import { userActions } from '@/store/slices/user';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

export default ({ children }: any) => {
  const dispatch = useAppDispatch();
  const auth = getAuth(app);
  const firebaseMethods = getFirebaseAuthMethods();

  const handleLogout = async () => {
    await firebaseMethods.logoutUser();
    dispatch(
      errorActions.setError({ message: 'User exists but is not registered on the database.' })
    );
  };

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
      const data = await getFirestoreData('users', uid as any);

      if (data) {
        dispatch(userActions.setUser({ uid, username: data?.username })); // If it exists then ok
      } else handleLogout(); // Otherwise the user doesn't exist in Firestore so we cant't proceed
    }
  });

  return <>{children}</>;
};
