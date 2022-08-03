import React from 'react';
import { connect } from 'react-redux';
import { CommonActions } from '@react-navigation/native';
import Layout from '../../native/components/Transactions/Edit';
import { Dispatch, RootState } from '../../store';

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
  getTransactions: dispatch.transactions.getTransactions,
});

const Edit = ({
  loading,
  navigation,
  route,
  accounts,
  getAutocompleteAccounts,
  loadingAutocomplete,
  updateTransactions,
  getTransactions,
}) => {
  const { payload } = route.params;

  const onEdit = async (transaction) => {
    const { id } = route.params;

    await updateTransactions({ id, transaction });
  };

  const fetchTransactions = async () => {
    try {
      await getTransactions({ endReached: false });
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
    <Layout
      loading={loading}
      payload={payload}
      submit={onEdit}
      goToTransactions={goToTransactions}
      getAutocompleteAccounts={getAutocompleteAccounts}
      loadingAutocomplete={loadingAutocomplete}
      accounts={accounts}
      navigation={navigation}
    />
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Edit);
