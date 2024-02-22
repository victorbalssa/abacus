import React from 'react';

import { ScreenType } from '../../types/screen';
import TransactionForm from '../Forms/TransactionForm';

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
    <TransactionForm
      navigation={navigation}
      splits={splits}
      title={groupTitle}
    />
  );
}
