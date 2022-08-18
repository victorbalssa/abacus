import React from 'react';
import {
  ScrollView,
  KeyboardAvoidingView,
} from 'native-base';

import Title from '../UI/Title';
import TransactionForm from './Form';

const Create = ({
  loading,
  accounts,
  descriptions,
  submit,
  getAutocompleteAccounts,
  getAutocompleteDescription,
  loadingAutocomplete,
  navigation,
  goToTransactions,
}) => (
  <>
    <Title navigation={navigation} text="New Transaction" />
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
          descriptions={descriptions}
          getAutocompleteAccounts={getAutocompleteAccounts}
          getAutocompleteDescription={getAutocompleteDescription}
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
