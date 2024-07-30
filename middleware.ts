import { NextRequest, NextResponse } from 'next/server';
import { authMiddleware, redirectToHome, redirectToLogin } from 'next-firebase-auth-edge';
import { clientConfig, serverConfig } from '@/firebase/config';
import { APP_ROUTES } from './utils/routes';

export const LOGIN_URL = '/api/login';
export const LOGOUT_URL = '/api/logout';

const PUBLIC_PATHS = [APP_ROUTES.SIGNIN, APP_ROUTES.SIGNUP];

export async function middleware(request: NextRequest) {
  return authMiddleware(request, {
    loginPath: LOGIN_URL,
    logoutPath: LOGOUT_URL,
    apiKey: clientConfig.apiKey,
    cookieName: serverConfig.cookieName,
    cookieSignatureKeys: serverConfig.cookieSignatureKeys,
    cookieSerializeOptions: serverConfig.cookieSerializeOptions,
    serviceAccount: serverConfig.serviceAccount,
    handleValidToken: async ({ token, decodedToken, customToken }, headers) => {
      if (PUBLIC_PATHS.includes(request.nextUrl.pathname)) {
        return redirectToHome(request);
      }

      return NextResponse.next({
        request: { headers },
      });
    },
    handleInvalidToken: async reason => {
      return redirectToLogin(request, {
        path: APP_ROUTES.SIGNIN,
        publicPaths: PUBLIC_PATHS,
      });
    },
    handleError: async error => {
      return redirectToLogin(request, {
        path: APP_ROUTES.SIGNIN,
        publicPaths: PUBLIC_PATHS,
      });
    },
  });
}

export const config = {
  matcher: [
    '/',
    '/((?!_next|api|.*\\.).*)',
    // Can't use the variables here for some reason
    '/api/login',
    '/api/logout',
  ],
};
