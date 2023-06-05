import React, { FC } from 'react';
import { useDispatch } from 'react-redux';
import { CommonActions } from '@react-navigation/native';

import Layout from '../../components/Transactions/Edit';
import { RootDispatch } from '../../store';
import { ContainerPropType } from '../types';

const Edit: FC = ({ navigation, route }: ContainerPropType) => {
  const dispatch = useDispatch<RootDispatch>();

  const { payload } = route.params;

  const onEdit = async (transaction) => {
    const { id } = route.params;

    await dispatch.transactions.updateTransactions({ id, transaction });
  };

  const fetchTransactions = async () => {
    try {
      await dispatch.transactions.getTransactions();
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
      navigation={navigation}
      payload={payload}
      goToTransactions={goToTransactions}
      onEdit={onEdit}
    />
  );
};

export default Edit;
