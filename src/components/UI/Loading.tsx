import React from 'react';
import { View, ActivityIndicator } from 'react-native';

const Loading = () => (
  <View
    style={{
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'center',
    }}
  >
    <ActivityIndicator size="small" />
  </View>
);

export default Loading;
