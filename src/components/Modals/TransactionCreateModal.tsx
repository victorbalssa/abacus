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

import translate from '../../i18n/locale';
import { useThemeColors } from '../../lib/common';
import { RootDispatch } from '../../store';
import { ScreenType } from '../Screens/types';

export default function TransactionCreateModal({ navigation, route }: ScreenType) {
  const { colors } = useThemeColors();
  const dispatch = useDispatch<RootDispatch>();

  const { params } = route;
  const payload = params?.payload || {};

  const goToTransactions = () => {
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
      <Title navigation={navigation} text={translate('transaction_screen_title')} />
      <ScrollView flex={1} p={1} keyboardShouldPersistTaps="handled">
        <TransactionForm
          submit={dispatch.transactions.createTransaction}
          goToTransactions={goToTransactions}
          payload={{
            description: payload.description || '',
            date: new Date(),
            source_name: payload.source_name || '',
            destination_name: payload.destination_name || '',
            category_name: payload.category_name || '',
            budget_name: payload.budget_name || '',
            amount: payload.amount || '',
            type: payload.type || 'withdrawal',
          }}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
