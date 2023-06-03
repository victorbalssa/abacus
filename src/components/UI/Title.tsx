import React from 'react';
import {
  IconButton,
  Heading,
} from 'native-base';
import { AntDesign } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { BlurView } from 'expo-blur';
import { useThemeColors } from '../../lib/common';

const Title = ({ text, navigation }) => {
  const { colors } = useThemeColors();

  return (
    <BlurView
      intensity={50}
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
      }}
    >
      <Heading
        numberOfLines={2}
        fontSize={21}
        lineHeight={20}
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
    </BlurView>
  );
};

export default Title;
