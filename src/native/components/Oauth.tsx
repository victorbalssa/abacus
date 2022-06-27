import React from 'react';
import { Input, Box, FormControl } from 'native-base';
import { KeyboardAvoidingView } from 'react-native';

import { AuthRequestPromptOptions } from 'expo-auth-session/src/AuthRequest.types';
import { AuthSessionResult } from 'expo-auth-session/src/AuthSession.types';
import { Dispatch } from 'redux';
import UIButton from './UI/UIButton';
import { isValidHttpUrl } from '../../lib/common';
import { OauthConfig } from '../../containers/Oauth';

interface ConfigurationComponent {
  loading: boolean
  config: OauthConfig
  setConfig: Dispatch<OauthConfig>
  promptAsync: (options?: AuthRequestPromptOptions) => Promise<AuthSessionResult>
  backendURL: string
  setBackendURL: (state: string) => Promise<null>
}

const Configuration = ({
  loading,
  config,
  setConfig,
  promptAsync,
  backendURL,
  setBackendURL,
}: ConfigurationComponent) => (
  <KeyboardAvoidingView
    h={{
      base: '400px',
      lg: 'auto',
    }}
    behavior="padding"
  >
    <Box alignItems="center" marginTop={60}>
      <Box w="90%" maxWidth="300px">
        <FormControl isRequired>
          <FormControl.Label>FireFlyIII backend URL</FormControl.Label>
          <Input
            placeholder="FireFly3 backend URL (without '/' at the end)"
            keyboardType="url"
            value={backendURL}
            onChangeText={setBackendURL}
          />
          <FormControl.HelperText>
            Without '/' at the end.
          </FormControl.HelperText>
        </FormControl>
        <FormControl isRequired>
          <FormControl.Label>Oauth Client ID</FormControl.Label>
          <Input
            keyboardType="numeric"
            placeholder="Oauth Client ID"
            value={config.oauthClientId}
            onChangeText={(v) => setConfig({
              ...config,
              oauthClientId: v,
            })}
          />
        </FormControl>
        <FormControl isRequired>
          <FormControl.Label>Oauth Client Secret</FormControl.Label>
          <Input
            type="password"
            placeholder="Oauth Client Secret"
            value={config.oauthClientSecret}
            onChangeText={(v) => setConfig({
              ...config,
              oauthClientSecret: v,
            })}
          />
          <FormControl.HelperText>
            All secrets are kept in iOS secure storage.
          </FormControl.HelperText>
          <FormControl.HelperText>
            Redirect URI: abacusiosapp://redirect.
          </FormControl.HelperText>
        </FormControl>

        <UIButton
          text="Sign In"
          loading={loading}
          disabled={!isValidHttpUrl(backendURL)}
          onPress={() => promptAsync()}
        />
      </Box>
    </Box>
  </KeyboardAvoidingView>
);

export default Configuration;
