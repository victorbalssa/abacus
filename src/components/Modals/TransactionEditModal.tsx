import React from 'react';
import {
  ScrollView,
  KeyboardAvoidingView,
} from 'native-base';
import { Platform } from 'react-native';
import { useDispatch } from 'react-redux';
import { CommonActions } from '@react-navigation/native';

import Title from '../UI/Title';
import TransactionForm from '../Forms/TransactionForm';
import { useThemeColors } from '../../lib/common';
import translate from '../../i18n/locale';
import { RootDispatch } from '../../store';
import { ScreenType } from '../Screens/types';

export default function TransactionEditModal({ navigation, route }: ScreenType) {
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
      <ScrollView flex={1} p={1} keyboardShouldPersistTaps="handled">
        <TransactionForm
          payload={payload}
          goToTransactions={goToTransactions}
          submit={onEdit}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
