'use client';

import { SignInSignUp, type SignInSignUpProps } from '../../components/signin-signup';
import { APP_ROUTES } from '../../utils/routes';
import { getFirebaseAuthMethods } from '@/firebase/functions/authentication';

export default () => {
  const firebaseAuth = getFirebaseAuthMethods();

  const signUpObject: SignInSignUpProps['mapObject'] = {
    title: 'Sign Up',
    otherwiseDo: {
      text: 'Already have an account?',
      linkText: 'Sign In',
      link: APP_ROUTES.SIGNIN,
    },
  };

  const handleSubmit: SignInSignUpProps['handleSubmit'] = async ({ email, password, username }) => {
    if (username) return await firebaseAuth.signUpUser(email, password, username);
  };

  return <SignInSignUp mapObject={signUpObject} handleSubmit={handleSubmit} />;
};
