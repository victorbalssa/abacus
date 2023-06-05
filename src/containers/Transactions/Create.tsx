import React, { FC } from 'react';
import { useDispatch } from 'react-redux';
import { CommonActions } from '@react-navigation/native';

import Layout from '../../components/Transactions/Create';
import { RootDispatch } from '../../store';
import { ContainerPropType } from '../types';

const Create: FC = ({ navigation, route }: ContainerPropType) => {
  const dispatch = useDispatch<RootDispatch>();

  const { params } = route;

  const goToTransactions = () => {
    dispatch.transactions.getTransactions();
    navigation.dispatch(
      CommonActions.navigate({
        name: 'Transactions',
      }),
    );
  };

  return (
    <Layout
      payload={params?.payload || {}}
      navigation={navigation}
      goToTransactions={goToTransactions}
      submit={dispatch.transactions.createTransactions}
    />
  );
};

export default Create;
