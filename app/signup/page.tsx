'use client';

import { useSetUsers } from '@/data/users/use-set-users';
import {
  SignInSignUp,
  type SignInSignUpProps,
} from '../../components/signin-signup';
import { APP_ROUTES } from '../../utils/routes';

export default () => {
  const { signUpUser } = useSetUsers();

  const signUpObject: SignInSignUpProps['mapObject'] = {
    title: 'Sign Up',
    otherwiseDo: {
      text: 'Already have an account?',
      linkText: 'Sign In',
      link: APP_ROUTES.SIGNIN,
    },
  };

  const handleSubmit: SignInSignUpProps['handleSubmit'] = async ({
    email,
    password,
    username,
  }) => {
    if (username) return await signUpUser(email, password, username);
  };

  return <SignInSignUp mapObject={signUpObject} handleSubmit={handleSubmit} />;
};
