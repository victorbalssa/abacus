import React, { useState } from 'react';
import {
  Input,
  Box,
  FormControl,
  Button,
  HStack,
  Stack,
  Text,
  Switch,
  ScrollView,
} from 'native-base';
import {
  View,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import * as Clipboard from 'expo-clipboard';
import { Ionicons } from '@expo/vector-icons';
import * as Linking from 'expo-linking';

import { isValidHttpUrl, useThemeColors } from '../../lib/common';
import translate from '../../i18n/locale';

const copyToClipboard = async () => {
  await Clipboard.setStringAsync('abacusfiiiapp://redirect');
  Alert.alert('abacusfiiiapp://redirect copied to clipboard');
};

export default function OauthForm({
  loading,
  faceId,
  faceIdCheck,
  config,
  setConfig,
  oauthLogin,
  tokenLogin,
  backendURL,
  setBackendURL,
}) {
  const { colors } = useThemeColors();
  const [isOauth, setIsAuth] = useState<boolean>(true);
  const toggleIsOauth = () => setIsAuth((value) => !value);
  const isMinimumRequirement = () => {
    if (isOauth && config.oauthClientId) {
      return true;
    }

    if (!isOauth && config.personalAccessToken) {
      return true;
    }

    return false;
  };

  const handleLogin = async () => {
    if (isOauth) {
      oauthLogin();
    } else {
      await tokenLogin();
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.select({ ios: 'padding', android: 'height' })}
    >
      <ScrollView testID="auth_scroll_view" keyboardShouldPersistTaps="handled">
        <Box p={5} safeAreaTop>
          <FormControl isRequired>
            <FormControl.Label testID="auth_form_url_label">{translate('auth_form_url_label')}</FormControl.Label>
            <Input
              returnKeyType="done"
              placeholder={translate('auth_form_url_placeholder')}
              keyboardType="url"
              value={backendURL}
              onChangeText={setBackendURL}
              testID="auth_form_url_input"
            />
            <FormControl.HelperText>
              {translate('auth_form_url_help')}
            </FormControl.HelperText>
          </FormControl>

          <Text fontSize={12} pt={3}>{translate('auth_external_heads_up')}</Text>

          <Stack py={2}>
            <HStack py={2} minH={45} alignItems="center" justifyContent="space-between">
              <Text fontSize={12}>{translate('auth_use_personal_access_token')}</Text>
              <Switch testID="toggle_is_oauth" isChecked={!isOauth} onToggle={toggleIsOauth} colorScheme="primary" />
            </HStack>
          </Stack>

          {isOauth && (
          <>
            <HStack flexWrap="wrap">
              <Text fontSize={13} lineHeight={20}>
                ‣
                {' '}
                {translate('auth_create_new_oauth_client')}
                {' '}
                <Text fontSize={13} lineHeight={20} onPress={() => Linking.openURL(`${backendURL}/profile`)} underline>
                  {`${isValidHttpUrl(backendURL) ? backendURL : '[Firefly III URL]'}/profile`}
                </Text>
              </Text>
            </HStack>
            <HStack flexWrap="wrap" py={2}>
              <Text py={1} pr={1} fontSize={13}>
                ‣
                {' '}
                {translate('auth_form_set_redirect')}
              </Text>

              <Pressable
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: colors.brandStyle,
                  borderRadius: 10,
                  padding: 0,
                }}
                onPress={copyToClipboard}
              >
                <Ionicons name="copy" size={10} color="white" style={{ margin: 5 }} />
                <Text fontSize={13} fontFamily="Montserrat_Bold" color="white" mr={1}>abacusfiiiapp://redirect</Text>
              </Pressable>
            </HStack>
            <FormControl isRequired>
              <FormControl.Label>{translate('auth_form_oauth_clientId')}</FormControl.Label>
              <Input
                keyboardType="numeric"
                returnKeyType="done"
                placeholder={translate('auth_form_oauth_clientId')}
                value={config.oauthClientId}
                onChangeText={(v) => setConfig({
                  ...config,
                  oauthClientId: v,
                })}
              />
            </FormControl>
            <FormControl>
              <FormControl.Label>{translate('auth_form_oauth_client_secret')}</FormControl.Label>
              <Input
                returnKeyType="done"
                type="password"
                placeholder={translate('auth_form_oauth_client_secret')}
                value={config.oauthClientSecret}
                onChangeText={(v) => setConfig({
                  ...config,
                  oauthClientSecret: v,
                })}
              />
              <FormControl.HelperText>
                {translate('auth_form_secrets_help_message')}
              </FormControl.HelperText>
            </FormControl>
          </>
          )}

          {!isOauth && (
          <>
            <Text fontSize={13} lineHeight={20} onPress={() => Linking.openURL(`${backendURL}/profile`)}>
              ‣
              {' '}
              {translate('auth_create_new_personal_access_token')}
              {' '}
              <Text fontSize={13} lineHeight={20} onPress={() => Linking.openURL(`${backendURL}/profile`)} underline>
                {isValidHttpUrl(backendURL) ? backendURL : '[Firefly III URL]'}
                /profile
              </Text>
            </Text>
            <FormControl isRequired py={3}>
              <FormControl.Label testID="auth_form_personal_access_token_label">{translate('auth_form_personal_access_token_label')}</FormControl.Label>
              <Input
                returnKeyType="done"
                type="password"
                placeholder={translate('auth_form_personal_access_token_label')}
                value={config.personalAccessToken}
                onChangeText={(v) => setConfig({
                  ...config,
                  personalAccessToken: v,
                })}
                testID="auth_form_personal_access_token_input"
              />
              <FormControl.HelperText>
                {translate('auth_form_secrets_help_message')}
              </FormControl.HelperText>
            </FormControl>
          </>
          )}

          <Pressable
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              padding: 15,
            }}
          >
            <Text fontSize={12} onPress={() => Linking.openURL('https://github.com/victorbalssa/abacus/blob/master/.github/HELP.md')} underline>{translate('auth_form_need_help')}</Text>
          </Pressable>

          <Button
            leftIcon={<Ionicons name="log-in-outline" size={20} color="white" />}
            mt="2"
            shadow={2}
            onPressOut={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
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
            isDisabled={!isValidHttpUrl(backendURL) || !isMinimumRequirement()}
            isLoading={loading}
            isLoadingText={translate('auth_form_submit_button_loading')}
            onPress={handleLogin}
            testID="auth_form_submit_button_initial"
          >
            {translate('auth_form_submit_button_initial')}
          </Button>
          {faceId && (
          <Button
            leftIcon={<Ionicons name="ios-lock-open" size={16} color="white" />}
            mt="2"
            shadow={2}
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
            {translate('auth_form_biometrics_lock')}
          </Button>
          )}
        </Box>
        <View style={{ height: 170 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
