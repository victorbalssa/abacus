import React from 'react';
import { Text } from 'react-native';
import { useThemeColors } from '../../../lib/common';
import { AStyle } from './types';

type ALabelType = {
  fontSize?: number
  lineHeight?: number
  maxWidth?: number | '100%' | '90%' | '80%' | '70%' | '60%' | '50%' | '40%' | '30%'
  numberOfLines?: number
  isRequired?: boolean
  textAlign?: 'center' | 'left' | 'right'
  underline?: boolean
  onPress?: () => void
  style?: AStyle
  children: React.ReactNode
  testID?: string
}

export default function ALabel({
  children,
  lineHeight,
  maxWidth,
  fontSize = 14,
  numberOfLines,
  isRequired = false,
  textAlign = 'left',
  underline = false,
  onPress = null,
  style = null,
  testID = null,
}: ALabelType) {
  const { colors } = useThemeColors();

  return (
    <Text
      testID={testID}
      onPress={onPress}
      numberOfLines={numberOfLines}
      style={{
        color: colors.greyLight,
        lineHeight,
        fontSize,
        maxWidth,
        textAlign,
        fontFamily: 'Montserrat_Bold',
        paddingHorizontal: 2,
        paddingBottom: 2,
        textDecorationLine: underline ? 'underline' : 'none',
        ...style,
      }}
    >
      {children}
      {isRequired && (
      <Text style={{ color: colors.red }}>
        {' '}
        *
      </Text>
      )}
    </Text>
  );
}
