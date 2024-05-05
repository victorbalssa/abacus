import React, { useCallback, useState } from 'react';
import { useRoute, CommonActions, useFocusEffect } from '@react-navigation/native';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import * as LocalAuthentication from 'expo-local-authentication';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { Alert, Platform, Pressable } from 'react-native';
import {
  AView,
  AText,
  AScrollView,
  AStackFlex,
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

export default function CredentialsScreen({ navigation }: ScreenType) {
  const { colors } = useThemeColors();
  const { name: routeName } = useRoute();
  const useBiometricAuth = useSelector((state: RootState) => state.configuration.useBiometricAuth);
  const [credentials, setCredentials] = useState<TCredential[]>([]);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [authenticated, setAuthenticated] = useState<boolean>(false);
  const dispatch = useDispatch<RootDispatch>();

  const loginWithCredential = async (credential: TCredential) => {
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

    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
          { name: 'dashboard' },
        ],
      }),
    );
  };

  const bioAuthCheck = useCallback((c: TCredential[]) => {
    (async () => {
      if (useBiometricAuth && !authenticated) {
        const bioAuth = await LocalAuthentication.authenticateAsync();
        if (bioAuth.success !== true) {
          return;
        }
      }

      setAuthenticated(true);
      if (c.length === 1 && routeName === 'credentials') {
        await loginWithCredential(c[0]);
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

  const goToCredentialCreateScreen = () => navigation.dispatch(
    CommonActions.navigate({
      name: 'CredentialCreateScreen',
    }),
  );

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
    <AScrollView
      bounces={false}
      showsVerticalScrollIndicator={false}
    >
      <AStackFlex alignItems="flex-start">
        <AStackFlex
          row
          justifyContent="space-between"
          style={{
            height: 50,
            paddingHorizontal: 15,
            marginTop: Platform.OS === 'ios' ? 0 : 20,
          }}
        >
          <AView style={{ width: 100 }} />
          <AText fontSize={17} bold>
            {translate('configuration_credentials')}
          </AText>
          {(credentials.length > 0 && routeName === 'credentials') ? (
            <Pressable
              style={{
                width: 100,
                marginRight: 10,
                alignItems: 'flex-end',
                justifyContent: 'flex-end',
              }}
              onPress={() => setEditMode(!editMode)}
            >
              <AText fontSize={16}>{editMode ? 'Done' : 'Edit'}</AText>
            </Pressable>
          ) : <AView style={{ width: 100 }} />}
        </AStackFlex>
        <AStackFlex px={10}>
          {credentials.map((c, index) => (
            <AButton
              key={`${c.backendURL}-${c.email}-${index + 1}`}
              onPress={() => loginWithCredential(c)}
              disabled={editMode}
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
              <Ionicons style={{ marginHorizontal: 5 }} name="person-circle" size={25} color={colors.text} />
              <AStackFlex alignItems="flex-start" mx={5}>
                <AText py={2} numberOfLines={1} fontSize={16} bold>{c.email}</AText>
                <AText py={2} numberOfLines={1} fontSize={12} underline>{c.backendURL}</AText>
                <AText
                  py={3}
                  numberOfLines={1}
                  fontSize={10}
                >
                  {c.accessTokenExpiresIn ? '(OAuth)' : '(Personal Access Token)'}
                </AText>
              </AStackFlex>
            </AButton>
          ))}
        </AStackFlex>

        {!editMode && (
          <AStackFlex px={10}>
            <AButton style={{ height: 40 }} onPress={goToCredentialCreateScreen}>
              <AStackFlex row>
                <Ionicons name="add-circle" size={20} color="white" style={{ margin: 5 }} />
                <AText fontSize={15}>{translate('configuration_credentials_add_button')}</AText>
              </AStackFlex>
            </AButton>
          </AStackFlex>
        )}

        <AView style={{ height: 300 }} />
      </AStackFlex>
    </AScrollView>
  );
}
