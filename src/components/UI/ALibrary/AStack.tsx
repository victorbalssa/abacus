import React from 'react';
import { FlexAlignType, View } from 'react-native';

type AStackType = {
  px?: number
  py?: number
  row?: boolean
  justifyContent?: 'center' | 'flex-start' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly'
  alignItems?: FlexAlignType
  style?: StyleSheet
  children: React.ReactNode
}

export default function AStack({
  px = 0,
  py = 0,
  row = false,
  justifyContent = 'center',
  alignItems = 'center',
  style = null,
  children,
}: AStackType) {
  return (
    <View
      style={{
        flex: 1,
        flexDirection: row ? 'row' : 'column',
        justifyContent,
        alignItems,
        paddingHorizontal: px,
        paddingVertical: py,
        ...style,
      }}
    >
      {children}
    </View>
  );
}
