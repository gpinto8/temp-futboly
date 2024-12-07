import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { app } from '@/firebase/app';
import { APP_ROUTES } from '../../utils/routes';
import { useRouter } from 'next/navigation';
import { LOGIN_URL, LOGOUT_URL } from '@/middleware';
import { getFirebaseErrors } from '@/firebase/errors';
import { firestoreMethods } from '@/firebase/firestore-methods';
import { useAppDispatch } from '@/store/hooks';
import { userActions } from '@/store/slices/user';
import { errorActions } from '@/store/slices/error';

export const useSetUsers = () => {
  const router = useRouter();
  const auth = getAuth(app);
  const firebaseErrors = getFirebaseErrors();
  const dispatch = useAppDispatch();

  // LOGIN USER TO APP USING EMAIL/PASSWORD
  const signInUser = async (email: string, password: string) => {
    try {
      const credential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const idToken = await credential.user.getIdToken();

      await fetch(LOGIN_URL, {
        headers: { Authorization: `Bearer ${idToken}` },
      });
      router.push(APP_ROUTES.HOME);

      return true;
    } catch (e: any) {
      firebaseErrors(e?.code);
      return false;
    }
  };

  // REGISTER USER TO DATABASE USING EMAIL/PASSWORD AND THE CHOOSEN USERNAME
  const signUpUser = async (
    email: string,
    password: string,
    username: string,
  ) => {
    try {
      const object = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const uid = object?.user?.uid;

      if (uid) {
        await firestoreMethods('users', uid as any).createField(
          'username',
          username,
        );
        await signInUser(email, password);
      }

      return true;
    } catch (e: any) {
      firebaseErrors(e?.code);
      return false;
    }
  };

  // LOGOUT CURRENT USER FROM APP
  const logoutUser = async () => {
    await signOut(auth);
    await fetch(LOGOUT_URL);
    router.push(APP_ROUTES.SIGNIN);
  };

  // SET USER TO REDUX STORE FROM ITS USER ID
  const setUser = async (uid: string) => {
    const data: any = await firestoreMethods(
      'users',
      uid as any,
    ).getDocumentData();

    // If it exists then ok
    if (data?.username) {

      dispatch(userActions.setUser({ 
        uid, 
        username: data?.username,
        activeLeague: data?.activeLeague,
        activeCompetitions: data?.activeCompetitions,
      }));
    }
    // Otherwise the user doesn't exist in Firestore so we cant't proceed
    else {
      logoutUser();
      dispatch(
        errorActions.setError({
          message: 'User exists but is not registered on the database.',
        }),
      );
    }
  };

  return {
    signInUser,
    signUpUser,
    logoutUser,
    setUser,
  };
};
