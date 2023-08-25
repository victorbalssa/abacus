import React from 'react';
import { ScrollView } from 'react-native';

import TransactionForm from '../Forms/TransactionForm';
import { ScreenType } from './types';

export default function TransactionDetailScreen({ navigation, route }: ScreenType) {
  const { payload } = route.params;

  return (
    <ScrollView
      style={{
        padding: 7,
      }}
      keyboardShouldPersistTaps="handled"
      contentInsetAdjustmentBehavior="automatic"
    >
      <TransactionForm
        navigation={navigation}
        splits={payload?.splits}
        title={payload?.groupTitle}
        id={route.params.id}
      />
    </ScrollView>
  );
}
