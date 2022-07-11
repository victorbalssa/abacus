import React from 'react';
import {
  HStack,
  Box,
  Text,
  Select,
  CheckIcon, IconButton,
} from 'native-base';
import { connect } from 'react-redux';
import moment from 'moment';
import { AntDesign } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Dispatch, RootState } from '../../../store';

const Title = ({ text }) => (
  <Box
    height={104}
    shadow={2}
    backgroundColor="white"
    pl={4}
    pr={4}
    safeAreaTop
  >
    <Box flex={1} pl={3} mt={1} height={41} justifyContent="center">
      <Text style={{ fontFamily: 'Montserrat_Bold', fontSize: 21 }}>
        {text}
      </Text>
    </Box>
  </Box>
);

export default Title;
