import React from 'react';
import PropTypes from 'prop-types';
import { AuthRequest } from 'expo-auth-session';
import {
  Input, Box, FormControl,
} from 'native-base';

import { KeyboardAvoidingView } from 'react-native';
import UIButton from './UI/UIButton';
import { isValidHttpUrl } from '../../lib/common';

const Configuration = ({
  loading,
  config,
  setConfig,
  navigation,
  promptAsync,
  backendURL,
  setBackendURL,
}) => (
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
          <FormControl.Label>FireFly3 backend URL</FormControl.Label>
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
            Oauth Client Secret (not persisted).
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

Configuration.propTypes = {
  loading: PropTypes.bool.isRequired,
};

Configuration.defaultProps = {};

export default Configuration;
