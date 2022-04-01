import React from 'react';
import {
  Box, HStack, ScrollView, Stack, Text, VStack,
} from 'native-base';

import { useWorkletCallback } from 'react-native-reanimated';
import {
  ChartDot,
  ChartPath,
  ChartPathProvider,
  ChartXLabel,
  ChartYLabel,
  monotoneCubicInterpolation,
} from '@rainbow-me/animated-charts';

import { RefreshControl } from 'react-native';
import Loading from './UI/Loading';
import colors from '../../constants/colors';

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

  const points = monotoneCubicInterpolation({
    data,
    range: 100,
  });

  const formatTimestamp = useWorkletCallback(
    (value) => {
      'worklet';

      if (value === '') {
        return '';
      }

      return new Date(Math.round(value)).toLocaleDateString('fr-FR');
    },
  );

  const formatDollars = useWorkletCallback(
    (value) => {
      'worklet';

      if (value === '') {
        return '';
      }

      const val = parseFloat(value)
        .toFixed(2);

      return `${val} $`;
    },
  );

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
              minH={300}
              maxW={330}
              padding={3}
              bg={{
                linearGradient: {
                  colors: [colors.brandLight, colors.brandLight],
                  start: [0, 0.5],
                  end: [1, 1],
                },
              }}
              rounded="15"
              marginBottom={140}
              justifyContent="center"
              alignItems="flex-start"
            >
              <ChartPathProvider data={{
                points,
                smoothingStrategy: 'bezier',
              }}
              >
                <ChartPath
                  strokeWidth={3}
                  selectedStrokeWidth={3}
                  height={200}
                  stroke="white"
                  width={300}
                />
                <ChartDot style={{
                  backgroundColor: 'white',
                  margin: 13,
                  marginTop: 12,
                }}
                />
                <ChartYLabel
                  format={formatDollars}
                  style={{
                    color: 'white',
                    fontFamily: 'Montserrat_Bold',
                    fontSize: 20,
                    margin: 4,
                  }}
                />
                <ChartXLabel
                  format={formatTimestamp}
                  style={{
                    color: 'white',
                    fontFamily: 'Montserrat',
                    fontSize: 14,
                    margin: 4,
                  }}
                />
              </ChartPathProvider>
            </VStack>
          </Stack>
        )}
        {loading && <Loading />}
      </ScrollView>
    </Stack>
  );
};

export default Dashboard;
