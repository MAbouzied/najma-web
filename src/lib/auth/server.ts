import { betterAuth } from 'better-auth';
import {
  BETTER_AUTH_SECRET,
  BETTER_AUTH_URL,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
} from 'astro:env/server';
import { createGoogleProfileAuthorizer, type GoogleUserInfoProfile } from './profile-authorization.ts';
import { getStaffAccessService } from '../staff-access/server.ts';

export type { GoogleUserInfoProfile } from './profile-authorization.ts';

function resolveAuthBaseUrl(raw: string | undefined): string {
  if (!raw?.trim()) {
    throw new Error('Staff authentication is not configured.');
  }

  let url: URL;
  try {
    url = new URL(raw.trim());
  } catch {
    throw new Error('Staff authentication is not configured.');
  }

  if (url.protocol !== 'https:' && url.protocol !== 'http:') {
    throw new Error('Staff authentication is not configured.');
  }

  // Production and preview must use HTTPS; local development may use http://localhost.
  const isLocalHttp = url.protocol === 'http:'
    && (url.hostname === 'localhost' || url.hostname === '127.0.0.1');
  if (url.protocol !== 'https:' && !(import.meta.env.DEV && isLocalHttp)) {
    throw new Error('Staff authentication is not configured.');
  }

  return url.origin;
}

function requireAuthEnv(): {
  secret: string;
  baseURL: string;
  clientId: string;
  clientSecret: string;
} {
  if (!BETTER_AUTH_SECRET || !GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
    throw new Error('Staff authentication is not configured.');
  }

  return {
    secret: BETTER_AUTH_SECRET,
    baseURL: resolveAuthBaseUrl(BETTER_AUTH_URL),
    clientId: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
  };
}

export async function fetchGoogleUserInfo(
  accessToken: string,
): Promise<GoogleUserInfoProfile | null> {
  const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!response.ok) return null;
  return (await response.json()) as GoogleUserInfoProfile;
}

function createAuthInstance() {
  const env = requireAuthEnv();
  const staffAccess = getStaffAccessService();
  const authorizeGoogleProfile = createGoogleProfileAuthorizer({
    findApprovedByEmail: staffAccess.findApprovedByEmail,
    syncGoogleProfile: staffAccess.syncGoogleProfile,
  });

  return betterAuth({
    secret: env.secret,
    baseURL: env.baseURL,
    onAPIError: {
      errorURL: `${env.baseURL}/login`,
    },
    // Stateless cookie sessions — no database for this staff-only scope.
    session: {
      expiresIn: 60 * 60 * 8,
      updateAge: 60 * 60,
      cookieCache: {
        enabled: true,
        maxAge: 60 * 60 * 8,
      },
    },
    advanced: {
      useSecureCookies: env.baseURL.startsWith('https://'),
    },
    socialProviders: {
      google: {
        clientId: env.clientId,
        clientSecret: env.clientSecret,
        disableIdTokenSignIn: true,
        scope: ['openid', 'email', 'profile'],
        accessType: 'online',
        prompt: 'select_account',
        async getUserInfo(token) {
          if (!token.accessToken) return null;
          const profile = await fetchGoogleUserInfo(token.accessToken);
          if (!profile) return null;
          const user = await authorizeGoogleProfile(profile);
          if (!user) return null;
          return { user, data: profile };
        },
      },
    },
  });
}

type AuthInstance = ReturnType<typeof createAuthInstance>;

let authInstance: AuthInstance | undefined;

export function getAuth(): AuthInstance {
  if (!authInstance) {
    authInstance = createAuthInstance();
  }
  return authInstance;
}
