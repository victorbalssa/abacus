import React from 'react';
import { ScrollView, View, Alert } from 'react-native';
import {
  Box,
  Stack,
  Text,
  HStack,
  Heading,
  Switch,
  Pressable,
  useColorMode,
} from 'native-base';
import * as Linking from 'expo-linking';
import * as Application from 'expo-application';
import { Octicons, FontAwesome, AntDesign } from '@expo/vector-icons';

import { translate } from '../i18n/locale';

const Configuration = ({
  faceId,
  setFaceId,
  resetApp,
  backendURL,
}) => {
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

  const { toggleColorMode, colorMode } = useColorMode();

  return (
    <Stack safeAreaTop>
      <ScrollView bounces={false}>
{/*
        <Heading mx={2} py={2} pt={5} size="sm">{translate('configuration_ui')}</Heading>
        <Box borderTopWidth={1} borderBottomWidth={1} borderColor="gray.200" backgroundColor="gray.100">
          <HStack px={4} py={2} minH={45} alignItems="center" justifyContent="space-between">
            <Text color="gray.600">{translate('configuration_color_mode')}</Text>
            <Switch isChecked={colorMode === 'dark'} onToggle={toggleColorMode} colorScheme="primary" />
          </HStack>
        </Box>
*/}

        <Heading mx={2} py={2} pt={5} size="sm">{translate('configuration_security')}</Heading>
        <Box borderTopWidth={1} borderBottomWidth={1} borderColor="gray.200" backgroundColor="gray.100">
          <HStack px={4} py={2} minH={45} alignItems="center" justifyContent="space-between" borderBottomWidth={1} borderColor="gray.200">
            <Text color="gray.600">URL</Text>
            <Text style={{ color: 'blue' }} onPress={() => Linking.openURL(backendURL)} underline>{backendURL}</Text>
          </HStack>
          <HStack px={4} py={2} minH={45} alignItems="center" justifyContent="space-between">
            <Text color="gray.600">{translate('configuration_biometry')}</Text>
            <Switch isChecked={faceId} onToggle={setFaceId} colorScheme="primary" />
          </HStack>
        </Box>

        <Heading mx={2} py={2} pt={5} size="sm">{translate('configuration_about')}</Heading>
        <Box borderTopWidth={1} borderBottomWidth={1} borderColor="gray.200" backgroundColor="gray.100">
          <HStack px={4} py={2} minH={45} alignItems="center" justifyContent="space-between" borderBottomWidth={1} borderColor="gray.200">
            <Text color="gray.600">{translate('configuration_app_version')}</Text>
            <Text color="gray.600">
              {Application.nativeApplicationVersion}
            </Text>
          </HStack>
          <Pressable _pressed={{ backgroundColor: 'muted.300' }} onPress={() => Linking.openURL('https://github.com/victorbalssa/abacus/discussions/')} px={4} py={2} minH={45} alignItems="center" justifyContent="space-between" flexDirection="row" borderBottomWidth={1} borderColor="gray.200">
            <Text color="gray.600">{translate('configuration_share_feedback')}</Text>
            <Octicons name="cross-reference" size={20} color="gray" />
          </Pressable>
          <Pressable _pressed={{ backgroundColor: 'muted.300' }} onPress={() => Linking.openURL('https://github.com/victorbalssa/abacus/issues/new')} px={4} py={2} minH={45} alignItems="center" justifyContent="space-between" flexDirection="row" borderBottomWidth={1} borderColor="gray.200">
            <Text color="gray.600">{translate('configuration_report_issue')}</Text>
            <Octicons name="issue-opened" size={20} color="gray" />
          </Pressable>
          <Pressable _pressed={{ backgroundColor: 'muted.300' }} onPress={() => Linking.openURL('https://github.com/victorbalssa/abacus')} px={4} py={2} minH={45} alignItems="center" justifyContent="space-between" flexDirection="row">
            <Text color="gray.600">{translate('configuration_sources')}</Text>
            <AntDesign name="github" size={20} color="gray" />
          </Pressable>
        </Box>

        <Heading mx={2} py={2} pt={5} size="sm">{translate('configuration_debug')}</Heading>
        <Box borderTopWidth={1} borderBottomWidth={1} borderColor="gray.200" backgroundColor="gray.100">
          <Pressable _pressed={{ backgroundColor: 'muted.300' }} onPress={() => Linking.openURL('https://github.com/victorbalssa/abacus/blob/master/.github/HELP.md')} borderBottomWidth={1} borderColor="gray.200" pr={4} pl={4} py={2} minH={45} alignItems="center" justifyContent="space-between" flexDirection="row">
            <Text color="gray.600">{translate('configuration_get_help')}</Text>
            <FontAwesome name="angle-right" size={22} color="gray" />
          </Pressable>
          <Pressable _pressed={{ backgroundColor: 'muted.300' }} onPress={showAlert} px={4} py={2} minH={45} alignItems="center" justifyContent="space-between" flexDirection="row">
            <Text color="gray.600">{translate('configuration_clear_option')}</Text>
            <FontAwesome name="angle-right" size={22} color="gray" />
          </Pressable>
        </Box>

        <View style={{ height: 100 }} />
      </ScrollView>
    </Stack>
  );
};

export default Configuration;
