import React from 'react';
import {
  View,
  Text,
} from 'react-native';
import {
  VStack,
  HStack,
  IconButton,
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

import colors from '../../constants/colors';
import Loading from '../UI/Loading';

const BalanceHistoryChart = ({
  loading,
  end,
  range,
  balances,
  fetchBalances,
}) => {
  const getTickValues = () => [...Array(+range + 1).keys()];

  const displayTick = (x: number) => {
    const currentDate = new Date(end);
    const quarter = Math.floor((currentDate.getMonth() + 3) / 3) - 1;
    const semi = Math.floor((currentDate.getMonth() + 6) / 6);
    currentDate.setDate(1);
    switch (+range) {
      case 1:
        currentDate.setMonth(x - 1);
        break;
      case 3:
        currentDate.setMonth(x + (+range * (quarter)) - 1);
        break;
      case 6:
        currentDate.setMonth(x + (+range * (semi - 1)) - 1);
        break;
      case 12:
        currentDate.setMonth(x - 1);
        break;
      default:
        currentDate.setMonth(x - 1);
        break;
    }

    return currentDate.toLocaleString('default', { month: 'short' });
  };

  if (isEmpty(balances)) {
    return <View><Text>No Data/Endpoint</Text></View>;
  }

  return (
    <VStack
      mt={2}
      bgColor={colors.brandLight}
      borderWidth={0.5}
      borderColor="#E3E3E3FF"
      justifyContent="center"
      borderRadius={5}
    >
      <HStack
        justifyContent="flex-end"
        style={{
          marginTop: 10,
          paddingTop: 0,
          paddingLeft: 15,
          paddingBottom: 0,
        }}
      >
        <IconButton
          _icon={{
            as: AntDesign,
            name: 'reload1',
          }}
          onPress={fetchBalances}
          onPressOut={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
        />
      </HStack>
      {loading && (
        <VStack m={2} justifyContent="center" borderRadius={10}>
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
                fill: colors.brandDarkLight,
                fontWeight: 600,
              },
            }}
          />

          <VictoryAxis
            offsetY={135}
            minDomain={{ x: 0 }}
            tickValues={getTickValues()}
            tickFormat={(x) => displayTick(x)}
            style={{
              axis: { stroke: colors.brandLight },
              tickLabels: {
                fill: colors.brandDarkLight,
                fontWeight: 600,
                angle: getTickValues().length > 7 ? -40 : 0,
              },
            }}
          />

          <VictoryBar
            key="gain"
            cornerRadius={{ top: ({ datum }) => ((datum._y === 0) ? 0 : 7) }}
            style={{
              data: {
                fill: colors.brandStyle70,
                width: 15,
              },
            }}
            data={balances[0]}
            name="gain"
          />
          <VictoryBar
            key="loose"
            cornerRadius={{ top: ({ datum }) => ((datum._y === 0) ? 0 : 7) }}
            style={{
              data: {
                fill: colors.brandStyle20,
                width: 15,
              },
            }}
            data={balances[1].map((d) => -d)}
            name="loose"
          />
          <VictoryLine
            key="lineBalance"
            style={{
              data: {
                stroke: '#a6a6a6',
                strokeWidth: 2,
              },
            }}
            interpolation="monotoneX"
            data={balances[0].map((d, i) => d - balances[1][i])}
            name="lineBalance"
          />
          <VictoryScatter
            key="ptsBalance"
            style={{
              data: {
                fill: colors.brandPrimary,
                stroke: ({ datum }) => ((datum._y < 0) ? colors.brandDanger : colors.brandSuccess),
                strokeWidth: 5,
              },
              labels: {
                fontSize: 12,
                fontWeight: 600,
                fill: ({ datum }) => ((datum._y < 0) ? colors.brandDanger : colors.brandSuccess),
              },
            }}
            size={7}
            labels={({ datum }) => (datum._y !== 0 ? `${(round(datum._y / 1000, 1))}k` : '')}
            data={balances[0].map((d, i) => d - balances[1][i])}
            name="ptsBalance"
          />
        </VictoryChart>
      )}
    </VStack>
  );
};

export default BalanceHistoryChart;
