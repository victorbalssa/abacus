import React, { useEffect } from 'react';
import Animated, { FadeInDown, FadeOutDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { CommonActions, useNavigation } from '@react-navigation/native';
import { AStack, AText } from './ALibrary';
import { useThemeColors } from '../../lib/common';

type ToastMessagePropType = {
  id: string
  type: 'success' | 'error' | 'info' | 'warning'
  title: string
  description: string
  onUnmount: (id: string) => void
}

function ToastMessage({
  id,
  type,
  title,
  description,
  onUnmount,
}: ToastMessagePropType) {
  const { colors } = useThemeColors();
  const navigation = useNavigation();

  useEffect(() => {
    const timer = setTimeout(() => {
      onUnmount(id);
    }, 4000); // Toast will automatically unmount after 4 seconds

    return () => clearTimeout(timer);
  }, [id, onUnmount]);

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

  const { backgroundColor } = TOAST_TYPE[type];
  const { icon } = TOAST_TYPE[type];

  const goToTransactions = async () => {
    navigation.dispatch(
      CommonActions.navigate('Transactions', {
        screen: 'TransactionsScreen',
        merge: true,
        params: {
          forceRefresh: true,
        },
      }),
    );
  };

  return (
    <Animated.View
      style={{
        zIndex: 9999,
        position: 'absolute',
        bottom: 100,
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
      entering={FadeInDown}
      exiting={FadeOutDown.duration(500)}
    >
      <Ionicons name={icon} size={22} color="#FFF" style={{ padding: 7, borderRadius: 5 }} />
      <AStack alignItems="flex-start" justifyContent="flex-start" style={{ marginLeft: 8, flex: 1 }}>
        <AText color="white" fontSize={18} bold>{title}</AText>
        <AText color="white" fontSize={15} onPress={type === 'success' ? goToTransactions : null}>{description}</AText>
      </AStack>
      <Ionicons name="close-circle" size={22} color="#FFF" style={{ padding: 7, borderRadius: 5 }} onPress={() => onUnmount(id)} />
    </Animated.View>
  );
}

export default ToastMessage;
