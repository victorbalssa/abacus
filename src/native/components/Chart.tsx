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
  enableScroll: () => Promise<void>,
  disableScroll: () => Promise<void>,
  scrollEnabled: boolean,
}

const Chart = ({
  accounts,
  loading,
  fetchData,
  filterData,
  start,
  end,
  enableScroll,
  disableScroll,
  scrollEnabled,
}: ChartType) => (
  <>
    <RangeTitle />
    <Box flex={1}>
      <ScrollView
        p={3}
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
        scrollEnabled={scrollEnabled}
      >
        <AssetsHistoryChart
          start={start}
          end={end}
          accounts={accounts}
          filterData={filterData}
          enableScroll={enableScroll}
          disableScroll={disableScroll}
        />
      </ScrollView>
    </Box>
  </>
);

export default Chart;
