import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  signOut
} from 'firebase/auth';
import { app } from '@/firebase/app';
import { APP_ROUTES } from '../../utils/routes';
import { useRouter } from 'next/navigation';
import { getFirebaseErrors } from '../utils/errors';
import { LOGIN_URL, LOGOUT_URL } from '@/middleware';
import { setFirestoreData } from '../firestore/methods';
import { useAppDispatch } from '@/store/hooks';
import { userActions } from '@/store/slices/user';

export const getFirebaseAuthMethods = () => {
  const router = useRouter();
  const firebaseErrors = getFirebaseErrors();
  const dispatch = useAppDispatch();
  const auth = getAuth(app);

  return {
    signInUser: async (email: string, password: string) => {
      try {
        const credential = await signInWithEmailAndPassword(auth, email, password);
        const idToken = await credential.user.getIdToken();

        await fetch(LOGIN_URL, { headers: { Authorization: `Bearer ${idToken}` } });
        router.push(APP_ROUTES.HOME);

        return true;
      } catch (e: any) {
        firebaseErrors(e?.code);
        return false;
      }
    },
    get signUpUser() {
      return async (email: string, password: string, username: string) => {
        try {
          const object = await createUserWithEmailAndPassword(auth, email, password);
          const uid = object?.user?.uid;

          if (uid) {
            await setFirestoreData('users', uid as any, { username });
            await this.signInUser(email, password);
          }

          return true;
        } catch (e: any) {
          firebaseErrors(e?.code);
          return false;
        }
      };
    },
    logoutUser: async () => {
      await signOut(auth);
      await fetch(LOGOUT_URL);
      router.push(APP_ROUTES.SIGNIN);
    },
  };
};
