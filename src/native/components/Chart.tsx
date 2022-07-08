import React from 'react';
import { RefreshControl, ViewStyle } from 'react-native';
import {
  Box,
  Icon,
  ScrollView, Text,
} from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import UIButton from './UI/UIButton';
import AssetsHistoryChart from './Charts/AssetsHistoryChart';
import RangeTitle from './UI/RangeTitle';
import colors from '../../constants/colors';

type ChartType = {
  dashboard: [],
  loading: boolean,
  fetchData: () => Promise<void>,
  start: string,
  end: string,
  filterData: () => Promise<void>,
}

const Chart = ({
  dashboard,
  loading,
  fetchData,
  filterData,
  start,
  end,
}: ChartType) => (
  <Box flex={1} marginLeft={3} marginRight={3} safeAreaTop>
    <RangeTitle />
    <ScrollView
      shadow={3}
      _contentContainerStyle={{
        alignItems: 'center',
      }}
      refreshControl={(
        <RefreshControl
          refreshing={loading}
          onRefresh={fetchData}
          tintColor={colors.brandStyle}
        />
      )}
    >
      <AssetsHistoryChart
        start={start}
        end={end}
        dashboard={dashboard}
        filterData={filterData}
      />
    </ScrollView>
  </Box>
);

export default Chart;
