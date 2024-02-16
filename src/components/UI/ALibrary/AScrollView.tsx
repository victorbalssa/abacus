import React from 'react';
import { ScrollView } from 'react-native';
import { AStyle } from './types';

type AScrollViewType = {
  bounces?: boolean
  showsVerticalScrollIndicator?: boolean
  style?: AStyle
  children?: React.ReactNode
}

export default function AScrollView({
  bounces = true,
  showsVerticalScrollIndicator = true,
  style = null,
  children = null,
}: AScrollViewType) {
  return (
    <ScrollView
      bounces={bounces}
      showsVerticalScrollIndicator={showsVerticalScrollIndicator}
      contentContainerStyle={style}
    >
      {children}
    </ScrollView>
  );
}
