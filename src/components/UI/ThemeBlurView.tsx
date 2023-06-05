import React from 'react';
import { BlurView } from 'expo-blur';
import { Platform, View } from 'react-native';
import { useThemeColors } from '../../lib/common';

const CurrentBlur = (Platform.OS === 'ios') ? BlurView : View;

const ThemeBlurView = ({
  intensity = 50,
  tint,
  style = {},
  children,
}) => {
  const { colors } = useThemeColors();
  const backgroundColor = (Platform.OS === 'ios') ? 'transparent' : colors.backgroundColor;

  return (
    <CurrentBlur
      intensity={intensity}
      tint={tint}
      style={{
        ...style,
        backgroundColor,
      }}
    >
      {children}
    </CurrentBlur>
  );
};

export default ThemeBlurView;
