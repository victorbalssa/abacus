import React, { Dispatch } from 'react';
import {
  Input, Box, FormControl, Button,
} from 'native-base';
import { KeyboardAvoidingView } from 'react-native';
import * as Haptics from 'expo-haptics';

import { isValidHttpUrl } from '../../lib/common';
import { OauthConfig } from '../../containers/Oauth';

interface ConfigurationComponent {
  loading: boolean
  config: OauthConfig
  setConfig: Dispatch<OauthConfig>
  promptAsync: () => Promise<void>
  backendURL: string
  setBackendURL: (state: string) => Promise<void>
}

const Configuration = ({
  loading,
  config,
  setConfig,
  promptAsync,
  backendURL,
  setBackendURL,
}: ConfigurationComponent) => (
  <KeyboardAvoidingView behavior="padding">
    <Box p={5} safeAreaTop>
      <FormControl isRequired>
        <FormControl.Label>FireflyIII backend URL</FormControl.Label>
        <Input
          returnKeyType="done"
          placeholder="FireflyIII backend URL (without '/' at the end)"
          keyboardType="url"
          value={backendURL}
          onChangeText={setBackendURL}
        />
        <FormControl.HelperText>
          without '/' at the end.
        </FormControl.HelperText>
      </FormControl>
      <FormControl isRequired>
        <FormControl.Label>Oauth Client ID</FormControl.Label>
        <Input
          keyboardType="numeric"
          returnKeyType="done"
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
          returnKeyType="done"
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
        <FormControl.HelperText _text={{ fontSize: 15, color: 'primary.200' }}>
          Redirect URI must be equal to: `abacusiosapp://redirect`
        </FormControl.HelperText>
      </FormControl>

      <Button
        mt="2"
        shadow={2}
        borderRadius={15}
        onTouchStart={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
        _pressed={{
          style: {
            transform: [{
              scale: 0.99,
            }],
          },
        }}
        _loading={{
          bg: 'primary.50',
          _text: {
            color: 'white',
          },
          alignItems: 'flex-start',
          opacity: 1,
        }}
        _spinner={{
          color: 'white',
          size: 10,
        }}
        colorScheme="primary"
        isDisabled={!isValidHttpUrl(backendURL) || config.oauthClientId === ''}
        isLoading={loading}
        isLoadingText="Submitting..."
        onPress={() => promptAsync()}
      >
        Sign In
      </Button>
    </Box>
  </KeyboardAvoidingView>
);

export default Configuration;
