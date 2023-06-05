import React, { FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CommonActions } from '@react-navigation/native';

import Layout from '../../components/Transactions/List';
import { RootDispatch, RootState } from '../../store';
import { ContainerPropType } from '../types';

const List: FC = ({ navigation }: ContainerPropType) => {
  const { loading: loadingRefresh } = useSelector((state: RootState) => state.loading.effects.transactions.getTransactions);
  const { loading: loadingMore } = useSelector((state: RootState) => state.loading.effects.transactions?.getMoreTransactions);
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

  // TODO: do not pass entire payload into this modal
  const goToDuplicate = (payload) => navigation.dispatch(
    CommonActions.navigate({
      name: 'TransactionsCreateModal',
      params: {
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

  return (
    <Layout
      loadingRefresh={loadingRefresh}
      loadingMore={loadingMore}
      onRefresh={onRefresh}
      onDeleteTransaction={onDeleteTransaction}
      onEndReached={onEndReached}
      onPressItem={goToEdit}
      onLongPressItem={goToDuplicate}
    />
  );
};

export default List;
