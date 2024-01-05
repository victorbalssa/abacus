import React from 'react';
import { Text } from 'react-native';
import { useThemeColors } from '../../../lib/common';
import { AStyle } from './AStack';

type ATextType = {
  px?: number
  py?: number
  color?: string,
  fontSize?: number
  lineHeight?: number
  fontFamily?: 'Montserrat_Bold' | 'Montserrat'
  numberOfLines?: number
  underline?: boolean
  onPress?: () => void
  style?: AStyle
  children: React.ReactNode
}

export default function AText({
  px = 0,
  py = 0,
  color,
  fontSize = 11,
  lineHeight,
  fontFamily = 'Montserrat',
  numberOfLines,
  underline = false,
  onPress = null,
  style = null,
  children,
}: ATextType) {
  const { colors } = useThemeColors();

  return (
    <Text
      onPress={onPress}
      numberOfLines={numberOfLines}
      style={{
        color: color || colors.text,
        lineHeight,
        fontSize,
        fontFamily,
        paddingHorizontal: px,
        paddingVertical: py,
        textDecorationLine: underline ? 'underline' : 'none',
        ...style,
      }}
    >
      {children}
    </Text>
  );
}
