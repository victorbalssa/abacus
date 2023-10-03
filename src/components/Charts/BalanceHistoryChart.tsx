import React from 'react';
import {
  Text,
  VStack,
  HStack,
  IconButton,
} from 'native-base';
import {
  VictoryAxis,
  VictoryBar,
  VictoryChart,
  VictoryLine,
  VictoryScatter,
} from 'victory-native';
import { isEmpty, round } from 'lodash';
import { AntDesign } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import * as Localization from 'expo-localization';
import { useDispatch, useSelector } from 'react-redux';

import Loading from '../UI/Loading';
import { useThemeColors } from '../../lib/common';
import { RootDispatch, RootState } from '../../store';
import translate from '../../i18n/locale';

export default function BalanceHistoryChart() {
  const { colors } = useThemeColors();
  const dispatch = useDispatch<RootDispatch>();
  const { start, end } = useSelector((state: RootState) => state.firefly.rangeDetails);
  const { loading } = useSelector((state: RootState) => state.loading.effects.firefly.getBalanceChart);
  const earnedChart = useSelector((state: RootState) => state.firefly.earnedChart || []);
  const spentChart = useSelector((state: RootState) => state.firefly.spentChart || []);

  const getTickValues = () => {
    const dateArray = [];
    const currentDate = new Date(start);
    currentDate.setDate(currentDate.getDate() + 14);

    while (currentDate <= new Date(end)) {
      dateArray.push(+new Date(currentDate));
      currentDate.setMonth(currentDate.getMonth() + 1);
    }

    return dateArray;
  };

  return (
    <VStack
      mx={1.5}
      bgColor={colors.tileBackgroundColor}
      borderWidth={0.5}
      borderColor={colors.listBorderColor}
      justifyContent="center"
      borderRadius={10}
    >
      <HStack
        justifyContent="flex-end"
        style={{
          marginTop: 10,
          paddingTop: 0,
          paddingHorizontal: 10,
          paddingBottom: 0,
        }}
      >
        <IconButton
          variant="solid"
          _icon={{
            as: AntDesign,
            name: 'reload1',
          }}
          onPress={() => dispatch.firefly.getBalanceChart()}
          onPressOut={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
        />
      </HStack>
      {loading && (
        <VStack m={2} justifyContent="center" borderRadius={10}>
          <HStack h={400} alignItems="center">
            <Loading />
          </HStack>
        </VStack>
      )}
      {!loading && (!isEmpty(spentChart) || !isEmpty(earnedChart)) && (
        <VictoryChart
          padding={{
            top: 10,
            left: 50,
            right: 35,
            bottom: 135,
          }}
          height={430}
          domainPadding={10}
          minDomain={{ x: 0.5 }}
        >
          <VictoryAxis
            orientation="left"
            dependentAxis
            crossAxis={false}
            tickFormat={(x) => ((x !== 0) ? `${(Math.round(x) / 1000)}k` : '0')}
            style={{
              axis: { stroke: colors.brandLight },
              tickLabels: {
                fill: colors.brandDarkLight,
                fontWeight: 600,
              },
            }}
          />

          <VictoryAxis
            offsetY={135}
            minDomain={{ x: 0 }}
            tickValues={getTickValues()}
            tickFormat={(x) => (new Date(x).toLocaleString(Localization.locale, { month: 'short' }))}
            style={{
              axis: { stroke: colors.brandLight },
              tickLabels: {
                fill: colors.brandDarkLight,
                fontWeight: 600,
                angle: getTickValues().length > 7 ? -40 : 0,
              },
            }}
          />

          <VictoryBar
            key="gain"
            cornerRadius={{ top: ({ datum }) => ((datum._y === 0) ? 0 : 7) }}
            style={{
              data: {
                fill: colors.brandStyle70,
                width: 15,
              },
            }}
            data={earnedChart}
            name="gain"
          />
          <VictoryBar
            key="loose"
            cornerRadius={{ top: ({ datum }) => ((datum._y === 0) ? 0 : 7) }}
            style={{
              data: {
                fill: colors.brandStyle20,
                width: 15,
              },
            }}
            data={spentChart}
            name="loose"
          />
          <VictoryLine
            key="lineBalance"
            style={{
              data: {
                stroke: '#a6a6a6',
                strokeWidth: 2,
              },
            }}
            interpolation="monotoneX"
            data={earnedChart.map((pts, index) => ({ x: pts.x, y: pts.y + spentChart[index].y }))}
            name="lineBalance"
          />
          <VictoryScatter
            key="ptsBalance"
            style={{
              data: {
                fill: colors.brandPrimary,
                stroke: ({ datum }) => ((datum.y < 0) ? colors.red : colors.green),
                strokeWidth: 5,
              },
              labels: {
                fontSize: 12,
                fontWeight: 600,
                fill: colors.text,
              },
            }}
            size={7}
            labels={({ datum }) => (datum.y !== 0 ? `${(round(datum.y / 1000, 1))}k` : '')}
            data={earnedChart.map((pts, index) => ({ x: pts.x, y: pts.y + spentChart[index].y }))}
            name="ptsBalance"
          />
        </VictoryChart>
      )}
      {!loading && (isEmpty(spentChart) || isEmpty(earnedChart)) && (
        <Text p={2}>{translate('balance_history_chart_no_data')}</Text>
      )}
    </VStack>
  );
}
