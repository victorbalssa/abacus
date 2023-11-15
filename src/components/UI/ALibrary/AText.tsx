import React from 'react';
import { Text } from 'react-native';
import { useThemeColors } from '../../../lib/common';

type ATextType = {
  px?: number
  py?: number
  color?: string,
  fontSize?: number
  lineHeight?: number
  fontFamily?: 'Montserrat_Bold' | 'Montserrat'
  numberOfLines?: number
  style?: StyleSheet
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
  style = null,
  children,
}: ATextType) {
  const { colors } = useThemeColors();

  return (
    <Text
      numberOfLines={numberOfLines}
      style={{
        color: color || colors.text,
        lineHeight,
        fontSize,
        fontFamily,
        paddingHorizontal: px,
        paddingVertical: py,
        ...style,
      }}
    >
      {children}
    </Text>
  );
}
