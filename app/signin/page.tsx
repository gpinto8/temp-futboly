'use client';

import {
  SignInSignUp,
  type SignInSignUpProps,
} from '../../components/signin-signup';
import { APP_ROUTES } from '@/utils/routes';
import { useSetUsers } from '@/data/users/use-set-users';

export default () => {
  const { signInUser } = useSetUsers();

  const signInObject: SignInSignUpProps['mapObject'] = {
    title: 'Sign In',
    otherwiseDo: {
      text: "Don't have an account?",
      linkText: 'Sign Up',
      link: APP_ROUTES.SIGNUP,
    },
  };

  const handleSubmit: SignInSignUpProps['handleSubmit'] = async ({
    email,
    password,
  }) => {
    return await signInUser(email, password);
  };

  return (
    <SignInSignUp
      mapObject={signInObject}
      hideUserInput
      handleSubmit={handleSubmit}
    />
  );
};
