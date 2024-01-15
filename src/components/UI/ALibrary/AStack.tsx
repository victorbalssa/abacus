import React from 'react';
import {
  FlexAlignType,
  View,
} from 'react-native';

export type AStyle = {
  height?: number
  width?: number | '100%'
  margin?: number
  padding?: number
  top?: number
  left?: number
  right?: number
  bottom?: number
  position?: 'absolute' | 'relative'
  borderTopWidth?: number
  borderBottomWidth?: number
  borderColor?: string
  borderWidth?: number
  paddingTop?: number
  paddingBottom?: number
  paddingHorizontal?: number
  paddingVertical?: number
  backgroundColor?: string
}

type AStackType = {
  px?: number
  py?: number
  mx?: number
  my?: number
  row?: boolean
  flex?: number
  justifyContent?: 'center' | 'flex-start' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly'
  alignItems?: FlexAlignType
  backgroundColor?: string
  flexWrap?: 'wrap' | 'nowrap'
  style?: AStyle
  children: React.ReactNode
}

export default function AStack({
  px = 0,
  py = 0,
  mx = 0,
  my = 0,
  flex = 1,
  row = false,
  justifyContent = 'center',
  alignItems = 'center',
  backgroundColor = 'transparent',
  flexWrap = 'nowrap',
  style = {},
  children,
}: AStackType) {
  return (
    <View
      style={{
        flex,
        width: '100%',
        flexDirection: row ? 'row' : 'column',
        justifyContent,
        alignItems,
        backgroundColor,
        flexWrap,
        paddingHorizontal: px,
        paddingVertical: py,
        marginHorizontal: mx,
        marginVertical: my,
        ...style,
      }}
    >
      {children}
    </View>
  );
}
