import React from 'react';
import { ScrollView } from 'native-base';
import { View } from 'react-native';
import AssetsHistoryChart from './Charts/AssetsHistoryChart';
import NavigationHeader from './UI/NavigationHeader';
import { useThemeColors } from '../lib/common';

const Chart = ({
  loading,
  accounts,
  fetchData,
  filterData,
  start,
  end,
  backendURL,
}) => {
  const { colors } = useThemeColors();

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.backgroundColor,
      }}
    >
      <ScrollView
        contentContainerStyle={{
          paddingTop: 95,
        }}
        bounces={false}
        showsVerticalScrollIndicator={false}
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
      <NavigationHeader />
    </View>
  );
};

export default Chart;
