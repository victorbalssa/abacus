import React from 'react';
import { ScrollView } from 'native-base';

import { ScreenType } from './types';
import TransactionForm from '../Forms/TransactionForm';

export default function TransactionCreateScreen({ navigation, route }: ScreenType) {
  const { params } = route;
  const payload = params?.payload;

  return (
    <ScrollView
      style={{
        padding: 7,
      }}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      contentInsetAdjustmentBehavior="automatic"
    >
      <TransactionForm
        navigation={navigation}
        splits={payload}
      />
    </ScrollView>
  );
}
