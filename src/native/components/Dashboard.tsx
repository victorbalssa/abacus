import React from 'react';
import { ViewStyle } from 'react-native';
import {
  Box,
  HStack,
  Icon,
  Text,
  VStack,
} from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../constants/colors';
import UIButton from './UI/UIButton';
import RangeSelect from './UI/RangeSelect';
import { HomeDisplayType } from '../../models/firefly';

type DashboardType = {
  range: number,
  loading: boolean,
  netWorth: HomeDisplayType[],
  spent: HomeDisplayType[],
  earned: HomeDisplayType[],
  balance: HomeDisplayType[],
  fetchData: () => Promise<void>,
  handleChangeRange: (value: object) => Promise<void>,
}

const Dashboard = ({
  range,
  netWorth,
  spent,
  earned,
  balance,
  loading,
  fetchData,
  handleChangeRange,
}: DashboardType) => (
  <Box flex={1} safeAreaTop>
    <Box marginLeft={8}>
      <Text
        style={{
          fontSize: 30,
          paddingTop: 15,
          paddingBottom: 15,
        }}
      >
        Q2 2022.
      </Text>
    </Box>
    <Box flex={1} shadow="3" alignItems="center">
      <HStack flexWrap="wrap" justifyContent="center" alignItems="center">
        {netWorth.map((nw) => (
          <VStack
            key={nw.title}
            minW={160}
            maxW={160}
            height={65}
            margin={1}
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
              {nw.value_parsed}
            </Text>
            <Text style={{
              fontSize: 14,
              fontFamily: 'Montserrat',
              color: 'white',
              textAlign: 'center',
            }}
            >
              {nw.title}
            </Text>
          </VStack>
        ))}
      </HStack>
      <HStack flexWrap="wrap" justifyContent="center" alignItems="center">
        {spent.map((s) => (
          <VStack
            key={s.title}
            minW={160}
            maxW={160}
            height={65}
            margin={1}
            padding={3}
            bg={{
              linearGradient: {
                colors: [colors.brandStyle1, colors.brandStyle1],
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
              {s.value_parsed}
            </Text>
            <Text style={{
              fontSize: 14,
              fontFamily: 'Montserrat',
              color: 'white',
              textAlign: 'center',
            }}
            >
              {s.title}
            </Text>
          </VStack>
        ))}
      </HStack>
      <HStack flexWrap="wrap" justifyContent="center" alignItems="center">
        {balance.map((s) => (
          <VStack
            key={s.title}
            minW={160}
            maxW={160}
            height={65}
            margin={1}
            padding={3}
            bg={{
              linearGradient: {
                colors: [colors.brandStyle2, colors.brandStyle2],
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
              {s.value_parsed}
            </Text>
            <Text style={{
              fontSize: 14,
              fontFamily: 'Montserrat',
              color: 'white',
              textAlign: 'center',
            }}
            >
              {s.title}
            </Text>
          </VStack>
        ))}
      </HStack>
      <HStack flexWrap="wrap" justifyContent="center" alignItems="center">
        {earned.map((s) => (
          <VStack
            key={s.title}
            minW={160}
            maxW={160}
            height={65}
            margin={1}
            padding={3}
            bg={{
              linearGradient: {
                colors: [colors.brandStyle3, colors.brandStyle3],
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
              {s.value_parsed}
            </Text>
            <Text style={{
              fontSize: 14,
              fontFamily: 'Montserrat',
              color: 'white',
              textAlign: 'center',
            }}
            >
              {s.title}
            </Text>
          </VStack>
        ))}
      </HStack>
      <UIButton
        text="Refresh"
        loading={loading}
        onPress={fetchData}
        icon={(
          <Icon
            as={Ionicons}
            name="refresh"
            style={{
              color: '#fff',
              fontSize: 15,
              paddingRight: 10,
              marginLeft: 10,
              paddingLeft: 5,
            } as ViewStyle}
          />
            )}
        style={{
          margin: 15,
          height: 35,
        }}
      />
    </Box>
    <RangeSelect range={range} handleChangeRange={handleChangeRange} />
  </Box>
);

export default Dashboard;
