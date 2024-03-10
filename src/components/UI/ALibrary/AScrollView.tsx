import React, { ReactElement } from 'react';
import { RefreshControlProps, ScrollView } from 'react-native';
import { AStyle } from './types';

type AScrollViewType = {
  bounces?: boolean
  showsVerticalScrollIndicator?: boolean
  horizontal?: boolean
  style?: AStyle
  refreshControl?: ReactElement<RefreshControlProps, string>
  children?: React.ReactNode
}

export default function AScrollView({
  bounces = true,
  showsVerticalScrollIndicator = true,
  horizontal = false,
  style = null,
  refreshControl = null,
  children = null,
}: AScrollViewType) {
  return (
    <ScrollView
      horizontal={horizontal}
      bounces={bounces}
      showsVerticalScrollIndicator={showsVerticalScrollIndicator}
      contentContainerStyle={style}
      refreshControl={refreshControl}
    >
      {children}
    </ScrollView>
  );
}
