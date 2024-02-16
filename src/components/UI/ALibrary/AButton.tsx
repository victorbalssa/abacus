import React from 'react';
import { Pressable } from 'react-native';
import { AStyle } from './AStack';
import { useThemeColors } from '../../../lib/common';

interface AButtonType {
  style?: AStyle
  disabled?: boolean
  children?: React.ReactNode
  onPress: () => void
  mx?: number
  px?: number
}

export default function AButton({
  onPress,
  mx = 0,
  px = 0,
  disabled = false,
  style = null,
  children = null,
}: AButtonType) {
  const { colors } = useThemeColors();

  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => ({
        backgroundColor: pressed ? colors.filterBorderColor : colors.tileBackgroundColor,
        borderRadius: 10,
        marginBottom: 10,
        flexDirection: 'row',
        alignItems: 'center',
        height: 75,
        marginHorizontal: mx,
        paddingHorizontal: px,
        ...style,
      })}
    >
      {children}
    </Pressable>
  );
}
