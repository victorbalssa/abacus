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
import RangeSelect from './UI/RangeSelect';

type ChartType = {
  range: number,
  dashboard: [],
  loading: boolean,
  fetchData: () => Promise<void>,
  start: string,
  end: string,
  handleChangeRange: (value: object) => Promise<void>,
  filterData: () => Promise<void>,
}

const Chart = ({
  range,
  dashboard,
  loading,
  fetchData,
  filterData,
  start,
  end,
  handleChangeRange,
}: ChartType) => (
  <Box flex={1} safeAreaTop>
    <Box marginLeft={8}>
      <Text
        style={{
          fontSize: 30,
          paddingTop: 15,
          paddingBottom: 15,
        }}
      >
        Q2 2022.
      </Text>
    </Box>
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
    <RangeSelect range={range} handleChangeRange={handleChangeRange} />
  </Box>
);

export default Chart;
