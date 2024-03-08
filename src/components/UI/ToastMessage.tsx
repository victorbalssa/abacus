import React, { useState, forwardRef, useImperativeHandle } from 'react';
import Animated, { FadeInUp, FadeOutUp } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { AStack, AText } from './ALibrary';
import { useThemeColors } from '../../lib/common';

type ToastMessagePropType = {
  type: 'success' | 'error' | 'info' | 'warning'
  title: string
  description: string
  onPress?: () => void
  timeout?: number
}

function ToastMessage({
  type,
  title,
  description,
  onPress = () => {},
  timeout = 1000,
}: ToastMessagePropType, ref) {
  const { colors } = useThemeColors();
  const [isVisible, setIsVisible] = useState(false);

  const TOAST_TYPE = {
    success: {
      backgroundColor: colors.green,
      icon: 'checkmark-circle',
    },
    error: {
      backgroundColor: colors.red,
      icon: 'alert-circle',
    },
  };

  const showToast = () => {
    setIsVisible(true);
    const timer = setTimeout(() => {
      setIsVisible(false);
      clearTimeout(timer);
    }, timeout);
  };

  useImperativeHandle(ref, () => ({
    show: showToast,
  }));

  const { backgroundColor } = TOAST_TYPE[type];
  const { icon } = TOAST_TYPE[type];

  return isVisible && (
  <Animated.View
    style={{
      position: 'absolute',
      bottom: 70,
      left: 0,
      right: 0,
      height: 70,
      marginHorizontal: 12,
      backgroundColor,
      borderRadius: 10,
      padding: 5,
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'flex-start',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    }}
    entering={FadeInUp}
    exiting={FadeOutUp}
  >
    <Ionicons name={icon} size={22} color="#FFF" style={{ margin: 5 }} />
    <AStack alignItems="flex-start" justifyContent="flex-start" style={{ marginLeft: 8, flex: 1 }}>
      <AText fontSize={18} bold>{title}</AText>
      <AText fontSize={15} onPress={onPress}>{description}</AText>
    </AStack>
    <Ionicons name="close-circle" size={22} color="#FFF" style={{ margin: 5 }} onPress={() => setIsVisible(false)} />
  </Animated.View>
  );
}

export default forwardRef(ToastMessage);
