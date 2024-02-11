import { makeRedirectUri } from 'expo-auth-session';
import * as SecureStore from 'expo-secure-store';
import _ from 'lodash';
import credentialKey from '../constants/credentialKey';
import { TCredential } from '../types/credential';

export const discovery = (url: string) => ({
  authorizationEndpoint: `${url}/oauth/authorize`,
  tokenEndpoint: `${url}/oauth/token`,
});

export const redirectUri = makeRedirectUri({
  path: 'redirect',
});

export const isTokenFresh = (expiresIn: string): boolean => {
  if (expiresIn && parseInt(expiresIn, 10) > 0) {
    const now = Math.floor(Date.now() / 1000);
    return now < parseInt(expiresIn, 10);
  }
  // if there is no expiration time, it is assumed to never expire.
  return true;
};

export const getCredentials = async () => {
  const jsonCredentials = await SecureStore.getItemAsync(credentialKey);
  const credentials: TCredential[] = JSON.parse(jsonCredentials);

  if (_.isEmpty(credentials)) {
    return [];
  }

  return credentials;
};

const setCredentials = async (credentials: TCredential[]) => {
  const jsonCredentials = JSON.stringify(credentials);
  await SecureStore.setItemAsync(credentialKey, jsonCredentials);
};

export const addCredential = async (credential: TCredential) => {
  const credentials = await getCredentials();
  const newCredentials = [...credentials, credential];
  await setCredentials(newCredentials);
};

export const deleteCredential = async (index: number) => {
  const credentials = await getCredentials();
  const newCredentials = [...credentials];
  newCredentials.splice(index, 1);
  await setCredentials(newCredentials);
};

export const deleteAccessToken = async (index: number) => {
  const credentials = await getCredentials();
  const newCredentials = [...credentials];
  newCredentials[index].accessToken = '';
  await setCredentials(newCredentials);
};
