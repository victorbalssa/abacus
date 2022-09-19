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
} from 'native-base';
import * as Linking from 'expo-linking';
import * as Application from 'expo-application';
import { Octicons, FontAwesome } from '@expo/vector-icons';

const Configuration = ({
  faceId,
  setFaceId,
  resetApp,
  backendURL,
}) => {
  const showAlert = () => Alert.alert(
    'Are you sure?',
    'Clearing cache will remove:\n'
    + 'local configurations\n'
    + 'Oauth Client ID & Secret\n'
    + 'URL of your instance',
    [
      {
        text: 'Clear now',
        onPress: () => resetApp(),
        style: 'destructive',
      },
      {
        text: 'Cancel',
        style: 'cancel',
      },
    ],
  );

  return (
    <Stack safeAreaTop>
      <ScrollView bounces={false}>
        <Heading mx={2} py={2} pt={5} size="sm">Security</Heading>
        <Box borderTopWidth={1} borderBottomWidth={1} borderColor="gray.200" backgroundColor="gray.100">
          <HStack px={4} py={2} minH={45} alignItems="center" justifyContent="space-between" borderBottomWidth={1} borderColor="gray.200">
            <Text color="gray.600">URL</Text>
            <Text style={{ color: 'blue' }} onPress={() => Linking.openURL(backendURL)} underline>{backendURL}</Text>
          </HStack>
          <HStack px={4} py={2} minH={45} alignItems="center" justifyContent="space-between">
            <Text color="gray.600">Face ID Lock</Text>
            <Switch isChecked={faceId} onToggle={setFaceId} colorScheme="primary" />
          </HStack>
        </Box>

        <Heading mx={2} py={2} pt={5} size="sm">About</Heading>
        <Box borderTopWidth={1} borderBottomWidth={1} borderColor="gray.200" backgroundColor="gray.100">
          <HStack px={4} py={2} minH={45} alignItems="center" justifyContent="space-between" borderBottomWidth={1} borderColor="gray.200">
            <Text color="gray.600">App Version</Text>
            <Text color="gray.600">
              {Application.nativeApplicationVersion}
            </Text>
          </HStack>
          <Pressable _pressed={{ backgroundColor: 'muted.300' }} onPress={() => Linking.openURL('https://github.com/victorbalssa/abacus/discussions/new')} px={4} py={2} minH={45} alignItems="center" justifyContent="space-between" flexDirection="row" borderBottomWidth={1} borderColor="gray.200">
            <Text color="gray.600">Share Feedback</Text>
            <Octicons name="cross-reference" size={19} color="gray" />
          </Pressable>
          <Pressable _pressed={{ backgroundColor: 'muted.300' }} onPress={() => Linking.openURL('https://github.com/victorbalssa/abacus/issues/new')} px={4} py={2} minH={45} alignItems="center" justifyContent="space-between" flexDirection="row" borderBottomWidth={1} borderColor="gray.200">
            <Text color="gray.600">Report Issue</Text>
            <Octicons name="issue-opened" size={19} color="gray" />
          </Pressable>
          <Pressable _pressed={{ backgroundColor: 'muted.300' }} onPress={() => Linking.openURL('https://github.com/victorbalssa/abacus')} px={4} py={2} minH={45} alignItems="center" justifyContent="space-between" flexDirection="row">
            <Text color="gray.600">Sources</Text>
            <FontAwesome name="angle-right" size={22} color="gray" />
          </Pressable>
        </Box>

        <Heading mx={2} py={2} pt={5} size="sm">Debug</Heading>
        <Box borderTopWidth={1} borderBottomWidth={1} borderColor="gray.200" backgroundColor="gray.100">
          <Pressable _pressed={{ backgroundColor: 'muted.300' }} onPress={() => Linking.openURL('https://github.com/victorbalssa/abacus/blob/master/.github/HELP.md')} borderBottomWidth={1} borderColor="gray.200" pr={4} pl={4} py={2} minH={45} alignItems="center" justifyContent="space-between" flexDirection="row">
            <Text color="gray.600">Get Help</Text>
            <FontAwesome name="angle-right" size={22} color="gray" />
          </Pressable>
          <Pressable _pressed={{ backgroundColor: 'muted.300' }} onPress={showAlert} px={4} py={2} minH={45} alignItems="center" justifyContent="space-between" flexDirection="row">
            <Text color="gray.600">Clear & Reset Application</Text>
            <FontAwesome name="angle-right" size={22} color="gray" />
          </Pressable>
        </Box>

        <View style={{ height: 100 }} />
      </ScrollView>
    </Stack>
  );
};

export default Configuration;
