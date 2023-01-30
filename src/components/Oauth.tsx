import React from 'react';
import {
  Input,
  Box,
  FormControl,
  Button,
  HStack,
  Text,
  Pressable,
} from 'native-base';
import { Alert, KeyboardAvoidingView } from 'react-native';
import * as Haptics from 'expo-haptics';
import * as Clipboard from 'expo-clipboard';

import { Ionicons } from '@expo/vector-icons';
import * as Linking from 'expo-linking';
import { isValidHttpUrl } from '../lib/common';
import { translate } from '../i18n/locale';

const copyToClipboard = async () => {
  await Clipboard.setStringAsync('abacusiosapp://redirect');
  Alert.alert('\'abacusiosapp://redirect\' copied to clipboard');
};

const Oauth = ({
  loading,
  faceId,
  faceIdCheck,
  config,
  setConfig,
  promptAsync,
  backendURL,
  setBackendURL,
}) => (
  <KeyboardAvoidingView behavior="padding">
    <Box p={5} safeAreaTop>
      <FormControl isRequired>
        <FormControl.Label>{translate('OAUTH_fireflyInstanceMainLabel')}</FormControl.Label>
        <Input
          returnKeyType="done"
          placeholder={translate('OAUTH_fireflyPlaceholder')}
          keyboardType="url"
          value={backendURL}
          onChangeText={setBackendURL}
        />
        <FormControl.HelperText>
          {translate('OAUTH_fireflyInstanceHelpLabel')}
        </FormControl.HelperText>
      </FormControl>
      <FormControl isRequired>
        <FormControl.Label>{translate('OAUTH_oauth_clientId')}</FormControl.Label>
        <Input
          keyboardType="numeric"
          returnKeyType="done"
          placeholder={translate('OAUTH_oauth_clientId')}
          value={config.oauthClientId}
          onChangeText={(v) => setConfig({
            ...config,
            oauthClientId: v,
          })}
        />
      </FormControl>
      <FormControl>
        <FormControl.Label>{translate('OAUTH_oauth_client_secret')}</FormControl.Label>
        <Input
          returnKeyType="done"
          type="password"
          placeholder={translate('OAUTH_oauth_client_secret')}
          value={config.oauthClientSecret}
          onChangeText={(v) => setConfig({
            ...config,
            oauthClientSecret: v,
          })}
        />
        <FormControl.HelperText>
          {translate('OAUTH_secrets_help_message')}
        </FormControl.HelperText>
      </FormControl>

      <HStack>
        <Text py={1} pr={1} fontSize={14} color="primary.200">
          🔥
          {' '}
          {translate('OAUTH_set_redirect')}
        </Text>

        <Pressable flexDirection="row" justifyContent="center" alignItems="center" onPress={copyToClipboard} backgroundColor="primary.200" borderRadius={15} py={1} px={1}>
          <Ionicons name="copy" size={10} color="white" style={{ margin: 5 }} />
          <Text fontFamily="Montserrat_Bold" color="white" mr={1}>abacusiosapp://redirect</Text>
        </Pressable>
      </HStack>
      <Pressable mx={3} my={3} minH={45} alignItems="center" justifyContent="flex-end">
        <Text onPress={() => Linking.openURL('https://github.com/victorbalssa/abacus/blob/master/.github/HELP.md')} underline>{translate('OAUTH_need_help')}</Text>
      </Pressable>

      <Button
        leftIcon={<Ionicons name="log-in-outline" size={20} color="white" />}
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
        isDisabled={!isValidHttpUrl(backendURL)}
        isLoading={loading}
        isLoadingText={translate('OAUTH_submit_button_loading')}
        onPress={() => promptAsync()}
      >
        {translate('OAUTH_submit_button_initial')}
      </Button>
      {faceId && (
        <Button
          leftIcon={<Ionicons name="ios-lock-open" size={16} color="white" />}
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
          colorScheme="coolGray"
          isLoading={loading}
          onPress={() => faceIdCheck()}
        >
          {translate('OAUTH_faceID')}
        </Button>
      )}
    </Box>
  </KeyboardAvoidingView>
);

export default Oauth;
