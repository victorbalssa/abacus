import React, { useState, useEffect } from 'react';

import { connect } from 'react-redux';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
import {
  useAuthRequest, TokenResponse,
} from 'expo-auth-session';
import { CommonActions } from '@react-navigation/native';
import { useToast } from 'native-base';
import { Keyboard } from 'react-native';
import Layout from '../native/components/Oauth';
import secureKeys from '../constants/oauth';
import { discovery, redirectUri } from '../lib/oauth';

const mapStateToProps = (state) => ({
  backendURL: state.configuration.backendURL,
  loading: state.loading.models.firefly,
});

const mapDispatchToProps = (dispatch) => ({
  setBackendURL: dispatch.configuration.setBackendURL,
  testAccessToken: dispatch.firefly.testAccessToken,
  getFreshAccessToken: dispatch.firefly.getFreshAccessToken,
  getNewAccessToken: dispatch.firefly.getNewAccessToken,
});

interface ConfigurationContainer extends
  ReturnType<typeof mapStateToProps>,
  ReturnType<typeof mapDispatchToProps> {
  navigation: object,
  loading: boolean,
  backendURL: string,
}

export type OauthConfig = {
  oauthClientId: string,
  oauthClientSecret: string,
}

const Configuration = ({
  loading,
  navigation,
  backendURL,
  setBackendURL,
  testAccessToken,
  getNewAccessToken,
  getFreshAccessToken,
}: ConfigurationContainer) => {
  const toast = useToast();

  const [config, setConfig] = useState<OauthConfig>({
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

  const goToDashboard = () => navigation.dispatch(
    CommonActions.reset({
      index: 0,
      routes: [
        { name: 'dashboard' },
      ],
    }),
  );

  useEffect(async () => {
    const tokens = await SecureStore.getItemAsync(secureKeys.tokens);
    const storageValue = JSON.parse(tokens);
    if (storageValue && storageValue.accessToken) {
      axios.defaults.headers.Authorization = `Bearer ${storageValue.accessToken}`;

      try {
        if (!TokenResponse.isTokenFresh(storageValue)) {
          await getFreshAccessToken(storageValue.refreshToken);
        }

        await testAccessToken();

        goToDashboard();
      } catch (e) {
        toast.show({
          placement: 'top',
          title: 'Error',
          status: 'error',
          description: e.message,
        });
      }
    }
  }, []);

  useEffect(async () => {
    if (result?.type === 'cancel') {
      toast.show({
        placement: 'top',
        title: 'Info',
        status: 'info',
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

        await getNewAccessToken(payload);
        await testAccessToken();

        toast.show({
          placement: 'top',
          title: 'Success',
          status: 'success',
          description: 'Secure connexion ready with your FireFlyIII instance.',
        });
        goToDashboard();
      } catch (e) {
        toast.show({
          placement: 'top',
          title: 'Something went wrong',
          status: 'error',
          description: `Failed to get accessToken, ${e.message}`,
        });
      }
    }
  }, [result]);

  return (
    <Layout
      navigation={navigation}
      loading={loading}
      config={config}
      setConfig={setConfig}
      promptAsync={promptAsync}
      backendURL={backendURL}
      setBackendURL={setBackendURL}
    />
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Configuration);
