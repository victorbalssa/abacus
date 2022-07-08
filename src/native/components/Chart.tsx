import React from 'react';
import { ViewStyle } from 'react-native';
import {
  Box,
  Icon,
  ScrollView, Text,
} from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import UIButton from './UI/UIButton';
import AssetsHistoryChart from './Charts/AssetsHistoryChart';
import RangeTitle from './UI/RangeTitle';

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
    <Box flex={1} shadow="3" alignItems="center">
      <ScrollView scrollEnabled={false}>
        <AssetsHistoryChart
          start={start}
          end={end}
          dashboard={dashboard}
          filterData={filterData}
        />
      </ScrollView>
      <UIButton
        text="Refresh"
        loading={loading}
        onPress={fetchData}
        icon={(
          <Icon
            as={Ionicons}
            name="refresh"
            color="#fff"
            style={{
              fontSize: 15,
              paddingRight: 10,
              marginLeft: 10,
              paddingLeft: 5,
            } as ViewStyle}
          />
        )}
        style={{
          margin: 15,
          height: 35,
        }}
      />
    </Box>
  </Box>
);

export default Chart;
