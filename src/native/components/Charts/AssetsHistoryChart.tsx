import React, { useState } from 'react';
import {
  Stack,
  Text,
  VStack,
  Checkbox,
  HStack,
  Pressable,
} from 'native-base';
import {
  VictoryAxis,
  VictoryChart,
  VictoryLine,
  VictoryVoronoiContainer,
} from 'victory-native';
import { maxBy, minBy } from 'lodash';
import { Line, Circle } from 'react-native-svg';
import colors from '../../../constants/colors';

const CursorPointer = ({
  x,
  y,
}) => (
  <>
    <Circle cx={x} cy={y} r="5" fill={colors.brandDarkLight} />
    <Circle cx={x} cy={y} r="3" fill="#fff" />
  </>
);

const Cursor = ({
  x, y, minY, maxY, activePoints,
}) => (
  <>
    <Line
      strokeDasharray="5, 5"
      stroke={colors.brandDarkLight}
      strokeWidth={2}
      x1={x}
      x2={x}
      y1={0}
      y2={223}
    />
    {activePoints.map(({ y: yPoint, childName }) => {
      const yMinDisplay = maxY <= 0 ? 0 : 2;
      const yMaxDisplay = minY !== 0 ? 218 : 220;
      const zeroPos = (-((minY / (maxY - minY)) - 1) * (yMaxDisplay - yMinDisplay)) + yMinDisplay;
      const yCursorPoint = (-((yPoint / (maxY - minY)) - 1) * (yMaxDisplay - yMinDisplay)) + yMinDisplay - (zeroPos - yMaxDisplay);

      return (
        <CursorPointer key={y + childName} x={x} y={yCursorPoint} />
      );
    })}
  </>
);

const AssetsHistoryChart = ({
  start,
  end,
  accounts,
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
      <Stack
        style={{
          marginTop: 10,
          paddingTop: 0,
          paddingLeft: 15,
          paddingBottom: 0,
        }}
      >
        <VStack>
          {accounts.map((chart, index) => {
            let value = '';
            if (points.filter((v) => v.childName === chart.label).length) {
              value = points.filter((v) => v.childName === chart.label)[0].y;
            }

            return (
              <Pressable
                key={`key-${chart.label}`}
                onPress={() => filterData({ index })}
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
                  <Text ml={1} color={chart.color} fontWeight={600} fontSize={15}>
                    {` ${chart.label} ${value ? (chart.currency_symbol + value) : ''}`}
                  </Text>
                </HStack>
              </Pressable>
            );
          })}
          <Text fontWeight={600} fontSize={17}>
            {`${points.length !== 0 ? new Date(points[0]?.x).toLocaleString('default', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            }) : '  '}`}
          </Text>
        </VStack>
      </Stack>
      <VictoryChart
        padding={{
          left: 40,
          right: 40,
          bottom: 30,
        }}
        width={350}
        height={250}
        domainPadding={2}
        containerComponent={(
          <VictoryVoronoiContainer
            voronoiDimension="x"
            onActivated={setPoints}
            onTouchEnd={() => setPoints([])}
            labels={({ datum }) => datum.childName}
            labelComponent={(
              <Cursor
                x
                y
                activePoints
                maxY={maxBy(accounts.filter((v) => !v.skip), (c: { maxY: number }) => c.maxY)?.maxY}
                minY={minBy(accounts.filter((v) => !v.skip), (c: { minY: number }) => c.minY)?.minY}
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
        {accounts
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
          style={{ tickLabels: { angle: getTickValues().length > 5 ? -60 : 0 } }}
        />
      </VictoryChart>
    </VStack>
  );
};

export default AssetsHistoryChart;
