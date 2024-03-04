import React, { useState, forwardRef, useImperativeHandle } from 'react';
import Animated, { FadeInUp, FadeOutUp } from 'react-native-reanimated';
import { FontAwesome5 } from '@expo/vector-icons';
import { AText, AView } from './ALibrary';
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
      icon: 'check-circle',
    },
    error: {
      backgroundColor: colors.red,
      icon: 'exclamation-circle',
    },
    info: {
      backgroundColor: colors.blue,
      icon: 'info-circle',
    },
    warning: {
      backgroundColor: '#f39c12',
      icon: 'exclamation-triangle',
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
      top: 50,
      width: '100%',
      height: 80,
      backgroundColor,
      borderRadius: 10,
      padding: 12,
      flexDirection: 'row',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    }}
    entering={FadeInUp.delay(200)}
    exiting={FadeOutUp}
  >
    <FontAwesome5 name={icon} size={20} color="#FFF" />
    <AView style={{ marginLeft: 12 }}>
      <AText fontSize={18} bold>{title}</AText>
      <AText fontSize={15} onPress={onPress}>{description}</AText>
    </AView>
  </Animated.View>
  );
}

export default forwardRef(ToastMessage);
