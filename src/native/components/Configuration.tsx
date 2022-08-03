import React from 'react';
import {
  Box,
  Stack,
  Text,
  HStack,
  Heading,
  Switch, AlertDialog, Button,
} from 'native-base';
import * as Linking from 'expo-linking';
import Constants from 'expo-constants';
import { AntDesign } from '@expo/vector-icons';

type ConfigurationComponent = {
  faceId: boolean,
  setFaceId: () => Promise<void>,
  loading: boolean,
  resetApp: () => Promise<void>,
  backendURL: string,
};

const Configuration = ({
  faceId,
  setFaceId,
  resetApp,
  backendURL,
}: ConfigurationComponent) => {
  const [isResetOpen, setResetOpen] = React.useState(false);
  const onResetClose = () => setResetOpen(false);
  const ResetRef = React.useRef(null);

  return (
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
        <HStack mx={3} py={2} minH={45} alignItems="center" justifyContent="space-between" borderBottomWidth={1} borderColor="gray.200">
          <Text>Face ID Lock</Text>
          <Switch isChecked={faceId} onToggle={setFaceId} colorScheme="primary" />
        </HStack>
      </Box>

      <Heading mx={2} py={2} pt={5} size="sm">About</Heading>
      <Box borderTopWidth={1} borderBottomWidth={1} borderColor="gray.200" backgroundColor="gray.100">
        <HStack mx={3} py={2} minH={45} alignItems="center" justifyContent="space-between" borderBottomWidth={1} borderColor="gray.200">
          <Text>App Version</Text>
          <Text>
            {Constants.manifest.version}
            {' '}
            (BETA)
          </Text>
        </HStack>
        <HStack mx={3} py={2} minH={45} alignItems="center" justifyContent="space-between" borderBottomWidth={1} borderColor="gray.200">
          <Text>Error report</Text>
          <Text style={{ color: 'blue' }} onPress={() => Linking.openURL('https://github.com/victorbalssa/abacus/issues/new')} underline>New issue</Text>
        </HStack>
        <HStack mx={3} py={2} minH={45} alignItems="center" justifyContent="space-between" borderBottomWidth={1} borderColor="gray.200">
          <Text>Feature request</Text>
          <Text style={{ color: 'blue' }} onPress={() => Linking.openURL('https://github.com/victorbalssa/abacus/discussions/new')} underline>New discussion</Text>
        </HStack>
        <HStack mx={3} py={2} minH={45} alignItems="center" justifyContent="space-between">
          <Text>Sources</Text>
          <Text style={{ color: 'blue' }} onPress={() => Linking.openURL('https://github.com/victorbalssa/abacus')} underline>GitHub.com</Text>
        </HStack>
      </Box>

      <Heading mx={2} py={2} pt={5} size="sm">Debug</Heading>
      <Box borderTopWidth={1} borderBottomWidth={1} borderColor="gray.200" backgroundColor="gray.100">
        <HStack mx={3} py={2} minH={45} alignItems="center" justifyContent="space-between">
          <Text>Clear & Reset Application</Text>
          <AntDesign name="poweroff" size={22} color="gray" onPress={() => setResetOpen(true)} />
        </HStack>
      </Box>

      <AlertDialog leastDestructiveRef={ResetRef} isOpen={isResetOpen} onClose={onResetClose}>
        <AlertDialog.Content>
          <AlertDialog.CloseButton />
          <AlertDialog.Header>Are you sure?</AlertDialog.Header>
          <AlertDialog.Body>
            Clearing cache will remove:
            <>- local configurations.</>
            <>- Oauth Client ID & Secret.</>
            <>- URL of your instance.</>
          </AlertDialog.Body>
          <AlertDialog.Footer>
            <Button.Group>
              <Button variant="unstyled" colorScheme="coolGray" onPress={onResetClose} ref={ResetRef}>
                Cancel
              </Button>
              <Button colorScheme="red" onPress={resetApp}>
                Clear now
              </Button>
            </Button.Group>
          </AlertDialog.Footer>
        </AlertDialog.Content>
      </AlertDialog>
    </Stack>
  );
};

export default Configuration;
