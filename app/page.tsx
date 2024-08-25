import { getTokens } from 'next-firebase-auth-edge';
import { cookies } from 'next/headers';
import { clientConfig, serverConfig } from '@/firebase/config';
import { APP_ROUTES } from '@/utils/routes';
import { redirect } from 'next/navigation';

export default async () => {
  let tokens: any;
  try {
    tokens = await getTokens(cookies(), {
      apiKey: clientConfig.apiKey,
      cookieName: serverConfig.cookieName,
      cookieSignatureKeys: serverConfig.cookieSignatureKeys,
      serviceAccount: serverConfig.serviceAccount,
    });
  } catch (error) {}

  if (tokens) {
    redirect(APP_ROUTES.HOME);
  } else {
    redirect(APP_ROUTES.SIGNIN);
  }
};
