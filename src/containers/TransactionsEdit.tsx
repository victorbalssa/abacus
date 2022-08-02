import React from 'react';
import { connect } from 'react-redux';
import { useToast } from 'native-base';
import Layout from '../native/components/Edit';
import { Dispatch, RootState } from '../store';

const mapStateToProps = (state: RootState) => ({
  loading: state.loading.models.transactions,
  budgets: state.budgets.budgets,
  categories: state.categories.categories,
  currencies: state.currencies.currencies,
  accounts: state.accounts.autocompleteAccounts,
  loadingAutocomplete: state.loading.effects.accounts.getAutocompleteAccounts,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  getAutocompleteAccounts: dispatch.accounts.getAutocompleteAccounts,
  updateTransactions: dispatch.transactions.updateTransactions,
  deleteTransaction: dispatch.transactions.deleteTransaction,
});

const TransactionsEdit = ({
  loading,
  navigation,
  route,
  accounts,
  getAutocompleteAccounts,
  loadingAutocomplete,
  updateTransactions,
  deleteTransaction,
}) => {
  const toast = useToast();
  const { payload } = route.params;

  const onDeleteTransaction = async (id) => {
    try {
      await deleteTransaction({ id });
    } catch (e) {
      console.error(e);
      toast.show({
        placement: 'top',
        title: 'Something went wrong',
        status: 'error',
        description: e.message,
      });
    }
  };

  const onEdit = async (transaction) => {
    const { id } = route.params;

    try {
      await updateTransactions({
        id,
        transaction,
      });
      toast.show({
        placement: 'top',
        title: 'Success',
        status: 'success',
        variant: 'left-accent',
        description: 'Transaction updated.',
        isClosable: true,
      });
      navigation.goBack();
    } catch (e) {
      if (e.response) {
        console.log(e.response.data);
        toast.show({
          placement: 'top',
          title: 'Something went wrong',
          status: 'error',
          description: e.response.data.message,
        });
      } else {
        toast.show({
          placement: 'top',
          title: 'Something went wrong',
          status: 'error',
          description: e.message,
        });
      }
    }
  };

  return (
    <Layout
      loading={loading}
      payload={payload}
      onDeleteTransaction={onDeleteTransaction}
      submit={onEdit}
      getAutocompleteAccounts={getAutocompleteAccounts}
      loadingAutocomplete={loadingAutocomplete}
      accounts={accounts}
      navigation={navigation}
    />
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(TransactionsEdit);
