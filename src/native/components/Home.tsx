import React from 'react';
import { RefreshControl, StyleSheet, View } from 'react-native';
import {
  Box,
  HStack,
  Text,
  VStack,
  ScrollView,
} from 'native-base';
import colors from '../../constants/colors';
import { HomeDisplayType } from '../../models/firefly';
import RangeTitle from './UI/RangeTitle';

type DashboardType = {
  loading: boolean,
  netWorth: HomeDisplayType[],
  spent: HomeDisplayType[],
  earned: HomeDisplayType[],
  balance: HomeDisplayType[],
  fetchData: () => Promise<void>,
}

const Home = ({
  netWorth,
  spent,
  earned,
  balance,
  loading,
  fetchData,
}: DashboardType) => (
  <>
    <RangeTitle />
    <ScrollView
      p={3}
      shadow={3}
      _contentContainerStyle={{
        alignItems: 'center',
      }}
      refreshControl={(
        <RefreshControl
          refreshing={loading}
          onRefresh={fetchData}
          tintColor={colors.brandStyle}
        />
        )}
    >
      <HStack flexWrap="wrap" justifyContent="center" alignItems="center">
        {netWorth.map((nw) => (
          <VStack
            minW={165}
            key={nw.title}
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
            minW={165}
            key={s.title}
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
            minW={165}
            key={s.title}
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
            minW={165}
            key={s.title}
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
      <View style={{ height: 100 }} />
    </ScrollView>
  </>
);

export default Home;
