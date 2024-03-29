import React from 'react';
import {
  FlexAlignType,
  SafeAreaView,
} from 'react-native';
import { AStyle } from './types';

type AStackType = {
  px?: number
  py?: number
  mx?: number
  my?: number
  row?: boolean
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
  row = false,
  justifyContent = 'center',
  alignItems = 'center',
  backgroundColor = 'transparent',
  flexWrap = 'nowrap',
  style = {},
  children,
}: AStackType) {
  return (
    <SafeAreaView
      style={{
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
    </SafeAreaView>
  );
}
