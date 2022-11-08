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
  categories,
  budgets,
  descriptions,
  submit,
  getAutocompleteAccounts,
  getAutocompleteDescription,
  getAutocompleteCategories,
  getAutocompleteBudgets,
  loadingAutocomplete,
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
          loadingAutocomplete={loadingAutocomplete}
          submit={submit}
          goToTransactions={goToTransactions}
          payload={{
            description: '',
            date: new Date(),
            source_name: '',
            destination_name: '',
            type: 'withdrawal',
          }}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  </>
);

export default Create;
