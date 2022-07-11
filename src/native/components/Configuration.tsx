import React from 'react';

import {
  Input, Box, FormControl, Icon, Stack,
} from 'native-base';

import { KeyboardAvoidingView, ViewStyle } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import UIButton from './UI/UIButton';

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
          <FormControl.Label>Firefly III backend URL</FormControl.Label>
          <Input
            variant="outline"
            placeholder="Firefly III backend URL"
            value={backendURL}
          />
          <UIButton
            icon={(
              <Icon
                as={AntDesign}
                name="exclamationcircleo"
                style={{
                  color: '#fff',
                  fontSize: 15,
                  paddingRight: 10,
                  marginLeft: 10,
                  paddingLeft: 5,
                } as ViewStyle}
              />
          )}
            style={{
              height: 35,
              padding: 5,
              marginTop: 10,
            }}
            text="Reset App"
            loading={loading}
            onPress={() => resetApp()}
          />
        </FormControl>
      </Box>
    </Stack>
  </KeyboardAvoidingView>
);

export default Configuration;
