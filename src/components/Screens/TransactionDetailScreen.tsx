import React from 'react';
import { Platform } from 'react-native';
import { KeyboardAvoidingView, ScrollView } from 'native-base';
import { useDispatch } from 'react-redux';
import { CommonActions } from '@react-navigation/native';

import { useThemeColors } from '../../lib/common';
import TransactionForm from '../Forms/TransactionForm';
import { ScreenType } from './types';
import { RootDispatch } from '../../store';

export default function TransactionDetailScreen({ navigation, route }: ScreenType) {
  const { colors } = useThemeColors();
  const dispatch = useDispatch<RootDispatch>();

  const { payload } = route.params;

  const onEdit = async (transaction) => {
    const { id } = route.params;

    await dispatch.transactions.updateTransaction({ id, transaction });
  };

  const fetchTransactions = async () => {
    try {
      await dispatch.transactions.getTransactions();
    } catch (e) {
      // catch 401
    }
  };

  const goToTransactions = async () => {
    await fetchTransactions();
    navigation.dispatch(
      CommonActions.navigate({
        name: 'Transactions',
      }),
    );
  };

  return (
    <KeyboardAvoidingView
      enabled
      h={{
        base: '100%',
        lg: 'auto',
      }}
      behavior={Platform.select({ ios: 'padding', android: null })}
      keyboardVerticalOffset={Platform.select({ ios: 0, android: 500 })}
      style={{
        flex: 1,
        backgroundColor: colors.backgroundColor,
      }}
    >
      <ScrollView
        p={1}
        flex={1}
        keyboardShouldPersistTaps="handled"
        contentInsetAdjustmentBehavior="automatic"
      >
        <TransactionForm
          payload={payload}
          goToTransactions={goToTransactions}
          submit={onEdit}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
