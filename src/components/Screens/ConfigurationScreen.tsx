import React from 'react';
import {
  Alert,
  Platform,
  Switch,
} from 'react-native';
import * as Linking from 'expo-linking';
import * as Application from 'expo-application';
import * as LocalAuthentication from 'expo-local-authentication';
import {
  Octicons,
  FontAwesome,
  AntDesign,
  Ionicons,
} from '@expo/vector-icons';
import * as StoreReview from 'expo-store-review';
import { useDispatch, useSelector } from 'react-redux';
import { CommonActions } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import translate from '../../i18n/locale';
import { useThemeColors } from '../../lib/common';
import { RootDispatch, RootState } from '../../store';
import { ScreenType } from '../../types/screen';
import {
  APressable,
  AScrollView,
  AStack,
  AText,
  AView,
} from '../UI/ALibrary';

export default function ConfigurationScreen({ navigation }: ScreenType) {
  const { colors } = useThemeColors();
  const safeAreaInsets = useSafeAreaInsets();
  const backendURL = useSelector((state: RootState) => state.configuration.backendURL);
  const useBiometricAuth = useSelector((state: RootState) => state.configuration.useBiometricAuth);
  const {
    configuration: {
      setUseBiometricAuth,
      resetAllStates,
    },
  } = useDispatch<RootDispatch>();

  const bioAuthCallback = async (callback) => {
    const bioAuth = await LocalAuthentication.authenticateAsync();
    if (bioAuth.success) {
      callback();
    }
  };

  const reviewApp = async () => {
    if (await StoreReview.isAvailableAsync()) {
      await StoreReview.requestReview();
    }
  };

  const resetCache = async () => {
    await resetAllStates();
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
          { name: 'dashboard' },
        ],
      }),
    );
  };

  const showResetCacheAlert = () => Alert.alert(
    translate('configuration_clear_alert_title'),
    translate('configuration_clear_alert_text'),
    [
      {
        text: translate('configuration_clear_confirm_button'),
        onPress: () => resetCache(),
        style: 'destructive',
      },
      {
        text: translate('cancel'),
        style: 'cancel',
      },
    ],
  );

  const goToAccounts = () => navigation.dispatch(
    CommonActions.navigate({
      name: 'CredentialsScreen',
    }),
  );

  const goToCredentials = async () => {
    await resetAllStates();
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
          { name: 'credentials', params: { noRedirect: true } },
        ],
      }),
    );
  };

  const showLogoutAlert = () => Alert.alert(
    translate('configuration_clear_alert_title'),
    '',
    [
      {
        text: 'OK',
        onPress: () => goToCredentials(),
        style: 'destructive',
      },
      {
        text: translate('cancel'),
        style: 'cancel',
      },
    ],
  );

  return (
    <AScrollView
      style={{
        paddingTop: safeAreaInsets.top,
        backgroundColor: colors.backgroundColor,
      }}
      bounces={false}
      showsVerticalScrollIndicator={false}
    >

      <AText py={10} px={10} fontSize={18} bold>
        {translate('configuration_security')}
      </AText>
      <AView
        style={{
          borderTopWidth: 0.5,
          borderBottomWidth: 0.5,
          borderColor: colors.listBorderColor,
          backgroundColor: colors.tileBackgroundColor,
        }}
      >
        <AStack
          row
          justifyContent="space-between"
          style={{
            height: 45,
            paddingHorizontal: 10,
            paddingVertical: 5,
            marginLeft: 10,
            borderBottomWidth: 0.5,
            borderColor: colors.listBorderColor,
          }}
        >
          <AText fontSize={14}>URL</AText>
          <AText fontSize={14} onPress={() => Linking.openURL(backendURL)} underline>{backendURL}</AText>
        </AStack>
        <APressable
          flexDirection="row"
          onPress={goToAccounts}
          style={{
            justifyContent: 'space-between',
            height: 45,
            paddingHorizontal: 10,
            paddingVertical: 5,
            marginLeft: 10,
            borderBottomWidth: 0.5,
            borderColor: colors.listBorderColor,
          }}
        >
          <AText fontSize={14}>{translate('configuration_manage_credentials')}</AText>
          <FontAwesome name="angle-right" size={22} color="gray" />
        </APressable>
        <AStack
          row
          justifyContent="space-between"
          style={{
            height: 45,
            paddingHorizontal: 10,
            paddingVertical: 5,
            marginLeft: 10,
          }}
        >
          <AText fontSize={14}>{translate('auth_form_biometrics_lock')}</AText>
          <Switch thumbColor="white" trackColor={{ false: '#767577', true: colors.brandStyle }} onValueChange={() => bioAuthCallback(setUseBiometricAuth)} value={useBiometricAuth} />
        </AStack>
      </AView>

      <AText py={10} px={10} fontSize={18} bold>
        {translate('configuration_about')}
      </AText>
      <AView
        style={{
          borderTopWidth: 0.5,
          borderBottomWidth: 0.5,
          borderColor: colors.listBorderColor,
          backgroundColor: colors.tileBackgroundColor,
        }}
      >
        <AStack
          row
          justifyContent="space-between"
          style={{
            height: 45,
            paddingHorizontal: 10,
            paddingVertical: 5,
            marginLeft: 10,
            borderBottomWidth: 0.5,
            borderColor: colors.listBorderColor,
          }}
        >
          <AText fontSize={14}>{translate('configuration_app_version')}</AText>
          <AText fontSize={14}>{Application.nativeApplicationVersion}</AText>
        </AStack>
        <APressable
          flexDirection="row"
          onPress={() => Linking.openURL('https://github.com/victorbalssa/abacus/discussions/')}
          style={{
            justifyContent: 'space-between',
            height: 45,
            paddingHorizontal: 10,
            paddingVertical: 5,
            marginLeft: 10,
            borderBottomWidth: 0.5,
            borderColor: colors.listBorderColor,
          }}
        >
          <AText fontSize={14}>{translate('configuration_share_feedback')}</AText>
          <Octicons name="cross-reference" size={20} color="gray" />
        </APressable>
        <APressable
          flexDirection="row"
          onPress={() => Linking.openURL('https://github.com/victorbalssa/abacus/issues/new')}
          style={{
            justifyContent: 'space-between',
            height: 45,
            paddingHorizontal: 10,
            paddingVertical: 5,
            marginLeft: 10,
            borderBottomWidth: 0.5,
            borderColor: colors.listBorderColor,
          }}
        >
          <AText fontSize={14}>{translate('configuration_report_issue')}</AText>
          <Octicons name="issue-opened" size={20} color="gray" />
        </APressable>
        <APressable
          flexDirection="row"
          onPress={() => Linking.openURL('https://github.com/victorbalssa/abacus')}
          style={{
            justifyContent: 'space-between',
            height: 45,
            paddingHorizontal: 10,
            paddingVertical: 5,
            marginLeft: 10,
            borderBottomWidth: 0.5,
            borderColor: colors.listBorderColor,
          }}
        >
          <AText fontSize={14}>{translate('configuration_sources')}</AText>
          <AntDesign name="github" size={22} color="gray" />
        </APressable>
        <APressable
          flexDirection="row"
          onPress={reviewApp}
          style={{
            justifyContent: 'space-between',
            height: 45,
            paddingHorizontal: 10,
            paddingVertical: 5,
            marginLeft: 10,
          }}
        >
          <AText fontSize={14}>{translate(Platform.select({ ios: 'configuration_review_app_ios', android: 'configuration_review_app_android' }))}</AText>
          <Ionicons name={Platform.select({ ios: 'logo-apple-appstore', android: 'logo-google-playstore' })} size={23} color="gray" />
        </APressable>
      </AView>

      <AText py={10} px={10} fontSize={18} bold>
        {translate('configuration_debug')}
      </AText>
      <AView
        style={{
          borderTopWidth: 0.5,
          borderBottomWidth: 0.5,
          borderColor: colors.listBorderColor,
          backgroundColor: colors.tileBackgroundColor,
        }}
      >
        <APressable
          flexDirection="row"
          onPress={() => Linking.openURL('https://github.com/victorbalssa/abacus/blob/master/.github/HELP.md')}
          style={{
            justifyContent: 'space-between',
            height: 45,
            paddingHorizontal: 10,
            paddingVertical: 5,
            marginLeft: 10,
            borderBottomWidth: 0.5,
            borderColor: colors.listBorderColor,
          }}
        >
          <AText fontSize={14}>{translate('configuration_get_help')}</AText>
          <FontAwesome name="angle-right" size={22} color="gray" />
        </APressable>
        <APressable
          flexDirection="row"
          onPress={showResetCacheAlert}
          style={{
            justifyContent: 'space-between',
            height: 45,
            paddingHorizontal: 10,
            paddingVertical: 5,
            marginLeft: 10,
            borderBottomWidth: 0.5,
            borderColor: colors.listBorderColor,
          }}
        >
          <AText fontSize={14}>{translate('configuration_clear_option')}</AText>
          <FontAwesome name="angle-right" size={22} color="gray" />
        </APressable>
        <APressable
          flexDirection="row"
          onPress={showLogoutAlert}
          style={{
            justifyContent: 'space-between',
            height: 45,
            paddingHorizontal: 10,
            paddingVertical: 5,
            marginLeft: 10,
          }}
        >
          <AText fontSize={14}>{translate('go_to_credentials')}</AText>
          <FontAwesome name="angle-right" size={22} color="gray" />
        </APressable>
      </AView>

      <AView style={{ height: 170 }} />
    </AScrollView>
  );
}
