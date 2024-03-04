import React from 'react';
import { View } from 'react-native';

type ASkeletonType = {
  loading?: boolean
  children?: React.ReactNode
}

export default function ASkeleton({
  loading = false,
  children = null,
}: ASkeletonType) {
  return (
    <View>
      {children}
      <View style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: loading ? 'rgba(143,143,143,1)' : 'transparent',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
      }}
      />
    </View>
  );
}
