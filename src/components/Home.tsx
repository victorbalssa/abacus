import React from 'react';
import {
  RefreshControl,
  View,
} from 'react-native';
import {
  HStack,
  Text,
  VStack,
  ScrollView, Heading, Box, Switch, AlertDialog, Button,
} from 'native-base';
import Animated, { Layout, SlideInUp, SlideOutUp } from 'react-native-reanimated';

import * as Linking from 'expo-linking';
import { AntDesign } from '@expo/vector-icons';
import * as Application from 'expo-application';
import colors from '../constants/colors';
import RangeTitle from './UI/RangeTitle';
import CurrencySwitcher from './UI/CurrencySwitcher';

const Home = ({
  accounts,
  netWorth,
  balance,
  fetchData,
}) => (
  <>
    <RangeTitle />
    <Animated.View layout={Layout}>
      {netWorth && netWorth[0] && (
      <VStack pt={4} alignItems="center">
        <Text style={{
          fontSize: 27,
          lineHeight: 30,
          fontFamily: 'Montserrat_Bold',
        }}
        >
          {netWorth[0].value_parsed}
        </Text>
        <Text style={{
          fontSize: 12,
          fontFamily: 'Montserrat_Light',
          color: 'gray',
        }}
        >
          {netWorth[0].title}
        </Text>
      </VStack>
      )}

      {balance && balance[0] && (
      <VStack p={1} justifyContent="center" alignItems="center">
        <Box style={{
          backgroundColor: balance[0].monetary_value < 0 ? colors.brandDangerLight : colors.brandSuccessLight,
          borderColor: balance[0].monetary_value < 0 ? colors.brandDangerLight : colors.brandSuccessLight,
          borderRadius: 15,
          borderRightWidth: 6,
          borderLeftWidth: 6,
        }}
        >
          <Text style={{
            fontSize: 13,
            fontFamily: 'Montserrat_Bold',
            textAlign: 'center',
            color: balance[0].monetary_value < 0 ? colors.brandDanger : colors.brandStyle3,
          }}
          >
            {`${balance[0].monetary_value > 0 ? '+' : ''}${balance[0].value_parsed}`}
          </Text>
        </Box>
      </VStack>
      )}

      <ScrollView
        pt={2}
        refreshControl={(
          <RefreshControl
            refreshing={false}
            onRefresh={fetchData}
            tintColor={colors.brandStyle}
          />
      )}
      >
        <Heading mx={2} py={2} pt={5} size="sm">Asset accounts</Heading>
        <Box borderTopWidth={1} borderBottomWidth={1} borderColor="gray.200">
          {accounts && accounts?.map((account, index) => (
            <HStack key={account.attributes.name} mx={3} py={2} minH={45} alignItems="center" justifyContent="space-between" borderBottomWidth={index + 1 === accounts.length ? 0 : 1} borderColor="gray.200">
              <Text style={{ fontFamily: 'Montserrat' }}>
                {account.attributes.name}
                {' '}
                <Text style={{ fontSize: 10, fontFamily: 'Montserrat', color: colors.brandDanger }}>{account.attributes.include_net_worth ? '' : '(*)'}</Text>
              </Text>
              <Text style={{ fontFamily: 'Montserrat_Bold', color: account.attributes.current_balance < 0 ? colors.brandDanger : colors.brandStyle3 }}>{account.attributes.current_balance_formatted}</Text>
            </HStack>
          ))}
        </Box>
        <View style={{ height: 140 }} />
      </ScrollView>

    </Animated.View>
  </>
);

export default Home;
