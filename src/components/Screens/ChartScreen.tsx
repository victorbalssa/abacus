import React, { useCallback, useRef, useState } from 'react';
import { View } from 'react-native';
import { useFocusEffect, useScrollToTop } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ScrollView } from 'native-base';

import { RootDispatch, RootState } from '../../store';
import { useThemeColors } from '../../lib/common';
import AssetsHistoryChart from '../Charts/AssetsHistoryChart';
import BalanceHistoryChart from '../Charts/BalanceHistoryChart';
import TabControl from '../UI/TabControl';

export default function ChartScreen() {
  const { colors } = useThemeColors();
  const safeAreaInsets = useSafeAreaInsets();
  const [tab, setTab] = useState('assets_history_chart');

  const rangeDetails = useSelector((state: RootState) => state.firefly.rangeDetails);
  const { firefly: { getAccountChart, getBalanceChart } } = useDispatch<RootDispatch>();

  const prevFiltersRef = useRef<string>();
  const scrollRef = React.useRef(null);

  useScrollToTop(scrollRef);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const fetchData = async () => {
        try {
          if (isActive) {
            await Promise.all([getAccountChart(), getBalanceChart()]);
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
        <TabControl
          values={['assets_history_chart', 'balance_history_chart']}
          onChange={setTab}
        />

        {tab === 'assets_history_chart' && <AssetsHistoryChart />}
        {tab === 'balance_history_chart' && <BalanceHistoryChart />}

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}
