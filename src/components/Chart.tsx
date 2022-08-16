import React from 'react';
import {
  ScrollView,
} from 'native-base';
import { View } from 'react-native';
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
      <View style={{ height: 100 }} />
    </ScrollView>
  </>
);

export default Chart;
