import React from 'react';
import { ActivityIndicator, Pressable } from 'react-native';
import { AStyle } from './types';
import { useThemeColors } from '../../../lib/common';

interface AButtonType {
  type?: 'primary' | 'secondary' | 'danger' | 'success' | 'warning' | 'info' | 'light' | 'dark' | 'transparent'
  style?: AStyle
  disabled?: boolean
  disabledTint?: boolean
  children?: React.ReactNode
  onPress: () => void
  mx?: number
  px?: number
  loading?: boolean
  testID?: string
}

export default function AButton({
  type = 'info',
  onPress,
  mx = 0,
  px = 0,
  disabled = false,
  disabledTint = false,
  loading = false,
  style = null,
  children = null,
  testID = null,
}: AButtonType) {
  const { colors } = useThemeColors();
  const backgroundColor = colors[type];

  return (
    <Pressable
      testID={testID}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => ({
        opacity: disabled && disabledTint ? 0.3 : 1,
        backgroundColor: pressed ? colors.filterBorderColor : backgroundColor,
        borderRadius: 10,
        marginBottom: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 75,
        marginHorizontal: mx,
        paddingHorizontal: px,
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 1,
        },
        shadowOpacity: 0.25,
        shadowRadius: 2.84,
        elevation: 2,
        ...style,
      })}
    >
      {loading ? <ActivityIndicator size="small" color={colors.text} /> : children}
    </Pressable>
  );
}
