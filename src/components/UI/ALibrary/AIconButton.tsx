import React from 'react';
import { View, Pressable } from 'react-native';
import { AStyle } from './types';

type AIconButtonType = {
  icon: React.ReactNode
  px?: number
  py?: number
  borderWidth?: number
  borderColor?: string
  backgroundColor?: string
  onPress: () => void,
  style?: AStyle
  testID?: string
}

export default function AIconButton({
  icon,
  onPress,
  px = 0,
  py = 0,
  borderWidth = 0,
  borderColor = 'transparent',
  backgroundColor = 'transparent',
  style = null,
  testID = null,
}: AIconButtonType) {
  return (
    <View
      style={{
        backgroundColor,
        borderRadius: 10,
      }}
    >
      <Pressable
        testID={testID}
        onPress={onPress}
        style={({ pressed }) => ({
          width: 40,
          height: 40,
          borderWidth,
          borderColor,
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
    </View>
  );
}
