import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Alert,
  ScrollView,
  Switch,
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
  AFormView,
  AInput,
  ALabel,
  APressable,
  AStack,
  AStackFlex,
  AText,
  AView,
  AButton,
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

  const setDemoCredentials = async () => {
    setConfig({
      ...config,
      backendURL: 'https://demo.firefly-iii.org',
      oauthClientId: '4',
    });
  };

  const handleLogin = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch();
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
        style={{
          padding: 15,
        }}
        keyboardShouldPersistTaps="handled"
        bounces={false}
      >
        <AStack
          justifyContent="flex-start"
          style={{ marginTop: Platform.OS === 'ios' ? 10 : 20 }}
        >
          <AFormView mx={0}>
            <ALabel testID="auth_form_url_label" isRequired>{translate('auth_form_url_label')}</ALabel>
            <AInput
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
            <AText py={5} px={2} fontSize={11}>
              {translate('auth_form_url_help')}
            </AText>
          </AFormView>

          <AText py={10} px={0.2} fontSize={13}>{translate('auth_external_heads_up')}</AText>

          <AStackFlex row py={10} alignItems="center" justifyContent="space-between">
            <AText fontSize={12}>{translate('auth_use_personal_access_token')}</AText>
            <Switch testID="toggle_is_oauth" thumbColor="white" trackColor={{ false: '#767577', true: colors.brandStyle }} onValueChange={() => toggleIsOauth()} value={!isOauth} />
          </AStackFlex>

          {isOauth && (
          <AStackFlex py={10} alignItems="flex-start" justifyContent="flex-start">
            <AText fontSize={13}>
              1.
              {' '}
              {translate('auth_create_new_oauth_client')}
              {' '}
            </AText>
            <AText fontSize={13} lineHeight={20} onPress={() => Linking.openURL(`${config.backendURL}/profile`)} underline>
              {`${isValidHttpUrl(config.backendURL) ? config.backendURL : '[Firefly III URL]'}/profile`}
            </AText>
            <AStackFlex row py={10} justifyContent="flex-start" flexWrap="wrap">
              <AText fontSize={13}>
                2.
                {' '}
                {translate('auth_form_set_redirect')}
              </AText>

              <APressable
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: colors.brandStyle,
                  borderRadius: 10,
                  marginLeft: 10,
                  paddingRight: 7,
                  padding: 1,
                }}
                onPress={copyToClipboard}
              >
                <Ionicons name="copy" size={12} color="white" style={{ margin: 5 }} />
                <AText fontSize={13} numberOfLines={1} color="white" bold>abacusfiiiapp://redirect</AText>
              </APressable>
            </AStackFlex>
            <AFormView mx={0}>
              <ALabel isRequired>{translate('auth_form_oauth_clientId')}</ALabel>
              <AInput
                keyboardType="numeric"
                returnKeyType="done"
                placeholder={translate('auth_form_oauth_clientId')}
                value={config.oauthClientId}
                onChangeText={(v) => setConfig({
                  ...config,
                  oauthClientId: v,
                })}
              />
            </AFormView>
            <AFormView mx={0}>
              <ALabel>{translate('auth_form_oauth_client_secret')}</ALabel>
              <AInput
                returnKeyType="done"
                type="password"
                placeholder={translate('auth_form_oauth_client_secret')}
                value={config.oauthClientSecret}
                onChangeText={(v) => setConfig({
                  ...config,
                  oauthClientSecret: v,
                })}
              />
              <AText py={5} px={2} fontSize={11}>
                {translate('auth_form_secrets_help_message')}
              </AText>
            </AFormView>
          </AStackFlex>
          )}

          {!isOauth && (
            <AStackFlex py={10} alignItems="flex-start" justifyContent="flex-start">
              <AText fontSize={13} onPress={() => Linking.openURL(`${config.backendURL}/profile`)}>
                1.
                {' '}
                {translate('auth_create_new_personal_access_token')}
                {' '}
                <AText fontSize={13} onPress={() => Linking.openURL(`${config.backendURL}/profile`)} underline>
                  {isValidHttpUrl(config.backendURL) ? config.backendURL : '[Firefly III URL]'}
                  /profile
                </AText>
              </AText>
              <AFormView mx={0}>
                <ALabel testID="auth_form_personal_access_token_label" isRequired>
                  {translate('auth_form_personal_access_token_label')}
                </ALabel>
                <AInput
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
                <AText py={5} px={2} fontSize={11}>
                  {translate('auth_form_secrets_help_message')}
                </AText>
              </AFormView>
            </AStackFlex>
          )}

          <AView
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              padding: 15,
            }}
          >
            <AText
              fontSize={13}
              onPress={() => Linking.openURL('https://github.com/victorbalssa/abacus/blob/master/.github/HELP.md')}
              onLongPress={() => setDemoCredentials()}
              underline
            >
              {translate('auth_form_need_help')}
            </AText>
          </AView>

          <AView style={{ width: '100%' }}>
            <AButton
              type="primary"
              loading={loading}
              style={{ height: 40, marginTop: 5 }}
              onPress={handleLogin}
              testID="auth_form_submit_button_initial"
              disabled={!isValidHttpUrl(config.backendURL) || !isMinimumRequirement()}
              disabledTint
            >
              <AStackFlex row>
                <Ionicons name="log-in-outline" size={20} color="white" style={{ margin: 5 }} />
                <AText fontSize={15} color="white">{translate('auth_form_submit_button_initial')}</AText>
              </AStackFlex>
            </AButton>
          </AView>
        </AStack>
        <AView style={{ height: 170 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
