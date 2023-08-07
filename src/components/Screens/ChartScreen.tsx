import React, { useCallback, useRef } from 'react';
import { View } from 'react-native';
import { useFocusEffect, useScrollToTop } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ScrollView } from 'native-base';

import { RootDispatch, RootState } from '../../store';
import { useThemeColors } from '../../lib/common';
import AssetsHistoryChart from '../Charts/AssetsHistoryChart';

export default function ChartScreen() {
  const { colors } = useThemeColors();
  const safeAreaInsets = useSafeAreaInsets();
  const loading = useSelector((state: RootState) => state.loading.effects.firefly.getAccountChart?.loading);
  const rangeDetails = useSelector((state: RootState) => state.firefly.rangeDetails);
  const accounts = useSelector((state: RootState) => state.firefly.accounts);
  const { firefly: { getAccountChart, filterData } } = useDispatch<RootDispatch>();

  const prevFiltersRef = useRef<string>();
  const scrollRef = React.useRef(null);

  useScrollToTop(scrollRef);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const fetchData = async () => {
        try {
          if (isActive) {
            getAccountChart();
          }
        } catch (e) {
          // catch error
        }
      };

      if (prevFiltersRef.current !== `${rangeDetails.start}-${rangeDetails.end}`) {
        fetchData();
        prevFiltersRef.current = `${rangeDetails.start}-${rangeDetails.end}`;
      }

      return () => {
        isActive = false;
      };
    }, [rangeDetails]),
  );

  return (
    <View
      style={{
        flex: 1,
        paddingTop: safeAreaInsets.top + 55,
        backgroundColor: colors.backgroundColor,
      }}
    >
      <ScrollView
        bounces={false}
        showsVerticalScrollIndicator={false}
      >
        <AssetsHistoryChart
          loading={loading}
          fetchData={getAccountChart}
          start={rangeDetails.start}
          end={rangeDetails.end}
          accounts={accounts}
          filterData={filterData}
        />
        <View style={{ height: 120 }} />
      </ScrollView>
    </View>
  );
}
