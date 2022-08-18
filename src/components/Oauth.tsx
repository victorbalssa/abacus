import React from 'react';
import {
  Input,
  Box,
  FormControl,
  Button, HStack, Text, Pressable,
} from 'native-base';
import { KeyboardAvoidingView } from 'react-native';
import * as Haptics from 'expo-haptics';

import { Ionicons } from '@expo/vector-icons';
import * as Linking from 'expo-linking';
import { isValidHttpUrl } from '../lib/common';

const Oauth = ({
  loading,
  faceId,
  faceIdCheck,
  config,
  setConfig,
  promptAsync,
  backendURL,
  setBackendURL,
}) => (
  <KeyboardAvoidingView behavior="padding">
    <Box p={5} safeAreaTop>
      <FormControl isRequired>
        <FormControl.Label>Firefly III backend URL</FormControl.Label>
        <Input
          returnKeyType="done"
          placeholder="Firefly III backend URL (without '/' at the end)"
          keyboardType="url"
          value={backendURL}
          onChangeText={setBackendURL}
        />
        <FormControl.HelperText>
          without '/' at the end.
        </FormControl.HelperText>
      </FormControl>
      <FormControl isRequired>
        <FormControl.Label>Oauth Client ID</FormControl.Label>
        <Input
          keyboardType="numeric"
          returnKeyType="done"
          placeholder="Oauth Client ID"
          value={config.oauthClientId}
          onChangeText={(v) => setConfig({
            ...config,
            oauthClientId: v,
          })}
        />
      </FormControl>
      <FormControl>
        <FormControl.Label>Oauth Client Secret</FormControl.Label>
        <Input
          returnKeyType="done"
          type="password"
          placeholder="Oauth Client Secret"
          value={config.oauthClientSecret}
          onChangeText={(v) => setConfig({
            ...config,
            oauthClientSecret: v,
          })}
        />
        <FormControl.HelperText>
          All secrets are kept in iOS secure storage.
        </FormControl.HelperText>
      </FormControl>

      <HStack>
        <Text py={1} pr={1} fontSize={14} color="primary.200">
          🔥 set redirect URI to:
        </Text>

        <Box backgroundColor="primary.200" borderRadius={15} py={1} px={1}>
          <Text fontFamily="Montserrat_Bold" color="white">abacusiosapp://redirect</Text>
        </Box>
      </HStack>
      <Pressable mx={3} my={3} minH={45} alignItems="center" justifyContent="flex-end">
        <Text onPress={() => Linking.openURL('https://github.com/victorbalssa/abacus/blob/master/.github/HELP.md')} underline>Need Help?</Text>
      </Pressable>

      <Button
        leftIcon={<Ionicons name="log-in-outline" size={20} color="white" />}
        mt="2"
        shadow={2}
        borderRadius={15}
        onTouchStart={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
        _pressed={{
          style: {
            transform: [{
              scale: 0.99,
            }],
          },
        }}
        _loading={{
          bg: 'primary.50',
          _text: {
            color: 'white',
          },
          alignItems: 'flex-start',
          opacity: 1,
        }}
        _spinner={{
          color: 'white',
          size: 10,
        }}
        colorScheme="primary"
        isDisabled={!isValidHttpUrl(backendURL)}
        isLoading={loading}
        isLoadingText="Submitting..."
        onPress={() => promptAsync()}
      >
        Sign In
      </Button>
      {faceId && (
      <Button
        leftIcon={<Ionicons name="ios-lock-open" size={16} color="white" />}
        mt="2"
        shadow={2}
        borderRadius={15}
        onTouchStart={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
        _pressed={{
          style: {
            transform: [{
              scale: 0.99,
            }],
          },
        }}
        _loading={{
          _text: {
            color: 'white',
          },
          alignItems: 'flex-start',
          opacity: 1,
        }}
        _spinner={{
          color: 'white',
          size: 10,
        }}
        colorScheme="coolGray"
        isLoading={loading}
        onPress={() => faceIdCheck()}
      >
        Face ID
      </Button>
      )}
    </Box>
  </KeyboardAvoidingView>
);

export default Oauth;
