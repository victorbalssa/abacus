import React from 'react';
import {
  Box, HStack, ScrollView, Stack, Text, VStack,
} from 'native-base';

import {
  Curve,
  VictoryAxis,
  VictoryBar,
  VictoryChart, VictoryCursorContainer,
  VictoryLine,
  VictoryScatter,
  VictoryTheme, VictoryTooltip,
  VictoryVoronoiContainer,
} from 'victory-native';

import { RefreshControl } from 'react-native';
import Svg from 'react-native-svg';
import Loading from './UI/Loading';
import colors from '../../constants/colors';

const data = [
  {
    quarter: 1,
    earnings: -20000,
  },
  {
    quarter: 2,
    earnings: 16500,
  },
  {
    quarter: 3,
    earnings: 14250,
  },
  {
    quarter: 4,
    earnings: 19000,
  },
];

const Dashboard = ({
  summary,
  dashboard,
  loading,
  fetchData,
}) => {
  const data = Object.keys(dashboard[0].entries)
    .map((key, index) => {
      const value = dashboard[0].entries[key];
      const date = new Date(key.replace(/T.*/, ''));

      return {
        x: +date,
        y: value,
      };
    });

  const data2 = Object.keys(dashboard[1].entries)
    .map((key, index) => {
      const value = dashboard[1].entries[key];
      const date = new Date(key.replace(/T.*/, ''));

      return {
        x: +date,
        y: value,
      };
    });

  const data3 = Object.keys(dashboard[2].entries)
    .map((key, index) => {
      const value = dashboard[2].entries[key];
      const date = new Date(key.replace(/T.*/, ''));

      return {
        x: +date,
        y: value,
      };
    });

  return (
    <Stack flex={1}>
      <Box alignItems="center" paddingTop={50} />
      <ScrollView
        refreshControl={(
          <RefreshControl
            onRefresh={fetchData}
            refreshing={loading}
          />
        )}
      >
        <Box alignItems="center">
          <Text>
            Net worth.
          </Text>
          <Text style={{
            fontSize: 40,
            padding: 25,
          }}
          >
            {summary.netWorth}
          </Text>
        </Box>
        {summary && !loading && (
          <Stack space={3} shadow="3" justifyContent="center" alignItems="center">
            <HStack space={3} justifyContent="center">
              <VStack
                minW={155}
                maxW={155}
                minH={100}
                padding={4}
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
                minW={155}
                maxW={155}
                padding={4}
                bg={{
                  linearGradient: {
                    colors: [colors.brandStyle, colors.brandStyleSecond],
                    start: [0, 1],
                    end: [1, 0],
                  },
                }}
                rounded="15"
                justifyContent="flex-start"
                alignItems="flex-start"
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
              maxH={280}
              maxW={330}
              bg={{
                linearGradient: {
                  colors: [colors.brandLight, colors.brandLight],
                  start: [0, 0.5],
                  end: [1, 1],
                },
              }}
              paddingBottom={5}
              rounded="15"
              marginBottom={140}
              justifyContent="center"
              alignItems="center"
            >
              <VictoryChart
                width={330}
                domainPadding={10}
                style={{
                  grid: {
                    stroke: '#ddd444',
                    strokeWidth: 0,
                  },
                }}
                containerComponent={(
                  <VictoryVoronoiContainer
                    labels={({ datum }) => `${datum.y}`}
                    labelComponent={(
                      <VictoryTooltip
                        flyoutStyle={{
                          stroke: '',
                          strokeWidth: 2,
                        }}
                        centerOffset={{
                          x: 10,
                          y: -30,
                        }}
                      />
                    )}
                  />
                )}
              >
                <VictoryAxis
                  //tickFormat={['Jan', 'Jan', 'Jan', 'Jan']}
                  tickFormat={(x) => (new Date(Math.round(x)).toLocaleString('default', { month: 'long' }))}
                  style={{
                    grid: { strokeWidth: 0 },
                  }}
                />
                <VictoryAxis
                  dependentAxis
                  tickFormat={(x) => (`$${x / 1000}k`)}
                  style={{
                    grid: { strokeWidth: 0 },
                  }}
                />
                <VictoryLine
                  style={{
                    data: {
                      stroke: '#FFF',
                      strokeWidth: 2,
                    },
                    parent: { border: '2px solid #ccc' },
                  }}
                  animate={{
                    duration: 2000,
                    onLoad: { duration: 1000 },
                  }}
                  data={data}
                  interpolation="natural"
                />
                <VictoryLine
                  style={{
                    data: {
                      stroke: '#df5314',
                      strokeWidth: 2,
                    },
                    parent: { border: '2px solid #ccc' },
                  }}
                  animate={{
                    duration: 2000,
                    onLoad: { duration: 1000 },
                  }}
                  data={data2}
                  interpolation="natural"
                />
                <VictoryLine
                  style={{
                    data: {
                      stroke: '#121212',
                      strokeWidth: 2,
                    },
                    parent: { border: '2px solid #ccc' },
                  }}
                  animate={{
                    duration: 2000,
                    onLoad: { duration: 1000 },
                  }}
                  data={data3}
                  interpolation="natural"
                />
              </VictoryChart>
            </VStack>
          </Stack>
        )}
        {loading && <Loading />}
      </ScrollView>
    </Stack>
  );
};

export default Dashboard;
