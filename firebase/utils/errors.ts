import { useAppDispatch } from '@/store/hooks';
import { errorActions } from '@/store/slices/error';

export const FIREBASE_ERRORS = {
  EMAIL_ALREADY_IN_USE: {
    code: 'auth/email-already-in-use',
    message: 'Email already in use.',
  },
  INVALID_EMAIL: {
    code: 'auth/invalid-email',
    message: 'Invalid email.',
  },
  WEAK_PASSWORD: {
    code: 'auth/weak-password',
    message: 'Weak password.',
  },
  USER_NOT_FOUND: {
    code: 'auth/user-not-found',
    message: 'User not found.',
  },
  WRONG_PASSWORD: {
    code: 'auth/wrong-password',
    message: 'Wrong password.',
  },
  INTERNAL_ERROR: {
    code: 'auth/internal-error',
    message: 'Internal error.',
  },
  UNKNOWN: {
    code: 'auth/unknown',
    message: 'An unknown error occurred.',
  },
};

export const getFirebaseErrors = () => {
  const dispatch = useAppDispatch();

  return (firebaseCode: string) => {
    const firebaseError = Object.values(FIREBASE_ERRORS).find(error => error.code === firebaseCode);
    if (firebaseError) {
      dispatch(errorActions.setError({ message: firebaseError.message }));
    } else {
      dispatch(errorActions.setError({ message: 'An error occurred' }));
    }
  };
};
