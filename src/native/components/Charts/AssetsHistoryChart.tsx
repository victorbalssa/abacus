import React, { useState } from 'react';
import {
  Stack,
  Text,
  VStack,
  Checkbox,
  HStack,
} from 'native-base';
import {
  VictoryAxis,
  VictoryChart,
  VictoryLine,
  VictoryVoronoiContainer,
} from 'victory-native';
import * as Haptics from 'expo-haptics';
import { maxBy, minBy } from 'lodash';
import { Line, Circle } from 'react-native-svg';

import colors from '../../../constants/colors';

const CursorPointer = ({
  x,
  y,
}) => (
  <>
    <Line
      strokeDasharray="5, 5"
      style={{
        stroke: colors.brandDarkLight,
        strokeWidth: 1,
      }}
      y1={y}
      y2={y}
      x1={40}
      x2={x}
    />
    <Circle cx={x} cy={y} r="5" fill={colors.brandDarkLight} />
    <Circle cx={x} cy={y} r="3" fill="#fff" />
  </>
);

const Cursor = (props) => (
  <>
    <Line
      strokeDasharray="5, 5"
      style={{
        stroke: '#545454',
        strokeWidth: 1,
      }}
      x1={props.x}
      x2={props.x}
      y1={30}
      y2={253}
    />
    {props.activePoints.map((point) => {
      const yMinDisplay = props.maxY <= 0 ? 30 : 32;
      const yMaxDisplay = props.minY !== 0 ? 248 : 250;
      const zeroPos = (-((props.minY / (props.maxY - props.minY)) - 1) * (yMaxDisplay - yMinDisplay)) + yMinDisplay;
      const y = (-((point.y / (props.maxY - props.minY)) - 1) * (yMaxDisplay - yMinDisplay)) + yMinDisplay - (zeroPos - yMaxDisplay);

      return (
        <CursorPointer key={point.y + point.childName} x={props.x} y={y} />
      );
    })}
  </>
);

const AssetsHistoryChart = ({
  start,
  end,
  dashboard,
  filterData,
}) => {
  const [points, setPoints] = useState([]);

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
      maxW={330}
      bgColor={colors.brandLight}
      rounded="15"
    >
      <VictoryChart
        padding={{
          top: 30,
          left: 40,
          right: 40,
          bottom: 30,
        }}
        width={350}
        height={280}
        domainPadding={2}
        containerComponent={(
          <VictoryVoronoiContainer
            voronoiDimension="x"
            onActivated={setPoints}
            onTouchStart={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
            onTouchEnd={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
            labels={({ datum }) => datum.childName}
            labelComponent={(
              <Cursor
                maxY={maxBy(dashboard.filter((v) => !v.skip), (c) => c.maxY).maxY}
                minY={minBy(dashboard.filter((v) => !v.skip), (c) => c.minY).minY}
              />
            )}
          />
        )}
      >
        <VictoryAxis
          dependentAxis
          tickCount={6}
          tickFormat={(x) => (`${x !== 0 ? (Math.round(x) / 1000) : '0'}k`)}
        />
        {dashboard
          .filter((v) => !v.skip)
          .map((chart) => (
            <VictoryLine
              key={chart.label}
              style={{
                data: {
                  stroke: chart.color,
                  strokeWidth: 2,
                },
              }}
              interpolation="linear"
              data={chart.entries}
              name={chart.label}
            />
          ))}
        <VictoryAxis
          tickValues={getTickValues()}
          tickFormat={(x) => (new Date(x).toLocaleString('default', { month: 'short' }))}
          style={{ tickLabels: { angle: getTickValues().length > 5 ? -60 : 0} }}
        />
      </VictoryChart>
      <Stack
        style={{
          marginTop: 0,
          paddingTop: 0,
          paddingLeft: 15,
          paddingBottom: 10,
        }}
      >
        <VStack>
          <Text fontWeight={600} fontSize={17}>
            {`${points.length !== 0 ? new Date(points[0]?.x).toLocaleString('default', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            }) : ''}`}
          </Text>
          {dashboard.map((chart, index) => {
            let value = '';
            if (points.filter((v) => v.childName === chart.label).length) {
              value = points.filter((v) => v.childName === chart.label)[0].y;
            }

            return (
              <HStack p={1} key={`key-${chart.label}`}>
                <Checkbox
                  accessibilityLabel={`key-${chart.color}`}
                  key={`key-${chart.label}`}
                  colorScheme={chart.colorScheme}
                  isDisabled={!chart.skip && dashboard.filter((v) => !v.skip).length < 2}
                  isChecked={!chart.skip}
                  value={index}
                  onChange={() => filterData({ index })}
                />
                <Text ml={1} color={chart.color} fontWeight={600} fontSize={15}>
                  {` ${chart.label} ${value ? (chart.currency_symbol + value) : ''}`}
                </Text>
              </HStack>
            );
          })}
        </VStack>
      </Stack>
    </VStack>
  );
};

export default AssetsHistoryChart;
