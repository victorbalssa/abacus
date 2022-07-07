import React from 'react';
import { ViewStyle } from 'react-native';
import {
  Box,
  HStack,
  Icon,
  Stack,
  Text,
  ScrollView,
  Select,
  CheckIcon,
  IconButton,
} from 'native-base';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import UIButton from './UI/UIButton';
import AssetsHistoryChart from './Charts/AssetsHistoryChart';

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
  <ScrollView>
    <Stack safeAreaTop={8}>
      <Box alignItems="center">
        <Text
          style={{
            fontSize: 20,
            paddingTop: 10,
            paddingBottom: 15,
          }}
        >
          Abacus.
        </Text>
      </Box>
      <Stack shadow="3" justifyContent="center" alignItems="center">
        <HStack justifyContent="space-between" alignItems="center">
          <IconButton
            m={1}
            variant="solid"
            _icon={{
              as: AntDesign,
              name: 'left',
            }}
            onPress={() => handleChangeRange({ direction: -1 })}
          />
          <Select
            m={1}
            minWidth="120"
            minHeight="50"
            _selectedItem={{
              bg: 'primary.600',
              endIcon: <CheckIcon size="5" />,
            }}
            selectedValue={`${range}`}
            onValueChange={(v) => handleChangeRange({ range: v })}
          >
            <Select.Item label="One month" value="1" />
            <Select.Item label="Three months (quarter)" value="3" />
            <Select.Item label="Six months" value="6" />
            <Select.Item label="One year (SLOW)" value="12" />
          </Select>
          <IconButton
            m={1}
            variant="solid"
            _icon={{
              as: AntDesign,
              name: 'right',
            }}
            onPress={() => handleChangeRange({ direction: 1 })}
          />
        </HStack>
        <AssetsHistoryChart
          start={start}
          end={end}
          dashboard={dashboard}
          filterData={filterData}
        />
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
      </Stack>
    </Stack>
  </ScrollView>
);

export default Chart;
