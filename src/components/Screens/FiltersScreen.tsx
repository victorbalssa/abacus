import React from 'react';
import { View } from 'react-native';

import Filters from '../UI/Filters';
import ErrorBoundary from '../UI/ErrorBoundary';

export default function FiltersScreen() {
  return (
    <ErrorBoundary>
      <View>
        <Filters />
      </View>
    </ErrorBoundary>
  );
}
