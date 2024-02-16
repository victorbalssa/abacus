import React from 'react';
import { Pressable } from 'react-native';
import { AStyle } from './AStack';
import { useThemeColors } from '../../../lib/common';

type APressableType = {
  style?: AStyle
  disabled?: boolean
  children?: React.ReactNode
  onPress: () => void
  onLongPress?: () => void
}

export default function APressable({
  onPress,
  onLongPress,
  disabled = false,
  style = null,
  children = null,
}: APressableType) {
  const { colors } = useThemeColors();

  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      onLongPress={onLongPress}
      style={({ pressed }) => ({
        backgroundColor: pressed ? colors.listPressed : 'transparent',
        alignItems: 'center',
        flexDirection: 'row',
        ...style,
      })}
    >
      {children}
    </Pressable>
  );
}
