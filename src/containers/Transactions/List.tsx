import React, { FC, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useToast } from 'native-base';
import { CommonActions } from '@react-navigation/native';
import Layout from '../../components/Transactions/List';
import { RootDispatch, RootState } from '../../store';
import { ContainerPropType } from '../types';

const List: FC = ({ navigation }: ContainerPropType) => {
  const toast = useToast();
  const loading = useSelector((state: RootState) => state.loading.models.transactions);
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
      dispatch.transactions.getTransactions({ endReached: false });
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
      await dispatch.transactions.deleteTransaction({ id });
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
      dispatch.transactions.getTransactions({ endReached: true });
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

export default List;
