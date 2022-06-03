import React from 'react';
import PropTypes from 'prop-types';
import {
  Input, Box, FormControl, HStack, Button, Icon,
} from 'native-base';

import { KeyboardAvoidingView } from 'react-native';
import { AntDesign, Ionicons } from '@expo/vector-icons';
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

Configuration.propTypes = {
  loading: PropTypes.bool.isRequired,
};

Configuration.defaultProps = {};

export default Configuration;
