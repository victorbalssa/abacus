import React from 'react';
import {
  ScrollView,
  Alert,
} from 'react-native';
import {
  Box,
  Stack,
  Text,
  HStack,
  Heading,
  View,
  Switch,
  Pressable,
} from 'native-base';
import * as Linking from 'expo-linking';
import * as Application from 'expo-application';
import { Octicons, FontAwesome, AntDesign } from '@expo/vector-icons';

import { useDispatch, useSelector } from 'react-redux';
import { CommonActions } from '@react-navigation/native';
import translate from '../../i18n/locale';
import { useThemeColors } from '../../lib/common';
import { RootDispatch, RootState } from '../../store';
import { ScreenType } from './types';

function Separator({ backgroundColor }) {
  return (
    <View pr={4} ml={4} style={{ height: 1 }} backgroundColor={backgroundColor} />
  );
}

export default function ConfigurationScreen({ navigation }: ScreenType) {
  const { colors } = useThemeColors();
  const {
    backendURL,
    faceId,
  } = useSelector((state: RootState) => state.configuration);
  const {
    configuration: {
      setFaceId,
      resetAllStorage,
    },
  } = useDispatch<RootDispatch>();

  const resetApp = async () => {
    await resetAllStorage();
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
          { name: 'oauth' },
        ],
      }),
    );
  };

  const showAlert = () => Alert.alert(
    translate('configuration_clear_alert_title'),
    translate('configuration_clear_alert_text'),
    [
      {
        text: translate('configuration_clear_confirm_button'),
        onPress: () => resetApp(),
        style: 'destructive',
      },
      {
        text: translate('configuration_clear_cancel_button'),
        style: 'cancel',
      },
    ],
  );

  return (
    <ScrollView
      style={{
        backgroundColor: colors.backgroundColor,
      }}
      bounces={false}
      showsVerticalScrollIndicator={false}
    >
      <Stack safeAreaTop>

        <Heading mx={2} py={2} pt={5} size="sm">{translate('configuration_security')}</Heading>
        <Box borderTopWidth={1} borderBottomWidth={1} borderColor={colors.listBorderColor} backgroundColor={colors.tileBackgroundColor}>
          <HStack pr={4} ml={4} py={2} h={45} alignItems="center" justifyContent="space-between" borderBottomWidth={1} borderColor={colors.listBorderColor}>
            <Text>URL</Text>
            <Text style={{ color: colors.brandInfo }} onPress={() => Linking.openURL(backendURL)} underline>{backendURL}</Text>
          </HStack>
          <HStack pr={4} ml={4} py={2} h={45} alignItems="center" justifyContent="space-between">
            <Text>{translate('configuration_biometry')}</Text>
            <Switch isChecked={faceId} onToggle={setFaceId} colorScheme="primary" />
          </HStack>
        </Box>

        <Heading mx={2} py={2} pt={5} size="sm">{translate('configuration_about')}</Heading>
        <Box borderTopWidth={1} borderBottomWidth={1} borderColor={colors.listBorderColor} backgroundColor={colors.tileBackgroundColor}>
          <HStack pr={4} ml={4} py={2} h={45} alignItems="center" justifyContent="space-between">
            <Text>{translate('configuration_app_version')}</Text>
            <Text>{Application.nativeApplicationVersion}</Text>
          </HStack>
          <Separator backgroundColor={colors.listBorderColor} />
          <Pressable _pressed={{ backgroundColor: colors.listPressed }} onPress={() => Linking.openURL('https://github.com/victorbalssa/abacus/discussions/')} pr={4} pl={4} py={2} h={45} alignItems="center" justifyContent="space-between" flexDirection="row">
            <Text>{translate('configuration_share_feedback')}</Text>
            <Octicons name="cross-reference" size={20} color="gray" />
          </Pressable>
          <Separator backgroundColor={colors.listBorderColor} />
          <Pressable _pressed={{ backgroundColor: colors.listPressed }} onPress={() => Linking.openURL('https://github.com/victorbalssa/abacus/issues/new')} pr={4} pl={4} py={2} h={45} alignItems="center" justifyContent="space-between" flexDirection="row">
            <Text>{translate('configuration_report_issue')}</Text>
            <Octicons name="issue-opened" size={20} color="gray" />
          </Pressable>
          <Separator backgroundColor={colors.listBorderColor} />
          <Pressable _pressed={{ backgroundColor: colors.listPressed }} onPress={() => Linking.openURL('https://github.com/victorbalssa/abacus')} px={4} py={2} h={45} alignItems="center" justifyContent="space-between" flexDirection="row">
            <Text>{translate('configuration_sources')}</Text>
            <AntDesign name="github" size={20} color="gray" />
          </Pressable>
        </Box>

        <Heading mx={2} py={2} pt={5} size="sm">{translate('configuration_debug')}</Heading>
        <Box borderTopWidth={1} borderBottomWidth={1} borderColor={colors.listBorderColor} backgroundColor={colors.tileBackgroundColor}>
          <Pressable _pressed={{ backgroundColor: colors.listPressed }} onPress={() => Linking.openURL('https://github.com/victorbalssa/abacus/blob/master/.github/HELP.md')} pr={4} pl={4} py={2} h={45} alignItems="center" justifyContent="space-between" flexDirection="row">
            <Text>{translate('configuration_get_help')}</Text>
            <FontAwesome name="angle-right" size={22} color="gray" />
          </Pressable>
          <Separator backgroundColor={colors.listBorderColor} />
          <Pressable _pressed={{ backgroundColor: colors.listPressed }} onPress={showAlert} px={4} py={2} h={45} alignItems="center" justifyContent="space-between" flexDirection="row">
            <Text>{translate('configuration_clear_option')}</Text>
            <FontAwesome name="angle-right" size={22} color="gray" />
          </Pressable>
        </Box>

        <View style={{ height: 300 }} />
      </Stack>
    </ScrollView>
  );
}
