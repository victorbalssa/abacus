import React from 'react';
import { View } from 'react-native';

import { ScreenType } from './types';
import Filters from '../UI/Filters';

export default function TransactionCreateScreen({ navigation, route }: ScreenType) {
  return (
    <View>
      <Filters />
    </View>
  );
}
