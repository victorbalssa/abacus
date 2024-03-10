import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { useAuthRequest } from 'expo-auth-session';
import { Alert, Keyboard } from 'react-native';

import OauthForm from '../Forms/OauthForm';
import {
  discovery,
  redirectUri,
  addCredential,
} from '../../lib/oauth';
import { RootDispatch } from '../../store';
import { OauthConfigType, ScreenType } from '../../types/screen';

import translate from '../../i18n/locale';
import { TCredential } from '../../types/credential';

export default function CredentialCreateScreen({ navigation }: ScreenType) {
  const dispatch = useDispatch<RootDispatch>();

  const [config, setConfig] = useState<OauthConfigType>({
    backendURL: 'https://',
    oauthClientId: '',
    oauthClientSecret: '',
    personalAccessToken: '',
  });

  const {
    backendURL,
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

  useEffect(() => {
    (async () => {
      if (result?.type === 'success') {
        try {
          const { code } = result.params;

          const payload = {
            backendURL,
            oauthClientId,
            oauthClientSecret,
            codeVerifier: request.codeVerifier,
            code,
          };
          Keyboard.dismiss();

          await dispatch.firefly.getNewAccessToken(payload);

          navigation.goBack();
        } catch (e) {
          Alert.alert(
            translate('oauth_token_error_title'),
            `${translate('oauth_token_error_description')}. Error: ${e.message}`,
          );
        }
      }
    })();
  }, [result]);

  const tokenLogin = async () => {
    try {
      // test personal token and get user email
      axios.defaults.headers.Authorization = `Bearer ${config.personalAccessToken}`;
      dispatch.configuration.setBackendURL(backendURL);
      const email = await dispatch.configuration.getCurrentUserEmail();

      // save new credential
      const credential: TCredential = {
        email,
        backendURL,
        accessToken: config.personalAccessToken,
      };
      await addCredential(credential);

      navigation.goBack();
    } catch (e) {
      Alert.alert(
        translate('oauth_token_error_title'),
        `${translate('oauth_wrong_token_error_description')} Error: ${e.message}`,
      );
    }
  };

  return (
    <OauthForm
      config={config}
      setConfig={setConfig}
      oauthLogin={() => promptAsync()}
      tokenLogin={tokenLogin}
    />
  );
}
