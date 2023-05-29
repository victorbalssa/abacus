import React from 'react';
import {
  ScrollView,
  KeyboardAvoidingView,
} from 'native-base';

import Title from '../UI/Title';
import TransactionForm from './Form';

import { translate } from '../../i18n/locale';

const Create = ({
  loading,
  accounts,
  payload,
  categories,
  budgets,
  descriptions,
  submit,
  getAutocompleteAccounts,
  getAutocompleteDescription,
  getAutocompleteCategories,
  getAutocompleteBudgets,
  navigation,
  goToTransactions,
}) => (
  <>
    <Title navigation={navigation} text={translate('transaction_screen_title')} />
    <KeyboardAvoidingView
      h={{
        base: '100%',
        lg: 'auto',
      }}
      behavior="padding"
    >
      <ScrollView flex={1} p={1} keyboardShouldPersistTaps="handled">
        <TransactionForm
          loading={loading}
          accounts={accounts}
          categories={categories}
          budgets={budgets}
          descriptions={descriptions}
          getAutocompleteAccounts={getAutocompleteAccounts}
          getAutocompleteDescription={getAutocompleteDescription}
          getAutocompleteCategories={getAutocompleteCategories}
          getAutocompleteBudgets={getAutocompleteBudgets}
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
  </>
);

export default Create;
