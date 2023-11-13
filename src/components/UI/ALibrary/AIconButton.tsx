import React from 'react';
import { Pressable } from 'react-native';
import { useThemeColors } from '../../../lib/common';

type AIconButtonType = {
  icon: React.ReactNode
  px?: number
  py?: number
  borderWidth?: number
  onPress: () => void,
  style?: StyleSheet
}

export default function AIconButton({
  icon,
  onPress,
  px = 0,
  py = 0,
  borderWidth = 0,
  style = null,
}: AIconButtonType) {
  const { colors } = useThemeColors();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        width: 40,
        height: 40,
        borderWidth,
        borderRadius: 10,
        backgroundColor: pressed ? 'rgba(0,0,0,0.13)' : 'transparent',
        paddingHorizontal: px,
        paddingVertical: py,
        justifyContent: 'center',
        alignItems: 'center',
        ...style,
      })}
    >
      {icon}
    </Pressable>
  );
}
