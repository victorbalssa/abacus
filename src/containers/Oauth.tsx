import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import * as Updates from 'expo-updates';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
import { useAuthRequest, TokenResponse } from 'expo-auth-session';
import { CommonActions } from '@react-navigation/native';
import { useToast } from 'native-base';
import { Keyboard } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import Layout from '../native/components/Oauth';
import secureKeys from '../constants/oauth';
import { discovery, redirectUri } from '../lib/oauth';
import { RootState, Dispatch } from '../store';

const mapStateToProps = (state: RootState) => ({
  backendURL: state.configuration.backendURL,
  faceId: state.configuration.faceId,
  loading: state.loading.models.firefly,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  setBackendURL: dispatch.configuration.setBackendURL,
  testAccessToken: dispatch.firefly.testAccessToken,
  getFreshAccessToken: dispatch.firefly.getFreshAccessToken,
  getNewAccessToken: dispatch.firefly.getNewAccessToken,
});

interface OauthContainerType extends
  ReturnType<typeof mapStateToProps>,
  ReturnType<typeof mapDispatchToProps> {
  navigation: { dispatch: (action) => void },
  loading: boolean,
  backendURL: string,
}

export type OauthConfig = {
  oauthClientId: string,
  oauthClientSecret: string,
}

const OauthContainer = ({
  loading,
  faceId,
  navigation,
  backendURL,
  setBackendURL,
  testAccessToken,
  getNewAccessToken,
  getFreshAccessToken,
}: OauthContainerType) => {
  const toast = useToast();
  const [isOTAOpen, setOTAOpen] = React.useState(false);
  const onOTAClose = () => setOTAOpen(false);

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
      if (storageValue && storageValue.accessToken) {
        axios.defaults.headers.Authorization = `Bearer ${storageValue.accessToken}`;

        try {
          if (!TokenResponse.isTokenFresh(storageValue)) {
            await getFreshAccessToken(storageValue.refreshToken);
          }

          await faceIdCheck();
        } catch (e) {
          toast.show({
            placement: 'top',
            title: 'Error',
            status: 'error',
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
            description: 'Secure connexion ready with your FireflyIII instance.',
          });
          await faceIdCheck();
        } catch (e) {
          toast.show({
            placement: 'top',
            title: 'Something went wrong',
            status: 'error',
            description: `Failed to get accessToken, ${e.message}`,
          });
        }
      }
    })();
  }, [result]);

  return (
    <Layout
      loading={loading}
      faceId={faceId}
      faceIdCheck={faceIdCheck}
      config={config}
      setConfig={setConfig}
      promptAsync={async () => {
        await promptAsync();
      }}
      backendURL={backendURL}
      setBackendURL={async (value) => {
        await setBackendURL(value);
      }}
    />
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(OauthContainer);
