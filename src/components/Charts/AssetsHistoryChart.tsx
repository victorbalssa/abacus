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
import colors from '../../constants/colors';
import Loading from '../UI/Loading';
import { translate } from '../../i18n/locale';

const CursorPointer = ({
  x,
  y,
  stroke,
}) => (
  <>
    <Circle cx={x} cy={y} r="6" fill={stroke} />
    <Circle cx={x} cy={y} r="4" fill="#fff" />
  </>
);

const Cursor = ({
  x, y, minY, maxY, activePoints,
}) => (
  <>
    <VStack ml={2} h={130} top={-130} bgColor={colors.brandLight} borderTopRadius={15} mr={5}>
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
            <Text key={childName} alignSelf="flex-start" mt={1} ml={1} color={stroke} fontWeight={600} fontSize={15}>
              {` ${childName} ${(yPoint).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') || ''}`}
            </Text>
          );
        })}
      </ScrollView>
      <VStack
        position="absolute"
        left={x < 300 ? x - 35 : undefined}
        right={0}
        bottom={0}
        marginLeft="auto"
        marginRight="auto"
        minW={100}
      >
        <Text fontWeight={600} fontSize={14} color={colors.brandDarkLight}>
          {`${activePoints.length !== 0 ? new Date(activePoints[0]?.x).toLocaleString('default', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          }) : '  '}`}
        </Text>
      </VStack>
    </VStack>
    <Line
      strokeDasharray="5, 5"
      stroke={colors.brandDarkLight}
      strokeWidth={3}
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

const AssetsHistoryChart = ({
  loading,
  fetchData,
  start,
  end,
  accounts,
  filterData,
  backendURL,
}) => {
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
      mt={2}
      bgColor={colors.brandLight}
      borderWidth={1}
      borderColor="#E3E3E3FF"
      justifyContent="center"
      borderRadius={15}
    >
      <HStack
        style={{
          marginTop: 10,
          paddingTop: 0,
          paddingLeft: 15,
          paddingBottom: 0,
        }}
      >
        <ScrollView height={120} indicatorStyle="black">
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
                  value={index}
                  onChange={() => filterData({ index })}
                />
                <Text
                  maxW={200}
                  numberOfLines={1}
                  ml={1}
                  color={chart.color}
                  fontWeight={600}
                  fontSize={15}
                >
                  {chart.label}
                </Text>
              </HStack>
            </Pressable>
          ))}
        </ScrollView>
        <IconButton
          variant="solid"
          _icon={{
            as: AntDesign,
            name: 'reload1',
          }}
          h={10}
          mr={2}
          onPress={fetchData}
          onTouchStart={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
        />
      </HStack>
      {loading && (
      <VStack m={2} justifyContent="center" borderRadius={15}>
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
          bottom: 135,
        }}
        height={430}
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
          orientation="left"
          dependentAxis
          crossAxis={false}
          tickCount={6}
          tickFormat={(x) => (`${x !== 0 ? (Math.round(x) / 1000) : '0'}k`)}
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
            name={`${chart.label} (${chart.currency_symbol})`}
          />
        ))}
        <VictoryAxis
          orientation="bottom"
          offsetY={135}
          tickValues={getTickValues()}
          tickFormat={(x) => (new Date(x).toLocaleString('default', { month: 'short' }))}
          style={{ tickLabels: { angle: getTickValues().length > 5 ? -60 : 0 } }}
        />
      </VictoryChart>
      )}
      {accounts.length > 4 && (
      <View m={2}>
        <Text fontSize={11}>
          {translate('assetsHistoryCharts_chart_works')}
          {' '}
          <Text style={{ color: 'blue' }} onPress={() => Linking.openURL(`${backendURL}/preferences`)} underline>{translate('assetsHistoryCharts_change_preferences')}</Text>
          {' '}
          {translate('assetsHistoryCharts_choose_preferences_text')}
          {' '}
          <Text fontFamily="Montserrat_Bold">{translate('assetsHistoryCharts_home_screen')}</Text>
          .
        </Text>
      </View>
      )}
    </VStack>
  );
};

export default AssetsHistoryChart;
