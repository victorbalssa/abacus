import React from 'react';
import { Text } from 'react-native';
import { useThemeColors } from '../../../lib/common';
import { AStyle } from './types';

type ATextType = {
  px?: number
  py?: number
  color?: string,
  fontSize?: number
  lineHeight?: number
  maxWidth?: number
  bold?: boolean
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
  maxWidth,
  bold = false,
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
        maxWidth,
        fontFamily: bold ? `${fontFamily}_Bold` : fontFamily,
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
