import React, { FC, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CommonActions } from '@react-navigation/native';

import Layout from '../../components/Transactions/List';
import { RootDispatch, RootState } from '../../store';
import { ContainerPropType } from '../types';

const List: FC = ({ navigation }: ContainerPropType) => {
  const { loading: loadingRefresh } = useSelector((state: RootState) => state.loading.effects.transactions.getTransactions);
  const { loading: loadingMore } = useSelector((state: RootState) => state.loading.effects.transactions?.getMoreTransactions || { loading: false });
  const { loading: loadingDelete } = useSelector((state: RootState) => state.loading.effects.transactions.deleteTransaction);
  const transactions = useSelector((state: RootState) => state.transactions.transactions);
  const dispatch = useDispatch<RootDispatch>();

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
      dispatch.transactions.getTransactions();
    } catch (e) {
      console.error(e);
    }
  };

  const onDeleteTransaction = async (id) => {
    try {
      await dispatch.transactions.deleteTransaction(id);
    } catch (e) {
      console.error(e);
    }
  };

  const onEndReached = () => {
    try {
      dispatch.transactions.getMoreTransactions();
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    (async () => onRefresh())();
  }, []);

  return (
    <Layout
      loadingRefresh={loadingRefresh}
      loadingMore={loadingMore}
      loadingDelete={loadingDelete}
      transactions={transactions}
      onRefresh={onRefresh}
      onDeleteTransaction={onDeleteTransaction}
      onEndReached={onEndReached}
      onPressItem={goToEdit}
    />
  );
};

export default List;
