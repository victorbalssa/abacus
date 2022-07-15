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
    px={5}
    justifyContent="center"
    safeAreaTop
  >
    <Text numberOfLines={1} style={{ fontFamily: 'Montserrat_Bold', fontSize: 21, lineHeight: 40 }}>
      {text}
    </Text>
  </Box>
);

export default Title;
