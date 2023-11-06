import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
import { useAuthRequest } from 'expo-auth-session';
import { CommonActions } from '@react-navigation/native';
import { useToast } from 'native-base';
import { Keyboard } from 'react-native';

import * as LocalAuthentication from 'expo-local-authentication';
import OauthForm from '../Forms/OauthForm';
import secureKeys from '../../constants/oauth';
import { discovery, redirectUri } from '../../lib/oauth';
import { RootState, RootDispatch } from '../../store';
import { OauthConfigType, ScreenType } from './types';
import ToastAlert from '../UI/ToastAlert';

import translate from '../../i18n/locale';

export default function OauthScreen({ navigation }: ScreenType) {
  const toast = useToast();
  const loading = useSelector((state: RootState) => state.loading.effects.firefly.getNewAccessToken?.loading);
  const configuration = useSelector((state: RootState) => state.configuration);
  const dispatch = useDispatch<RootDispatch>();

  const {
    backendURL,
    faceId,
  } = configuration;

  const [config, setConfig] = useState<OauthConfigType>({
    oauthClientId: '',
    oauthClientSecret: '',
    personalAccessToken: '',
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
          await faceIdCheck();
        } catch (e) {
          toast.show({
            render: ({ id }) => (
              <ToastAlert
                onClose={() => toast.close(id)}
                title={translate('oauth_token_error_title')}
                status="error"
                variant="solid"
                description={`${translate('oauth_token_error_description')}, ${e.message}`}
              />
            ),
          });
        }
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if (result?.type === 'cancel') {
        toast.show({
          render: ({ id }) => (
            <ToastAlert
              onClose={() => toast.close(id)}
              title={translate('oauth_token_info_title')}
              status="info"
              variant="solid"
              description={translate('oauth_token_info_description')}
            />
          ),
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

          toast.show({
            render: ({ id }) => (
              <ToastAlert
                onClose={() => toast.close(id)}
                title={translate('oauth_token_success_title')}
                status="success"
                variant="solid"
                description={translate('oauth_token_success_description')}
              />
            ),
          });
          goToHome();
        } catch (e) {
          await toast.show({
            render: ({ id }) => (
              <ToastAlert
                onClose={() => toast.close(id)}
                title={translate('oauth_token_error_title')}
                status="error"
                variant="solid"
                description={`${translate('oauth_token_error_description')}, ${e.message}`}
              />
            ),
          });
        }
      }
    })();
  }, [result]);

  const tokenLogin = async () => {
    try {
      axios.defaults.headers.Authorization = `Bearer ${config.personalAccessToken}`;

      // test personal token
      await axios.get(`${backendURL}/api/v1/about/user`);

      const storageValue = JSON.stringify({
        accessToken: config.personalAccessToken,
      });
      await SecureStore.setItemAsync(secureKeys.tokens, storageValue);

      toast.show({
        render: ({ id }) => (
          <ToastAlert
            onClose={() => toast.close(id)}
            title={translate('oauth_token_success_title')}
            status="success"
            variant="solid"
            description={translate('oauth_token_success_description')}
          />
        ),
      });
      goToHome();
    } catch (_) {
      toast.show({
        render: ({ id }) => (
          <ToastAlert
            onClose={() => toast.close(id)}
            title={translate('oauth_token_error_title')}
            status="error"
            variant="solid"
            description={`${translate('oauth_wrong_token_error_description')}`}
          />
        ),
      });
    }
  };

  return (
    <OauthForm
      config={config}
      loading={loading}
      faceId={faceId}
      backendURL={backendURL}
      faceIdCheck={faceIdCheck}
      setConfig={setConfig}
      oauthLogin={() => promptAsync()}
      tokenLogin={tokenLogin}
      setBackendURL={dispatch.configuration.setBackendURL}
    />
  );
}
