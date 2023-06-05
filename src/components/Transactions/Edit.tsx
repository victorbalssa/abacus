import React from 'react';
import {
  ScrollView,
  KeyboardAvoidingView,
} from 'native-base';

import { Platform } from 'react-native';
import Title from '../UI/Title';
import TransactionForm from './Form';
import { useThemeColors } from '../../lib/common';
import { translate } from '../../i18n/locale';

const Edit = ({
  payload,
  onEdit,
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
      <Title navigation={navigation} text={translate('transaction_screen_edit_title')} />
      <ScrollView flex={1} p={1} keyboardShouldPersistTaps="handled">
        <TransactionForm
          payload={payload}
          goToTransactions={goToTransactions}
          submit={onEdit}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Edit;
