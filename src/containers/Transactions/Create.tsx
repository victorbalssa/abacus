import React, { FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CommonActions } from '@react-navigation/native';

import Layout from '../../components/Transactions/Create';
import { RootDispatch, RootState } from '../../store';
import { ContainerPropType } from '../types';

const Create: FC = ({ navigation }: ContainerPropType) => {
  const { loading } = useSelector((state: RootState) => state.loading.models.transactions);
  const accounts = useSelector((state: RootState) => state.accounts.autocompleteAccounts);
  const descriptions = useSelector((state: RootState) => state.accounts.autocompleteDescriptions);
  const { loading: loadingAutocomplete } = useSelector((state: RootState) => state.loading.effects.accounts.getAutocompleteAccounts);
  const dispatch = useDispatch<RootDispatch>();

  const goToTransactions = () => {
    dispatch.transactions.getTransactions({ endReached: false });
    navigation.dispatch(
      CommonActions.navigate({
        name: 'Transactions',
      }),
    );
  };

  return (
    <Layout
      navigation={navigation}
      loading={loading}
      loadingAutocomplete={loadingAutocomplete}
      accounts={accounts}
      descriptions={descriptions}
      goToTransactions={goToTransactions}
      getAutocompleteAccounts={dispatch.accounts.getAutocompleteAccounts}
      getAutocompleteDescription={dispatch.accounts.getAutocompleteDescriptions}
      submit={dispatch.transactions.createTransactions}
    />
  );
};

export default Create;
