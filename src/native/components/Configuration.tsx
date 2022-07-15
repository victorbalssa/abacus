import React from 'react';

import {
  Input, Box, FormControl, Icon, Stack, Button,
} from 'native-base';

import { KeyboardAvoidingView, ViewStyle } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import UIButton from './UI/UIButton';
import * as Haptics from "expo-haptics";

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
  <KeyboardAvoidingView behavior="padding">
    <Stack safeAreaTop={12}>
      <Box alignItems="center" p={5}>
        <FormControl>
          <FormControl.Label>FireflyIII backend URL</FormControl.Label>
          <Input
            variant="outline"
            placeholder="FireflyIII backend URL"
            value={backendURL}
          />
          <Button
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
            isLoading={loading}
            isLoadingText="Submitting..."
            onPress={resetApp}
          >
            Reset App
          </Button>
        </FormControl>
      </Box>
    </Stack>
  </KeyboardAvoidingView>
);

export default Configuration;
