import React, { useCallback, useMemo } from 'react';
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
import { useDispatch, useSelector } from 'react-redux';
import * as Localization from 'expo-localization';
import { Pressable, View, ScrollView } from 'react-native';
import {
  AStackFlex,
  AText,
} from '../UI/ALibrary';

import { RootDispatch, RootState } from '../../store';
import Loading from '../UI/Loading';
import translate from '../../i18n/locale';
import { useThemeColors } from '../../lib/common';
import ErrorBoundary from '../UI/ErrorBoundary';

function AccountsLengthMessage() {
  return (
    <View style={{ margin: 5 }}>
      <AText fontSize={12}>
        {translate('assetsHistoryCharts_chart_works')}
      </AText>
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
      <AStackFlex
        flex={0}
        alignItems="flex-start"
        justifyContent="flex-start"
        backgroundColor={colors.tileBackgroundColor}
        style={{
          position: 'absolute',
          top: -120,
          height: 100,
          left: 0,
          right: 0,
          paddingHorizontal: 10,
        }}
      >
        <AText fontSize={16} py={1} bold>
          {`${activePoints.length !== 0 ? new Date(activePoints[0]?.x).toLocaleString(Localization.locale, {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          }) : '  '}`}
        </AText>
        <AStackFlex
          flex={0}
          alignItems="flex-start"
          justifyContent="flex-start"
        >
          {activePoints.map(({
            y: yPoint, childName, style,
          }) => {
            const {
              data: {
                stroke,
              },
            } = style;

            return (
              <AStackFlex
                flex={0}
                row
                justifyContent="space-between"
                key={childName}
              >
                <AText color={stroke} fontSize={12}>{childName}</AText>
                <AText color={stroke} fontSize={12}>
                  {`${(yPoint).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') || ''}`}
                </AText>
              </AStackFlex>
            );
          })}
        </AStackFlex>
      </AStackFlex>
      <Line
        stroke="#fff"
        strokeWidth={1}
        x1={x}
        x2={x}
        y1={10}
        y2={295}
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
  const accounts = useSelector((state: RootState) => state.firefly?.accounts);
  const loading = useSelector((state: RootState) => state.loading.effects.firefly.getAccountChart?.loading);
  const currentCode = useSelector((state: RootState) => state.currencies.currentCode);
  const dispatch = useDispatch<RootDispatch>();

  const getTickValues = useCallback(() => {
    const dateArray = [];
    const currentDate = new Date(start);
    currentDate.setDate(currentDate.getDate() + 10);

    while (currentDate <= new Date(end)) {
      dateArray.push(+new Date(currentDate));
      currentDate.setMonth(currentDate.getMonth() + 1);
    }

    return dateArray;
  }, [start, end]);

  return useMemo(() => (
    <ErrorBoundary>
      <ScrollView bounces={false}>
        <AStackFlex
          backgroundColor={colors.tileBackgroundColor}
          justifyContent="center"
          style={{
            borderTopWidth: 0.5,
            borderBottomWidth: 0.5,
            borderColor: colors.listBorderColor,
          }}
        >
          <AStackFlex
            row
            alignItems="baseline"
            justifyContent="space-between"
            style={{
              paddingHorizontal: 10,
              paddingVertical: 10,
            }}
          >
            <AText fontSize={24} bold>
              {translate('assets_history_chart')}
              {' '}
              {currentCode}
            </AText>
            <Pressable
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch();
                dispatch.firefly.getAccountChart();
              }}
            >
              <AntDesign name="reload1" size={24} color={colors.text} />
            </Pressable>
          </AStackFlex>
          <View style={{ height: 80 }} />
          {loading && (
          <AStackFlex justifyContent="center">
            <AStackFlex row style={{ height: 400 }} alignItems="center">
              <Loading />
            </AStackFlex>
          </AStackFlex>
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
                    maxY={maxBy(accounts, (c: { maxY: number }) => c.maxY)?.maxY || 0}
                    minY={minBy(accounts, (c: { minY: number }) => c.minY)?.minY || 0}
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
                grid: { stroke: '#949494', strokeWidth: 0.2 },
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
                grid: { stroke: '#949494', strokeWidth: 0.2 },
                axis: { stroke: colors.brandLight },
                tickLabels: {
                  fill: colors.text,
                  fontWeight: 200,
                  angle: getTickValues().length > 7 ? -40 : 0,
                },
              }}
            />
            {accounts.map((chart) => chart.entries.length > 0 && (
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
        </AStackFlex>
        <View style={{ height: 200 }} />
      </ScrollView>
    </ErrorBoundary>
  ), [
    loading,
    accounts,
    colors,
  ]);
}
