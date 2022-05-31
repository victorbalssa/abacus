import React, { useState } from 'react';
import {
  Box,
  HStack,
  Stack,
  Text,
  VStack,
} from 'native-base';

import {
  VictoryAxis,
  VictoryChart,
  VictoryLine,
  VictoryVoronoiContainer,
} from 'victory-native';

import * as Haptics from 'expo-haptics';
import { Line, Circle } from 'react-native-svg';
import Loading from './UI/Loading';
import colors from '../../constants/colors';
import UIButton from './UI/UIButton';

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
      y1={50}
      y2={310}
    />
    {props.activePoints.map((point) => (
      <>
        <Line
          strokeDasharray="5, 5"
          style={{
            stroke: '#545454',
            strokeWidth: 1,
          }}
          y1={310 - (310 / 20000) * point.y}
          y2={310 - (310 / 20000) * point.y}
          x1={50}
          x2={300}
        />
        <Circle cx={props.x} cy={310 - (310 / 20000) * point.y} r="3" fill="#545454"/>
      </>
    ))}
  </>
);

const Dashboard = ({
  summary,
  dashboard,
  loading,
  fetchData,
}) => {
  const [points, setPoints] = useState([
    {
      x: 0,
      y: 0,
    },
  ]);

  const updatePoint = (dataPoints) => {
    if (dataPoints) {
      setPoints(dataPoints);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  return (
    <Stack flex={1}>
      <Box alignItems="center" paddingTop={50}/>
      <Box alignItems="center">
        <Text>
          Net worth.
        </Text>
        <Text style={{
          fontSize: 35,
          paddingTop: 20,
          paddingBottom: 15,
        }}
        >
          {summary.netWorth}
        </Text>
      </Box>
      {summary && !loading && (
        <Stack space={3} shadow="3" justifyContent="center" alignItems="center">
          <HStack space={3} justifyContent="center">
            <VStack
              minW={160}
              maxW={160}
              height={85}
              padding={3}
              bg={{
                linearGradient: {
                  colors: [colors.brandStyle, colors.brandStyleSecond],
                  start: [1, 0],
                  end: [0, 1],
                },
              }}
              rounded="15"
              justifyContent="flex-start"
              alignItems="flex-start"
            >
              <Text style={{
                fontSize: 20,
                fontFamily: 'Montserrat_Bold',
                color: 'white',
                textAlign: 'center',
              }}
              >
                {summary['net-worth-in-CAD'].value_parsed}
              </Text>
              <Text style={{
                fontSize: 14,
                fontFamily: 'Montserrat',
                color: 'white',
                textAlign: 'center',
              }}
              >
                {'\n'}
                {summary['net-worth-in-CAD'].title}
              </Text>
            </VStack>
            <VStack
              minW={160}
              maxW={160}
              height={85}
              padding={3}
              bg={{
                linearGradient: {
                  colors: [colors.brandStyle, colors.brandStyleSecond],
                  start: [0, 1],
                  end: [1, 0],
                },
              }}
              rounded="15"
              justifyContent="flex-start"
              alignItems="flex-end"
            >
              <Text
                style={{
                  fontSize: 20,
                  color: 'white',
                  textAlign: 'center',
                }}
                fontWeight={600}
              >
                {summary['net-worth-in-EUR'].value_parsed}
              </Text>
              <Text style={{
                fontSize: 11,
                color: 'white',
                textAlign: 'center',
              }}
              >
                {summary.netWorthEURCAD}
              </Text>
              <Text style={{
                fontSize: 14,
                color: 'white',
                textAlign: 'center',
              }}
              >
                {summary['net-worth-in-EUR'].title}
              </Text>
            </VStack>
          </HStack>
          <VStack
            height={395}
            maxW={330}
            bgColor={colors.brandLight}
            rounded="15"
            justifyContent="space-between"
          >
            <Stack
              style={{
                top: 1,
                position: 'absolute',
                marginLeft: 10,
              }}
            >
              {points[0].x !== 0 && (
                <Text
                  style={{
                    fontFamily: 'Montserrat',
                    fontSize: 15,
                    textAlign: 'flex-start',
                  }}
                >
                  {`${new Date(points[0].x).toLocaleString('default', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}:\n`}
                  {dashboard.map((chart, index) => (
                    <Text color={chart.color}>
                      {` –– ${chart.label}: ${points[index].y || '-'} ${chart.currency_symbol}\n`}
                    </Text>
                  ))}
                </Text>
              )}
            </Stack>
            <VictoryChart
              width={350}
              height={360}
              domainPadding={2}
              containerComponent={(
                <VictoryVoronoiContainer
                  voronoiDimension="x"
                  labels={({ datum }) => datum.childName}
                  labelComponent={<Cursor/>}
                  onActivated={updatePoint}
                />
              )}
            >
              <VictoryAxis
                tickValues={[
                  +new Date(2022, 0, 15),
                  +new Date(2022, 1, 15),
                  +new Date(2022, 2, 15),
                  +new Date(2022, 3, 15),
                  +new Date(2022, 4, 15),
                  +new Date(2022, 5, 15),
                ]}
                tickFormat={(x) => (new Date(x).toLocaleString('default', { month: 'short' }))}
                style={{
                  tickLabels: {
                    fontSize: 15,
                    padding: 15
                  },
                }}
              />
              <VictoryAxis
                dependentAxis
                tickCount={6}
                tickFormat={(x) => (`$${x / 1000}k`)}
              />
              {dashboard.map((chart) => (
                <VictoryLine
                  style={{
                    data: {
                      stroke: chart.color,
                      strokeWidth: 2,
                    },
                  }}
                  data={chart.entries}
                  name={chart.label}
                />
              ))}
            </VictoryChart>
          </VStack>
          <UIButton
            text="Refresh"
            loading={loading}
            onPress={fetchData}
            style={{ margin: 30 }}
          />
        </Stack>
      )}
      {loading && <Loading/>}
    </Stack>
  );
};

export default Dashboard;
