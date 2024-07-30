'use client';

import { SignInSignUp, type SignInSignUpProps } from '../../components/signin-signup';
import { APP_ROUTES } from '@/utils/routes';
import { getFirebaseAuthMethods } from '@/firebase/functions/authentication';

export default () => {
  const firebaseAuth = getFirebaseAuthMethods();

  const signInObject: SignInSignUpProps['mapObject'] = {
    title: 'Sign In',
    otherwiseDo: {
      text: "Don't have an account?",
      linkText: 'Sign Up',
      link: APP_ROUTES.SIGNUP,
    },
  };

  const handleSubmit: SignInSignUpProps['handleSubmit'] = async ({ email, password }) => {
    return await firebaseAuth.signInUser(email, password);
  };

  return <SignInSignUp mapObject={signInObject} hideUserInput handleSubmit={handleSubmit} />;
};
