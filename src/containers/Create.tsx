import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { useToast } from 'native-base';

import Layout from '../native/components/Create';
import { Dispatch, RootState } from '../store';

const mapStateToProps = (state: RootState) => ({
  loading: state.loading.models.transactions,
  accounts: state.accounts.accounts,
  budgets: state.budgets.budgets,
  categories: state.categories.categories,
  currencies: state.currencies.currencies,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  getAccounts: dispatch.accounts.getAccounts,
  getBudgets: dispatch.budgets.getBudgets,
  getCategories: dispatch.categories.getCategories,
  getCurrencies: dispatch.currencies.getCurrencies,
  createTransactions: dispatch.transactions.createTransactions,
});

interface CreateContainerType extends
  ReturnType<typeof mapStateToProps>,
  ReturnType<typeof mapDispatchToProps> {
  loading: boolean,
}

const Create = ({
  loading,
  accounts,
  budgets,
  categories,
  currencies,
  getAccounts,
  getBudgets,
  getCategories,
  getCurrencies,
  createTransactions,
}: CreateContainerType) => {
  const toast = useToast();

  const fetchData = async () => {
    try {
      await Promise.all([
        getAccounts(),
        getBudgets(),
        getCategories(),
        getCurrencies(),
      ]);
    } catch (e) {
      toast.show({
        placement: 'top',
        title: 'Something went wrong',
        status: 'error',
        description: e.message,
      });
    }
  };

  const submit = async (payload) => {
    try {
      await createTransactions(payload);
      toast.show({
        placement: 'top',
        title: 'Success',
        status: 'success',
        variant: 'left-accent',
        description: 'Transaction created.',
      });
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

  useEffect(() => {
    (async () => fetchData())();
  }, []);

  return (
    <Layout
      loading={loading}
      accounts={accounts}
      budgets={budgets}
      categories={categories}
      currencies={currencies}
      submit={submit}
    />
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Create);
