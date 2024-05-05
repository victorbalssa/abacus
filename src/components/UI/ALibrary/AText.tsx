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
  maxWidth?: number | '100%' | '90%' | '80%' | '70%' | '60%' | '50%' | '40%' | '30%'
  bold?: boolean
  fontFamily?: 'Montserrat-Bold' | 'Montserrat-Regular'
  numberOfLines?: number
  textAlign?: 'center' | 'left' | 'right'
  underline?: boolean
  capitalize?: boolean
  onPress?: () => void
  onLongPress?: () => void
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
  fontFamily = 'Montserrat-Regular',
  numberOfLines,
  textAlign = 'left',
  underline = false,
  capitalize = false,
  onPress = null,
  onLongPress = null,
  style = null,
  children,
}: ATextType) {
  const { colors } = useThemeColors();

  return (
    <Text
      onPress={onPress}
      onLongPress={onLongPress}
      numberOfLines={numberOfLines}
      style={{
        color: color || colors.text,
        lineHeight,
        fontSize,
        maxWidth,
        textAlign,
        fontFamily: bold ? 'Montserrat-Bold' : fontFamily,
        paddingHorizontal: px,
        paddingVertical: py,
        textDecorationLine: underline ? 'underline' : 'none',
        textTransform: capitalize ? 'capitalize' : 'none',
        ...style,
      }}
    >
      {children}
    </Text>
  );
}
