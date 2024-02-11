import React, { useCallback, useState } from 'react';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import { Button } from 'native-base';
import { CommonActions, useFocusEffect } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { Alert, Platform } from 'react-native';
import {
  AStack,
  AView,
  AText,
  APressable,
  AScrollView,
} from '../UI/ALibrary';

import translate from '../../i18n/locale';
import { useThemeColors } from '../../lib/common';
import { deleteCredential, getCredentials, isTokenFresh } from '../../lib/oauth';
import { TCredential } from '../../types/credential';
import { ScreenType } from './types';
import { RootDispatch } from '../../store';
import AButton from '../UI/ALibrary/AButton';

export default function CredentialsScreen({ navigation }: ScreenType) {
  const { colors } = useThemeColors();
  const [credentials, setCredentials] = useState<TCredential[]>([]);
  const [editMode, setEditMode] = useState<boolean>(false);
  const dispatch = useDispatch<RootDispatch>();

  useFocusEffect(
    useCallback(
      () => {
        getCredentials().then((c) => {
          setCredentials(c);
        });
      },
      [],
    ),
  );

  const goToCredentialCreateScreen = () => navigation.dispatch(
    CommonActions.navigate({
      name: 'CredentialCreateScreen',
    }),
  );

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

  const handleDeleteCredential = async (index: number) => {
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

  return (
    <AScrollView
      style={{
        backgroundColor: colors.backgroundColor,
      }}
      bounces={false}
      showsVerticalScrollIndicator={false}
    >
      <AStack alignItems="flex-start">
        <AStack
          row
          justifyContent="space-between"
          style={{
            height: 50,
            paddingHorizontal: 15,
            marginTop: Platform.OS === 'ios' ? 0 : 20,
          }}
        >
          <AView style={{ width: 100 }} />
          <AText
            fontSize={17}
            fontFamily="Montserrat_Bold"
          >
            {translate('configuration_credentials')}
          </AText>
          {credentials.length > 0 ? (
            <APressable
              style={{
                width: 100,
                marginRight: 10,
                alignItems: 'flex-end',
                justifyContent: 'flex-end',
              }}
              onPress={() => setEditMode(!editMode)}
            >
              <AText fontSize={16} color={colors.brandStyle}>{editMode ? 'Done' : 'Edit'}</AText>
            </APressable>
          ) : <AView style={{ width: 100 }} />}
        </AStack>
        <AStack px={10}>
          {credentials.map((c, index) => (
            <AButton
              key={`${c.backendURL}-${c.email}`}
              onPress={() => loginWithCredential(c)}
              disabled={editMode}
            >
              <AView
                style={{
                  display: editMode ? 'flex' : 'none',
                  width: 17,
                  height: 17,
                  marginLeft: 10,
                  marginRight: 5,
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
              <AStack alignItems="flex-start" mx={5}>
                <AText py={2} numberOfLines={1} fontSize={15} bold>{c.email}</AText>
                <AText py={2} numberOfLines={1} fontSize={10} underline>{c.backendURL}</AText>
                <AText py={3} numberOfLines={1} fontSize={9}>{c.accessTokenExpiresIn ? '(OAuth)' : '(Personal Access Token)'}</AText>
              </AStack>
            </AButton>
          ))}
        </AStack>

        {!editMode && (
        <AStack px={10}>
          <Button
            w="100%"
            leftIcon={<Ionicons name="add-circle" size={20} color="white" />}
            onPress={goToCredentialCreateScreen}
            colorScheme="coolGray"
          >
            {translate('configuration_credentials_add_button')}
          </Button>
        </AStack>
        )}

        <AView style={{ height: 300 }} />
      </AStack>
    </AScrollView>
  );
}
