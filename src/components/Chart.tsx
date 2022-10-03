import React from 'react';
import {
  ScrollView,
} from 'native-base';
import { View } from 'react-native';
import Animated, { Layout } from 'react-native-reanimated';
import AssetsHistoryChart from './Charts/AssetsHistoryChart';
import RangeTitle from './UI/RangeTitle';

const Chart = ({
  loading,
  accounts,
  fetchData,
  filterData,
  start,
  end,
  backendURL,
}) => (
  <>
    <RangeTitle />
    <Animated.View style={{ flex: 1 }} layout={Layout}>
      <ScrollView
        p={2}
        bounces={false}
      >
        <AssetsHistoryChart
          loading={loading}
          fetchData={fetchData}
          start={start}
          end={end}
          accounts={accounts}
          filterData={filterData}
          backendURL={backendURL}
        />
        <View style={{ height: 120 }} />
      </ScrollView>
    </Animated.View>
  </>
);

export default Chart;
