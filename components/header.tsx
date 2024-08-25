'use client';

import { getFirebaseAuthMethods } from '@/firebase/functions/authentication';
import { useAppSelector } from '@/store/hooks';

export const Header = () => {
  const firebaseMethods = getFirebaseAuthMethods();
  const handleLogout = async () => await firebaseMethods.logoutUser();
  const user = useAppSelector(state => state.user);

  return (
    <div className="flex justify-between border border-error">
      <div className="">HOMEPAGE</div>
      <h1>USERNAME: {user?.username}</h1>
      <button className="bg-black text-white" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
};
