import React from 'react';
import {
  IconButton,
  Heading,
} from 'native-base';
import { AntDesign } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';
import ThemeBlurView from './ThemeBlurView';

const Title = ({ text, navigation }) => (
  <ThemeBlurView
    tint="dark"
    intensity={50}
    style={{
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingTop: Platform.OS === 'android' ? 20 : 0,
    }}
  >
    <Heading
      numberOfLines={2}
      fontSize={21}
      lineHeight={25}
      maxW={270}
    >
      {text}
    </Heading>

    <IconButton
      variant="ghost"
      _icon={{
        as: AntDesign,
        name: 'arrowdown',
        size: 'md',
      }}
      onPressOut={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)}
      onPress={() => navigation.pop()}
    />
  </ThemeBlurView>
);

export default Title;
