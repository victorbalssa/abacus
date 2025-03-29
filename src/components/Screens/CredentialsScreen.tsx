import React, { useCallback, useLayoutEffect, useState } from 'react';
import { useRoute, CommonActions, useFocusEffect } from '@react-navigation/native';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import * as LocalAuthentication from 'expo-local-authentication';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { Alert, SafeAreaView } from 'react-native';
import {
  AView,
  AText,
  AScrollView,
  AStackFlex,
  AIconButton,
} from '../UI/ALibrary';

import translate from '../../i18n/locale';
import { useThemeColors } from '../../lib/common';
import {
  deleteCredential, deleteOldSecureStore, getCredentials, isTokenFresh,
} from '../../lib/oauth';
import { TCredential } from '../../types/credential';
import { ScreenType } from '../../types/screen';
import { RootDispatch, RootState } from '../../store';
import AButton from '../UI/ALibrary/AButton';

export default function CredentialsScreen({ navigation, route }: ScreenType) {
  const { colors } = useThemeColors();
  const selectedBrandStyle = useSelector((state: RootState) => state.configuration.selectedBrandStyle || colors.brandStyleOrange);
  const { name: routeName } = useRoute();
  const useBiometricAuth = useSelector((state: RootState) => state.configuration.useBiometricAuth);
  const [credentials, setCredentials] = useState<TCredential[]>([]);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [authenticated, setAuthenticated] = useState<boolean>(false);
  const dispatch = useDispatch<RootDispatch>();

  const goToCredentialCreateScreen = (url: string) => navigation.dispatch(
    CommonActions.navigate({
      name: 'CredentialCreateScreen',
      params: {
        payload: {
          url,
        },
      },
    }),
  );

  const loginWithCredential = async (credential: TCredential, index: number) => {
    try {
      const {
        backendURL: currentBackendURL,
        accessToken,
        accessTokenExpiresIn: expiresIn,
        refreshToken,
      } = credential;

      axios.defaults.headers.Authorization = `Bearer ${accessToken}`;
      dispatch.configuration.setBackendURL(currentBackendURL);
      dispatch.currencies.setCurrentCode('');

      if (!isTokenFresh(expiresIn) && refreshToken) {
        await dispatch.firefly.getFreshAccessToken(credential);
      }

      navigation.dispatch(CommonActions.reset({ index: 0, routes: [{ name: 'dashboard' }] }));
    } catch (e) {
      Alert.alert(translate('oauth_token_error_title'), e.message);
      goToCredentialCreateScreen(credential.backendURL);
      await deleteCredential(index);
    }
  };

  const bioAuthCheck = useCallback((c: TCredential[]) => {
    (async () => {
      if (useBiometricAuth && !authenticated) {
        const bioAuth = await LocalAuthentication.authenticateAsync({
          promptMessage: translate('authenticate_label'),
        });
        if (bioAuth.success !== true) {
          return;
        }
      }

      setAuthenticated(true);
      const {
        params: {
          noRedirect = false,
        } = {},
      } = route;
      if (c.length === 1 && routeName === 'credentials' && !noRedirect) {
        await loginWithCredential(c[0], 0);
      }
    })();
  }, [useBiometricAuth, authenticated]);

  useFocusEffect(
    useCallback(() => {
      // delete old secure store keys
      deleteOldSecureStore().catch();
      getCredentials()
        .then((c) => {
          setCredentials(c);
          return c;
        })
        .then((c) => bioAuthCheck(c));
    }, []),
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (<AIconButton icon={<Ionicons name="settings-outline" color={selectedBrandStyle} size={24} />} onPress={() => setEditMode(!editMode)} />),
      headerRight: () => (<AIconButton icon={<Ionicons name="add-circle-outline" color={selectedBrandStyle} size={26} />} onPress={() => goToCredentialCreateScreen('')} />),
    });
  }, [navigation, goToCredentialCreateScreen, editMode, setEditMode]);

  const handleDeleteCredential = async (index: number) => {
    await dispatch.configuration.resetAllStates();
    await deleteCredential(index);
    setCredentials((c) => c.filter((_, i) => i !== index));
    setEditMode(!editMode);
  };

  const showAlert = (index: number) => Alert.alert(
    translate('credential_clear_alert_title'),
    '',
    [
      {
        text: translate('credential_clear_confirm_button'),
        onPress: () => handleDeleteCredential(index),
        style: 'destructive',
      },
      {
        text: translate('credential_clear_cancel_button'),
        onPress: () => setEditMode(!editMode),
        style: 'cancel',
      },
    ],
  );

  if (!authenticated) {
    return (
      <AScrollView
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}
        bounces={false}
        showsVerticalScrollIndicator={false}
      >
        <AButton style={{ height: 50 }} mx={40} onPress={() => bioAuthCheck(credentials)}>
          <AStackFlex row>
            <Ionicons name="lock-open" size={15} color="white" style={{ margin: 5 }} />
            <AText fontSize={15}>{translate('auth_form_biometrics_lock')}</AText>
          </AStackFlex>
        </AButton>
      </AScrollView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <AScrollView showsVerticalScrollIndicator={false}>
        {credentials.map((c, index) => (
          <AButton
            key={`${c.backendURL}-${c.email}-${index + 1}`}
            onPress={() => loginWithCredential(c, index)}
            disabled={editMode}
            style={{
              borderWidth: 0.5,
              borderColor: colors.listBorderColor,
              marginHorizontal: 7,
              marginBottom: 0,
              marginTop: 7,
            }}
          >
            <AView
              style={{
                display: editMode ? 'flex' : 'none',
                width: 17,
                height: 17,
                marginLeft: 15,
                marginRight: 10,
              }}
            >
              <AView
                style={{
                  flex: 1,
                  width: 16,
                  height: 16,
                  backgroundColor: 'white',
                  borderRadius: 10,
                  position: 'absolute',
                  top: 0.5,
                  left: 0.5,
                }}
              />
              <AntDesign onPress={() => showAlert(index)} name="minuscircle" size={17} color="red" />
            </AView>
            <Ionicons style={{ marginHorizontal: 5 }} name="person-circle" size={27} color={colors.text} />
            <AStackFlex alignItems="flex-start" mx={5}>
              <AText py={2} numberOfLines={1} fontSize={16} bold>{c.email}</AText>
              <AText py={2} numberOfLines={1} fontSize={12} underline>{c.backendURL}</AText>
              <AText py={3} numberOfLines={1} fontSize={10}>
                {c.accessTokenExpiresIn ? '(OAuth)' : '(Personal Access Token)'}
              </AText>
            </AStackFlex>
          </AButton>
        ))}
      </AScrollView>
    </SafeAreaView>
  );
}
