import React, { useState } from 'react';
import {
  Input,
  FormControl,
  Button,
  Switch,
} from 'native-base';
import {
  KeyboardAvoidingView,
  Platform,
  Alert,
  ScrollView,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import * as Clipboard from 'expo-clipboard';
import { Ionicons } from '@expo/vector-icons';
import * as Linking from 'expo-linking';

import { useSelector } from 'react-redux';
import { isValidHttpUrl, useThemeColors } from '../../lib/common';
import translate from '../../i18n/locale';
import { RootState } from '../../store';
import {
  APressable, AStack, AText, AView,
} from '../UI/ALibrary';

const copyToClipboard = async () => {
  await Clipboard.setStringAsync('abacusfiiiapp://redirect');
  Alert.alert('abacusfiiiapp://redirect copied to clipboard');
};

export default function OauthForm({
  config,
  setConfig,
  oauthLogin,
  tokenLogin,
  useBiometricAuth = false,
  biometricCheck = () => {},
}) {
  const { colors } = useThemeColors();
  const loading = useSelector((state: RootState) => state.loading.effects.firefly.getNewAccessToken?.loading);
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
      <ScrollView
        testID="auth_scroll_view"
        keyboardShouldPersistTaps="handled"
        bounces={false}
      >
        <AStack px={20} style={{ marginTop: Platform.OS === 'ios' ? 10 : 20 }}>
          <FormControl isRequired>
            <FormControl.Label testID="auth_form_url_label">{translate('auth_form_url_label')}</FormControl.Label>
            <Input
              returnKeyType="done"
              placeholder={translate('auth_form_url_placeholder')}
              keyboardType="url"
              value={config.backendURL}
              onChangeText={(v) => setConfig({
                ...config,
                backendURL: v,
              })}
              testID="auth_form_url_input"
            />
            <FormControl.HelperText>
              {translate('auth_form_url_help')}
            </FormControl.HelperText>
          </FormControl>

          <AText py={10} fontSize={13}>{translate('auth_external_heads_up')}</AText>

          <AStack row py={10} alignItems="center" justifyContent="space-between">
            <AText fontSize={12}>{translate('auth_use_personal_access_token')}</AText>
            <Switch testID="toggle_is_oauth" isChecked={!isOauth} onToggle={toggleIsOauth} colorScheme="primary" />
          </AStack>

          {isOauth && (
          <AStack py={10} alignItems="flex-start" justifyContent="flex-start">
            <AText fontSize={13}>
              ‣
              {' '}
              {translate('auth_create_new_oauth_client')}
              {' '}
              <AText fontSize={13} lineHeight={20} onPress={() => Linking.openURL(`${config.backendURL}/profile`)} underline>
                {`${isValidHttpUrl(config.backendURL) ? config.backendURL : '[Firefly III URL]'}/profile`}
              </AText>
            </AText>
            <AStack row py={10} alignItems="flex-start" justifyContent="flex-start">
              <AText fontSize={13}>
                ‣
                {' '}
                {translate('auth_form_set_redirect')}
              </AText>

              <APressable
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: colors.brandStyle,
                  borderRadius: 5,
                  marginLeft: 10,
                  paddingRight: 3,
                }}
                onPress={copyToClipboard}
              >
                <Ionicons name="copy" size={10} color="white" style={{ margin: 5 }} />
                <AText fontSize={13} fontFamily="Montserrat_Bold" color="white">abacusfiiiapp://redirect</AText>
              </APressable>
            </AStack>
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
          </AStack>
          )}

          {!isOauth && (
            <AStack py={10} alignItems="flex-start" justifyContent="flex-start">
              <AText fontSize={13} onPress={() => Linking.openURL(`${config.backendURL}/profile`)}>
                ‣
                {' '}
                {translate('auth_create_new_personal_access_token')}
                {' '}
                <AText fontSize={13} onPress={() => Linking.openURL(`${config.backendURL}/profile`)} underline>
                  {isValidHttpUrl(config.backendURL) ? config.backendURL : '[Firefly III URL]'}
                  /profile
                </AText>
              </AText>
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
            </AStack>
          )}

          <AView
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              padding: 15,
            }}
          >
            <AText fontSize={13} onPress={() => Linking.openURL('https://github.com/victorbalssa/abacus/blob/master/.github/HELP.md')} underline>{translate('auth_form_need_help')}</AText>
          </AView>

          <AView style={{ width: '100%' }}>
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
              isDisabled={!isValidHttpUrl(config.backendURL) || !isMinimumRequirement()}
              isLoading={loading}
              isLoadingText={translate('auth_form_submit_button_loading')}
              onPress={handleLogin}
              testID="auth_form_submit_button_initial"
            >
              {translate('auth_form_submit_button_initial')}
            </Button>
            {useBiometricAuth && (
            <Button
              leftIcon={<Ionicons name="lock-open" size={16} color="white" />}
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
              onPress={() => biometricCheck()}
            >
              {translate('auth_form_biometrics_lock')}
            </Button>
            )}
          </AView>
        </AStack>
        <AView style={{ height: 170 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
