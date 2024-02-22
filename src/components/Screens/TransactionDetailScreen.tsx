import React from 'react';

import { ScreenType } from '../../types/screen';
import TransactionForm from '../Forms/TransactionForm';

export default function TransactionDetailScreen({ navigation, route }: ScreenType) {
  const {
    params: {
      id,
      payload: {
        groupTitle,
        splits,
      },
    },
  } = route;

  return (
    <TransactionForm
      navigation={navigation}
      splits={splits}
      title={groupTitle}
      id={id}
    />
  );
}
