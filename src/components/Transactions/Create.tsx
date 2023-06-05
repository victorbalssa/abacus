import React from 'react';
import {
  ScrollView,
  KeyboardAvoidingView,
} from 'native-base';

import { Platform } from 'react-native';
import Title from '../UI/Title';
import TransactionForm from './Form';

import { translate } from '../../i18n/locale';
import { useThemeColors } from '../../lib/common';

const Create = ({
  payload,
  submit,
  navigation,
  goToTransactions,
}) => {
  const { colors } = useThemeColors();

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
          submit={submit}
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
};

export default Create;
