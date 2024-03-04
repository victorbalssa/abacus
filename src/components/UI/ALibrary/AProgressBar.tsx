import React from 'react';
import { View } from 'react-native';
import { AStyle } from './types';
import {useThemeColors} from "../../../lib/common";

type AProgressBarType = {
  value: number
  color?: string
  style?: AStyle
}

export default function AProgressBar({
  value,
  color = 'black',
  style = null,
}: AProgressBarType) {
  const { colors } = useThemeColors();

  return (
    <View
      style={{
        width: '100%',
        height: 4,
        borderRadius: 5,
        overflow: 'hidden',
        borderColor: colors.listBorderColor,
        borderWidth: 0.5,
        ...style,
      }}
    >
      <View
        style={{
          height: '100%',
          width: `${value > 100 ? 100 : value}%`,
          borderRadius: 5,
          backgroundColor: color,
        }}
      />
    </View>
  );
}
