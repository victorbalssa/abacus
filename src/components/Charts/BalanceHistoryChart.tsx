import React, {useCallback} from 'react';
import {
  Text,
  VStack,
  HStack,
  IconButton, View,
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

import { ScrollView } from 'react-native';
import Loading from '../UI/Loading';
import { useThemeColors } from '../../lib/common';
import { RootDispatch, RootState } from '../../store';
import translate from '../../i18n/locale';

export default function BalanceHistoryChart() {
  const { colors } = useThemeColors();
  const start = useSelector((state: RootState) => state.firefly.rangeDetails.start);
  const end = useSelector((state: RootState) => state.firefly.rangeDetails.end);
  const earnedChart = useSelector((state: RootState) => state.firefly.earnedChart || []);
  const spentChart = useSelector((state: RootState) => state.firefly.spentChart || []);
  const loading = useSelector((state: RootState) => state.loading.effects.firefly.getBalanceChart.loading);
  const dispatch = useDispatch<RootDispatch>();

  const getTickValues = useCallback(() => {
    const dateArray = [];
    const currentDate = new Date(start);
    currentDate.setDate(currentDate.getDate() + 14);

    while (currentDate <= new Date(end)) {
      dateArray.push(+new Date(currentDate));
      currentDate.setMonth(currentDate.getMonth() + 1);
    }

    return dateArray;
  }, [start, end]);

  return (
    <ScrollView bounces={false}>
      <VStack
        bgColor={colors.tileBackgroundColor}
        borderTopWidth={0.5}
        borderBottomWidth={0.5}
        borderColor={colors.listBorderColor}
        justifyContent="center"
      >
        <Text
          style={{
            fontFamily: 'Montserrat_Bold',
            margin: 15,
            color: colors.text,
            fontSize: 25,
            lineHeight: 25,
          }}
        >
          {translate('balance_history_chart')}
        </Text>
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
            onPress={() => {
              dispatch.firefly.getBalanceChart();
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch();
            }}
          />
        </HStack>
        {loading && (
        <VStack justifyContent="center">
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
            bottom: 105,
          }}
          height={400}
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
                fill: colors.text,
                fontWeight: 200,
              },
            }}
          />

          <VictoryAxis
            offsetY={105}
            minDomain={{ x: 0 }}
            tickValues={getTickValues()}
            tickFormat={(x) => (new Date(x).toLocaleString(Localization.locale, { month: 'short' }))}
            style={{
              axis: { stroke: colors.brandLight },
              tickLabels: {
                fill: colors.text,
                fontWeight: 200,
                angle: getTickValues().length > 7 ? -40 : 0,
              },
            }}
          />

          {!isEmpty(earnedChart) && (
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
          )}

          {!isEmpty(spentChart) && (
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
          )}

          {!isEmpty(earnedChart) && !isEmpty(spentChart) && (
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
          )}

          {!isEmpty(earnedChart) && !isEmpty(spentChart) && (
          <VictoryScatter
            key="ptsBalance"
            style={{
              data: {
                fill: colors.brandPrimary,
                stroke: ({ datum }) => ((datum.y < 0) ? colors.red : colors.green),
                strokeWidth: 5,
              },
              labels: {
                fontSize: 10,
                fontWeight: 600,
                fill: colors.text,
              },
            }}
            size={7}
            labels={({ datum }) => (datum.y !== 0 ? `${(round(datum.y / 1000, 1))}k` : '')}
            data={earnedChart.map((pts, index) => ({ x: pts.x, y: pts.y + spentChart[index].y }))}
            name="ptsBalance"
          />
          )}
        </VictoryChart>
        )}
        {!loading && (isEmpty(spentChart) && isEmpty(earnedChart)) && (
        <Text p={2}>{translate('balance_history_chart_no_data')}</Text>
        )}
      </VStack>
      <View style={{ height: 200 }} />
    </ScrollView>
  );
}
