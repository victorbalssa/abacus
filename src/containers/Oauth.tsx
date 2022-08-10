import React, { useState, useEffect, FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
import { useAuthRequest, TokenResponse } from 'expo-auth-session';
import { CommonActions } from '@react-navigation/native';
import { useToast } from 'native-base';
import { Keyboard } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';

import Layout from '../components/Oauth';
import secureKeys from '../constants/oauth';
import { discovery, redirectUri } from '../lib/oauth';
import { RootState, RootDispatch } from '../store';
import { ContainerPropType, OauthConfigType } from './types';

const OauthContainer: FC = ({ navigation }: ContainerPropType) => {
  const toast = useToast();
  const loading = useSelector((state: RootState) => state.loading.models.firefly);
  const configuration = useSelector((state: RootState) => state.configuration);
  const dispatch = useDispatch<RootDispatch>();

  const {
    backendURL,
    faceId,
  } = configuration;

  const [config, setConfig] = useState<OauthConfigType>({
    oauthClientId: '',
    oauthClientSecret: '',
  });

  const {
    oauthClientId,
    oauthClientSecret,
  } = config;

  const [request, result, promptAsync] = useAuthRequest(
    {
      clientId: oauthClientId,
      clientSecret: oauthClientSecret,
      redirectUri,
    },
    discovery(backendURL),
  );

  const goToHome = () => navigation.dispatch(
    CommonActions.reset({
      index: 0,
      routes: [
        { name: 'dashboard' },
      ],
    }),
  );

  const faceIdCheck = async () => {
    if (faceId) {
      const bioAuth = await LocalAuthentication.authenticateAsync();
      if (bioAuth.success) {
        goToHome();
      }
    } else {
      goToHome();
    }
  };

  useEffect(() => {
    (async () => {
      const tokens = await SecureStore.getItemAsync(secureKeys.tokens);
      const storageValue = JSON.parse(tokens);
      if (storageValue && storageValue.accessToken && backendURL) {
        axios.defaults.headers.Authorization = `Bearer ${storageValue.accessToken}`;

        try {
          if (!TokenResponse.isTokenFresh(storageValue)) {
            await dispatch.firefly.getFreshAccessToken(storageValue.refreshToken);
          }

          await faceIdCheck();
        } catch (e) {
          toast.show({
            placement: 'top',
            title: 'Error',
            description: e.message,
          });
        }
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if (result?.type === 'cancel') {
        toast.show({
          placement: 'top',
          title: 'Info',
          description: 'Authentication cancel, check Client ID & backend URL.',
        });
      }
      if (result?.type === 'success') {
        try {
          const { code } = result.params;

          const payload = {
            oauthClientId,
            oauthClientSecret,
            codeVerifier: request.codeVerifier,
            code,
          };
          Keyboard.dismiss();

          await dispatch.firefly.getNewAccessToken(payload);
          await dispatch.firefly.testAccessToken();

          toast.show({
            placement: 'top',
            title: 'Success',
            description: 'Secure connexion ready with your Firefly III instance.',
          });
          await faceIdCheck();
        } catch (e) {
          toast.show({
            placement: 'top',
            title: 'Something went wrong',
            description: `Failed to get accessToken, ${e.message}`,
          });
        }
      }
    })();
  }, [result]);

  return (
    <Layout
      config={config}
      loading={loading}
      faceId={faceId}
      backendURL={backendURL}
      faceIdCheck={faceIdCheck}
      setConfig={setConfig}
      promptAsync={promptAsync}
      setBackendURL={dispatch.configuration.setBackendURL}
    />
  );
};

export default OauthContainer;
