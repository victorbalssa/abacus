import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { useToast } from 'native-base';

import { CommonActions } from '@react-navigation/native';
import Layout from '../native/components/Create';
import { Dispatch, RootState } from '../store';

const mapStateToProps = (state: RootState) => ({
  loading: state.loading.models.transactions,
  accounts: state.accounts.autocompleteAccounts,
  loadingAutocomplete: state.loading.effects.accounts.getAutocompleteAccounts,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  getTransactions: dispatch.transactions.getTransactions,
  getAutocompleteAccounts: dispatch.accounts.getAutocompleteAccounts,
  getBudgets: dispatch.budgets.getBudgets,
  getCategories: dispatch.categories.getCategories,
  getCurrencies: dispatch.currencies.getCurrencies,
  createTransactions: dispatch.transactions.createTransactions,
});

interface CreateContainerType extends
  ReturnType<typeof mapStateToProps>,
  ReturnType<typeof mapDispatchToProps> {
  loading: boolean,
  navigation: { dispatch: (action) => void },
}

const Create = ({
  loading,
  navigation,
  accounts,
  getTransactions,
  getAutocompleteAccounts,
  loadingAutocomplete,
  getBudgets,
  getCategories,
  getCurrencies,
  createTransactions,
}: CreateContainerType) => {
  const toast = useToast();

  const fetchData = async () => {
    try {
      await Promise.all([
        getBudgets(),
        getCategories(),
        getCurrencies(),
      ]);
    } catch (e) {
      toast.show({
        placement: 'top',
        title: 'Something went wrong',
        description: e.message,
      });
    }
  };

  const fetchTransactions = async () => {
    try {
      await getTransactions({ endReached: false });
    } catch (e) {
      toast.show({
        placement: 'top',
        title: 'Something went wrong',
        description: e.message,
      });
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

  useEffect(() => {
    (async () => fetchData())();
  }, []);

  return (
    <Layout
      loading={loading}
      accounts={accounts}
      goToTransactions={goToTransactions}
      getAutocompleteAccounts={getAutocompleteAccounts}
      loadingAutocomplete={loadingAutocomplete}
      submit={createTransactions}
      navigation={navigation}
    />
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Create);
