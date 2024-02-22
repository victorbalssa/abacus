import React from 'react';
import {
  FlexAlignType,
  SafeAreaView,
} from 'react-native';
import { AStyle } from './types';

type AStackFlexType = {
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

export default function AStackFlex({
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
}: AStackFlexType) {
  return (
    <SafeAreaView
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
    </SafeAreaView>
  );
}
