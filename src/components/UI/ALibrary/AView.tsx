import React from 'react';
import { View } from 'react-native';
import { AStyle } from './AStack';

type AViewType = {
  style?: AStyle
  children?: React.ReactNode
}

export default function AView({
  style = null,
  children = null,
}: AViewType) {
  return (
    <View
      style={{
        ...style,
      }}
    >
      {children}
    </View>
  );
}
