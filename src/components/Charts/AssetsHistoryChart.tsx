import React, { useCallback, useMemo } from 'react';
import {
  Text,
  VStack,
  HStack,
  ScrollView,
  IconButton,
  View,
} from 'native-base';
import {
  VictoryAxis,
  VictoryChart,
  VictoryLine,
  VictoryVoronoiContainer,
} from 'victory-native';
import { maxBy, minBy } from 'lodash';
import { Line, Circle } from 'react-native-svg';
import { AntDesign } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import * as Linking from 'expo-linking';
import { useDispatch, useSelector } from 'react-redux';
import * as Localization from 'expo-localization';

import { RootDispatch, RootState } from '../../store';
import Loading from '../UI/Loading';
import translate from '../../i18n/locale';
import { useThemeColors } from '../../lib/common';

function AccountsLengthMessage() {
  const { colors } = useThemeColors();
  const backendURL = useSelector((state: RootState) => state.configuration.backendURL);

  return (
    <View m={2}>
      <Text fontSize={12}>
        {translate('assetsHistoryCharts_chart_works')}
        {' '}
        <Text
          style={{ color: colors.brandInfo }}
          onPress={() => Linking.openURL(`${backendURL}/preferences`)}
          underline
        >
          {translate('assetsHistoryCharts_change_preferences')}
        </Text>
        {' '}
        {translate('assetsHistoryCharts_choose_preferences_text')}
        {' '}
        <Text fontFamily="Montserrat_Bold">{translate('assetsHistoryCharts_home_screen')}</Text>
        .
      </Text>
    </View>
  );
}

function CursorPointer({ x, y, stroke }) {
  return (
    <>
      <Circle cx={x} cy={y} r="7" fill={stroke} />
      <Circle cx={x} cy={y} r="4" fill="#fff" />
    </>
  );
}

function Cursor({
  x,
  y,
  minY,
  maxY,
  activePoints,
  colors,
}) {
  return (
    <>
      <VStack
        bgColor={colors.tileBackgroundColor}
        mx={2}
        h={100}
        top={-110}
      >
        <VStack
          position="absolute"
          left={0}
          right={0}
          bottom={0}
          marginLeft="auto"
          marginRight="auto"
        >
          <Text fontWeight={600} fontSize={16} my={1}>
            {`${activePoints.length !== 0 ? new Date(activePoints[0]?.x).toLocaleString(Localization.locale, {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            }) : '  '}`}
          </Text>
          {activePoints.map(({
            y: yPoint, childName, style,
          }) => {
            const {
              data: {
                stroke,
              },
            } = style;

            return (
              <HStack key={childName} justifyContent="space-between" alignItems="center">
                <Text alignSelf="flex-start" color={stroke} fontSize={12}>{childName}</Text>
                <Text alignSelf="flex-start" color={stroke} fontSize={12}>
                  {`${(yPoint).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') || ''}`}
                </Text>
              </HStack>
            );
          })}
        </VStack>
      </VStack>
      <Line
        stroke="#fff"
        strokeWidth={1}
        x1={x}
        x2={x}
        y1={0}
        y2={300}
      />
      {activePoints.map(({
        y: yPoint, childName, style,
      }) => {
        const {
          data: {
            stroke,
          },
        } = style;
        const yMinDisplay = maxY <= 0 ? 10 : 12;
        const yMaxDisplay = minY !== 0 ? 294 : 296;
        const zeroPos = (-((minY / (maxY - minY)) - 1) * (yMaxDisplay - yMinDisplay)) + yMinDisplay;
        const yCursorPoint = ((-((yPoint / (maxY - minY)) - 1) * (yMaxDisplay - yMinDisplay)) + yMinDisplay - (zeroPos - yMaxDisplay)) || 0;

        return (
          <CursorPointer key={y + childName} stroke={stroke} x={x} y={yCursorPoint} />
        );
      })}
    </>
  );
}

export default function AssetsHistoryChart() {
  const { colors } = useThemeColors();
  const start = useSelector((state: RootState) => state.firefly.rangeDetails.start);
  const end = useSelector((state: RootState) => state.firefly.rangeDetails.end);
  const accounts = useSelector((state: RootState) => state.firefly.accounts);
  const loading = useSelector((state: RootState) => state.loading.effects.firefly.getAccountChart.loading);
  const currentCode = useSelector((state: RootState) => state.currencies.currentCode);
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

  return useMemo(() => (
    <ScrollView bounces={false}>
      <VStack
        bgColor={colors.tileBackgroundColor}
        borderTopWidth={0.5}
        borderBottomWidth={0.5}
        borderColor={colors.listBorderColor}
        justifyContent="center"
      >
        <HStack
          style={{
            paddingTop: 10,
            justifyContent: 'space-between',
            paddingBottom: 0,
          }}
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
            {translate('assets_history_chart')}
            {' '}
            {currentCode}
          </Text>
          <IconButton
            variant="solid"
            m={2}
            _icon={{
              as: AntDesign,
              name: 'reload1',
            }}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch();
              dispatch.firefly.getAccountChart();
            }}
          />
        </HStack>
        <View style={{ height: 55 }} />
        {loading && (
        <VStack justifyContent="center">
          <HStack h={400} alignItems="center">
            <Loading />
          </HStack>
        </VStack>
        )}
        {!loading && (
        <VictoryChart
          padding={{
            top: 10,
            left: 50,
            right: 35,
            bottom: 105,
          }}
          height={400}
          domainPadding={2}
          containerComponent={(
            <VictoryVoronoiContainer
              voronoiDimension="x"
              labels={({ datum }) => datum.childName}
              labelComponent={(
                <Cursor
                  x
                  y
                  activePoints
                  maxY={maxBy(accounts.filter((v) => !v.skip), (c: { maxY: number }) => c.maxY)?.maxY || 0}
                  minY={minBy(accounts.filter((v) => !v.skip), (c: { minY: number }) => c.minY)?.minY || 0}
                  colors={colors}
                />
              )}
            />
          )}
        >
          <VictoryAxis
            dependentAxis
            crossAxis={false}
            tickCount={6}
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
          {accounts.filter((v) => !v.skip).map((chart) => chart.entries.length > 0 && (
            <VictoryLine
              key={chart.label}
              style={{
                data: {
                  stroke: chart.color,
                  strokeWidth: 2,
                },
              }}
              interpolation="monotoneX"
              data={chart.entries}
              name={`${chart.label} (${chart.currencySymbol})`}
            />
          ))}
        </VictoryChart>
        )}
        {accounts.length > 4 && (<AccountsLengthMessage />)}
      </VStack>
      <View style={{ height: 200 }} />
    </ScrollView>
  ), [loading, accounts]);
}
