import React from 'react';

import {
  Input, Box, FormControl, Stack, Button, VStack, Icon, Text, HStack, Heading,
} from 'native-base';
import * as Linking from 'expo-linking';
import Constants from 'expo-constants';

import { KeyboardAvoidingView } from 'react-native';
import * as Haptics from 'expo-haptics';
import { AntDesign } from '@expo/vector-icons';

type ConfigurationComponent = {
  loading: boolean,
  resetApp: () => Promise<void>,
  backendURL: string,
};

const Configuration = ({
  loading,
  resetApp,
  backendURL,
}: ConfigurationComponent) => (
  <Stack safeAreaTop>
    <Heading mx={2} py={2} pt={5} size="sm">Security</Heading>
    <Box borderTopWidth={1} borderBottomWidth={1} borderColor="gray.200" backgroundColor="gray.100">
      <HStack mx={3} py={2} minH={45} alignItems="center" justifyContent="space-between" borderBottomWidth={1} borderColor="gray.200">
        <Text>URL</Text>
        <Text style={{ color: 'blue' }} onPress={() => Linking.openURL(backendURL)} underline>{backendURL}</Text>
      </HStack>
      <HStack mx={3} py={2} minH={45} alignItems="center" justifyContent="space-between" borderBottomWidth={1} borderColor="gray.200">
        <Text>Help</Text>
        <AntDesign name="arrowright" size={24} color="gray" onPress={() => Linking.openURL('https://github.com/victorbalssa/abacus/blob/master/.github/HELP.md')} />
      </HStack>
      <HStack mx={3} py={2} minH={45} alignItems="center" justifyContent="space-between">
        <Text>Clear & Reset Application</Text>
        <AntDesign name="poweroff" size={20} color="gray" onPress={resetApp} />
      </HStack>
    </Box>

    <Heading mx={2} py={2} pt={5} size="sm">About</Heading>
    <Box borderTopWidth={1} borderBottomWidth={1} borderColor="gray.200" backgroundColor="gray.100">
      <HStack mx={3} py={2} minH={45} alignItems="center" justifyContent="space-between" borderBottomWidth={1} borderColor="gray.200">
        <Text>App Version</Text>
        <Text>{Constants.manifest.version} (BETA)</Text>
      </HStack>
      <HStack mx={3} py={2} minH={45} alignItems="center" justifyContent="space-between" borderBottomWidth={1} borderColor="gray.200">
        <Text>Report an issue</Text>
        <Text style={{ color: 'blue' }} onPress={() => Linking.openURL('https://github.com/victorbalssa/abacus/discussions/new')} underline>New</Text>
      </HStack>
      <HStack mx={3} py={2} minH={45} alignItems="center" justifyContent="space-between">
        <Text>Sources</Text>
        <Text style={{ color: 'blue' }} onPress={() => Linking.openURL('https://github.com/victorbalssa/abacus')} underline>GitHub.com</Text>
      </HStack>
    </Box>
  </Stack>
);

export default Configuration;
