import React from 'react';

import { ScreenType } from '../../types/screen';
import TransactionForm from '../Forms/TransactionForm';
import ErrorWidget from '../UI/ErrorWidget';
import ErrorBoundary from '../UI/ErrorBoundary';

export default function TransactionCreateScreen({ navigation, route }: ScreenType) {
  const {
    params: {
      payload: {
        groupTitle,
        splits,
      } = {},
    } = {},
  } = route;

  return (
    <ErrorBoundary>
      <TransactionForm
        navigation={navigation}
        splits={splits}
        title={groupTitle}
      />
      <ErrorWidget />
    </ErrorBoundary>
  );
}
