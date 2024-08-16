'use client';

import { app } from '@/firebase/app';
import { getFirestoreData } from '@/firebase/firestore/methods';
import { useAppDispatch } from '@/store/hooks';
import { userActions } from '@/store/slices/user';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

export default ({ children }: any) => {
  const dispatch = useAppDispatch();
  const auth = getAuth(app);

  onAuthStateChanged(auth, async user => {
    const uid = user?.uid;
    if (uid) {
      const data = await getFirestoreData('users', uid as any);
      if (data) dispatch(userActions.setUser({ uid, username: data?.username }));
    }
  });

  return <>{children}</>;
};
