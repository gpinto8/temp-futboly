'use client';

import { getFirestoreData } from '@/firebase/firestore/methods';
import { getFirebaseAuthMethods } from '@/firebase/functions/authentication';
import { useAppSelector } from '@/store/hooks';

export const Header = () => {
  const firebaseMethods = getFirebaseAuthMethods();
  const handleLogout = async () => await firebaseMethods.logoutUser();

  const user = useAppSelector(state => state.user);

  return (
    <>
      <div className="bg-error">HOMEPAGE - LOGGED</div>
      <br />
      <br />
      <button className="bg-black text-white" onClick={handleLogout}>
        Logout
      </button>
      <br />
      <br />
      <h1>USERNAME: {user?.username}</h1>
    </>
  );
};
