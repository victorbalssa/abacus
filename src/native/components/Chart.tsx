import React from 'react';
import { RefreshControl } from 'react-native';
import {
  Box,
  ScrollView,
} from 'native-base';
import AssetsHistoryChart from './Charts/AssetsHistoryChart';
import RangeTitle from './UI/RangeTitle';
import colors from '../../constants/colors';
import { AssetAccountType } from '../../models/firefly';

type ChartType = {
  accounts: AssetAccountType[],
  loading: boolean,
  fetchData: () => Promise<void>,
  start: string,
  end: string,
  filterData: () => Promise<void>,
}

const Chart = ({
  accounts,
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
        accounts={accounts}
        filterData={filterData}
      />
    </ScrollView>
  </Box>
);

export default Chart;
