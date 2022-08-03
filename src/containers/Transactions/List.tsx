import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { useToast } from 'native-base';
import { CommonActions } from '@react-navigation/native';
import Layout from '../../native/components/Transactions/List';
import { Dispatch, RootState } from '../../store';

const mapStateToProps = (state: RootState) => ({
  loading: state.loading.models.transactions,
  transactions: state.transactions.transactions,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  getTransactions: dispatch.transactions.getTransactions,
  deleteTransaction: dispatch.transactions.deleteTransaction,
});

const List = ({
  loading,
  navigation,
  transactions,
  getTransactions,
  deleteTransaction,
}) => {
  const toast = useToast();

  // TODO: do not pass entire payload into this modal
  const goToEdit = (id, payload) => navigation.dispatch(
    CommonActions.navigate({
      name: 'TransactionsEditModal',
      params: {
        id,
        payload,
      },
    }),
  );

  const onRefresh = () => {
    try {
      getTransactions({ endReached: false });
    } catch (e) {
      console.error(e);
      toast.show({
        placement: 'top',
        title: 'Something went wrong',
        description: e.message,
      });
    }
  };

  const onDeleteTransaction = async (id) => {
    try {
      await deleteTransaction({ id });
    } catch (e) {
      console.error(e);
      toast.show({
        placement: 'top',
        title: 'Something went wrong',
        description: e.message,
      });
    }
  };

  const onEndReached = () => {
    try {
      getTransactions({ endReached: true });
    } catch (e) {
      console.error(e);
      toast.show({
        placement: 'top',
        title: 'Something went wrong',
        description: e.message,
      });
    }
  };

  useEffect(() => {
    (async () => onRefresh())();
  }, []);

  return (
    <Layout
      loading={loading}
      transactions={transactions}
      onRefresh={onRefresh}
      onDeleteTransaction={onDeleteTransaction}
      onEndReached={onEndReached}
      onPressItem={goToEdit}
    />
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(List);
