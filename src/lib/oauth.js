import { makeRedirectUri } from 'expo-auth-session';

export const discovery = (url) => ({
  authorizationEndpoint: `${url}/oauth/authorize`,
  tokenEndpoint: `${url}/oauth/token`,
});

export const redirectUri = makeRedirectUri({
  useProxy: false,
  path: 'redirect',
});
