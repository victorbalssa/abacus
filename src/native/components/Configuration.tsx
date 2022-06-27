import React from 'react';

import {
  Input, Box, FormControl, Icon,
} from 'native-base';

import { KeyboardAvoidingView } from 'react-native';
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
  <KeyboardAvoidingView
    h={{
      base: '400px',
      lg: 'auto',
    }}
    behavior="padding"
  >
    <Box alignItems="center" marginTop={60} p={5}>
      <FormControl>
        <FormControl.Label>FireFlyIII backend URL</FormControl.Label>
        <Input
          variant="rounded"
          placeholder="FireFlyIII backend URL"
          isDisabled
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
              }}
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
  </KeyboardAvoidingView>
);

export default Configuration;
