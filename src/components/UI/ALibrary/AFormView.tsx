import React from 'react';
import { View } from 'react-native';
import { AStyle } from './types';

type AFormViewType = {
  mx?: number
  style?: AStyle
  children?: React.ReactNode
}

export default function AFormView({
  mx = 10,
  style = null,
  children = null,
}: AFormViewType) {
  return (
    <View
      style={{
        marginTop: 10,
        marginHorizontal: mx,
        ...style,
      }}
    >
      {children}
    </View>
  );
}
