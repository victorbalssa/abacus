import React from 'react';
import {
  ScrollView,
  KeyboardAvoidingView,
} from 'native-base';

import Title from '../UI/Title';
import TransactionForm from './Form';

const Edit = ({
  loading,
  payload,
  accounts,
  categories,
  budgets,
  descriptions,
  onEdit,
  getAutocompleteAccounts,
  getAutocompleteDescription,
  getAutocompleteCategories,
  getAutocompleteBudgets,
  navigation,
  goToTransactions,
}) => (
  <>
    <Title navigation={navigation} text={payload.description} />
    <KeyboardAvoidingView
      h={{
        base: '100%',
        lg: 'auto',
      }}
      behavior="padding"
    >
      <ScrollView flex={1} p={1} keyboardShouldPersistTaps="handled">
        <TransactionForm
          payload={payload}
          loading={loading}
          accounts={accounts}
          categories={categories}
          budgets={budgets}
          descriptions={descriptions}
          goToTransactions={goToTransactions}
          getAutocompleteAccounts={getAutocompleteAccounts}
          getAutocompleteDescription={getAutocompleteDescription}
          getAutocompleteCategories={getAutocompleteCategories}
          getAutocompleteBudgets={getAutocompleteBudgets}
          submit={onEdit}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  </>
);

export default Edit;
