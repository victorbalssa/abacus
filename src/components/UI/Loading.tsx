import React from 'react';
import { View, ActivityIndicator } from 'react-native';

import { useThemeColors } from '../../lib/common';

export default function Loading() {
  const { colors } = useThemeColors();

  return (
    <View
      style={{
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
      }}
    >
      <ActivityIndicator size="small" color={colors.text} />
    </View>
  );
}
