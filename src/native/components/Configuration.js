import React from 'react';
import PropTypes from 'prop-types';
import {
  Input, Box, FormControl, HStack,
} from 'native-base';

import { KeyboardAvoidingView } from 'react-native';
import UIButton from './UI/UIButton';

const Configuration = ({
  loading,
  resetApp,
  navigation,
  backendURL,
  setBackendURL,
}) => (
  <KeyboardAvoidingView
    h={{
      base: '400px',
      lg: 'auto',
    }}
    behavior="padding"
  >
    <Box alignItems="center" marginTop={60}>
      <Box maxWidth="500px">
        <FormControl>
          <FormControl.Label>FireFly3 backend URL</FormControl.Label>
          <HStack>
            <Input
              placeholder="FireFly3 backend URL"
              isDisabled
              value={backendURL}
            />
            <UIButton
              icon
              style={{ height: 30, margin: 5, minW: 400 }}
              text="Reset App"
              loading={loading}
              onPress={() => resetApp()}
            />
          </HStack>
        </FormControl>
{/*         <FormControl isRequired>
          <FormControl.Label>Default Currency</FormControl.Label>
          <Input
            placeholder="Default Currency"
            value
            onChangeText={(v) => {}}
          />
        </FormControl>
        <FormControl isRequired>
          <FormControl.Label>config</FormControl.Label>
          <Input
            placeholder=""
            value
            onChangeText={(v) => {}}
          />
          <FormControl.HelperText>
            tests.
          </FormControl.HelperText>
        </FormControl> */}

      </Box>
    </Box>
  </KeyboardAvoidingView>
);

Configuration.propTypes = {
  loading: PropTypes.bool.isRequired,
};

Configuration.defaultProps = {};

export default Configuration;
