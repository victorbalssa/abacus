import React from 'react';
import {
  Text,
  VStack,
  Checkbox,
  HStack,
  Pressable,
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
import { D_WIDTH, useThemeColors } from '../../lib/common';

function AccountsLengthMessage() {
  const { colors } = useThemeColors();
  const backendURL = useSelector((state: RootState) => state.configuration.backendURL);

  return (
    <View m={2}>
      <Text fontSize={11}>
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
      <Circle cx={x} cy={y} r="10" fill={stroke} />
      <Circle cx={x} cy={y} r="7" fill="#fff" />
    </>
  );
}

function Cursor({
  x,
  y,
  minY,
  maxY,
  activePoints,
}) {
  return (
    <>
      <VStack ml={2} h={100} top={-100} borderTopRadius={15} mr={5}>
        <HStack
          justifyContent="center"
          minW={100}
        >
          <Text fontWeight={600} pt={2} fontSize={18}>
            {`${activePoints.length !== 0 ? new Date(activePoints[0]?.x).toLocaleString(Localization.locale, {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            }) : '  '}`}
          </Text>
        </HStack>
        <VStack
          position="absolute"
          left={x < D_WIDTH - 90 ? x - 35 : undefined}
          right={0}
          bottom={0}
          marginLeft="auto"
          marginRight="auto"
          minW={100}
        >
          <ScrollView maxHeight={110}>
            {activePoints.map(({
              y: yPoint, childName, style,
            }) => {
              const {
                data: {
                  stroke,
                },
              } = style;

              return (
                <Text key={childName} alignSelf="flex-start" ml={1} color={stroke} fontSize={12}>
                  {`${(yPoint).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') || ''}`}
                </Text>
              );
            })}
          </ScrollView>
        </VStack>
      </VStack>
      <Line
        strokeDasharray="5, 5"
        stroke="#676767"
        strokeWidth={2}
        x1={x}
        x2={x}
        y1={10}
        y2={299}
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
  const loading = useSelector((state: RootState) => state.loading.effects.firefly.getAccountChart?.loading);
  const { start, end } = useSelector((state: RootState) => state.firefly.rangeDetails);
  const accounts = useSelector((state: RootState) => state.firefly.accounts);
  const { firefly: { filterData, getAccountChart } } = useDispatch<RootDispatch>();

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
      bgColor={colors.tileBackgroundColor}
      borderTopWidth={0.5}
      borderBottomWidth={0.5}
      borderColor={colors.listBorderColor}
      justifyContent="center"
    >
      <Text
        style={{
          paddingTop: 15,
          fontFamily: 'Montserrat_Bold',
          margin: 15,
          color: colors.text,
          fontSize: 25,
          lineHeight: 25,
        }}
      >
        {translate('assets_history_chart')}
      </Text>
      <HStack
        style={{
          marginTop: 10,
          paddingTop: 0,
          paddingHorizontal: 10,
          justifyContent: 'space-between',
          paddingBottom: 0,
        }}
      >
        <View>
          {accounts.map((chart, index) => (
            <Pressable
              key={`key-${chart.label}`}
              onPress={() => filterData({ index })}
              isDisabled={!chart.skip && accounts.filter((v) => !v.skip).length < 2}
              _disabled={{
                style: {
                  opacity: 0.4,
                },
              }}
            >
              <HStack p={1} key={`key-${chart.label}`}>
                <Checkbox
                  accessibilityLabel={`key-${chart.color}`}
                  key={`key-${chart.label}`}
                  colorScheme={chart.colorScheme}
                  isDisabled={!chart.skip && accounts.filter((v) => !v.skip).length < 2}
                  isChecked={!chart.skip}
                  value={`${index}`}
                  onChange={() => filterData({ index })}
                />
                <Text
                  maxW={200}
                  numberOfLines={1}
                  ml={1}
                  color={chart.color}
                  fontSize={15}
                >
                  {chart.label}
                </Text>
              </HStack>
            </Pressable>
          ))}
        </View>
        <IconButton
          variant="solid"
          _icon={{
            as: AntDesign,
            name: 'reload1',
          }}
          onPress={() => getAccountChart()}
          onPressOut={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
        />
      </HStack>
      <View style={{ height: 90 }} />
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
  );
}
