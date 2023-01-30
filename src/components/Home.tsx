import React from 'react';
import {
  RefreshControl,
  View,
} from 'react-native';
import {
  HStack,
  Text,
  VStack,
  ScrollView,
  Heading,
  Box,
  Skeleton,
} from 'native-base';
import Animated, { Layout } from 'react-native-reanimated';

import colors from '../constants/colors';
import RangeTitle from './UI/RangeTitle';
import { translate } from '../i18n/locale';

const Home = ({
  accounts,
  netWorth,
  balance,
  fetchData,
  loading,
}) => (
  <>
    <RangeTitle />
    <Animated.View layout={Layout}>
      {netWorth && netWorth[0] && (
      <VStack pt={4} alignItems="center">

        {!loading ? (
          <Text style={{
            fontSize: 27,
            lineHeight: 30,
            fontFamily: 'Montserrat_Bold',
          }}
          >
            {netWorth[0].value_parsed}
          </Text>
        ) : (
          <Skeleton w={170} h={8} rounded={15} />
        )}
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
        {!loading ? (
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
        ) : (
          <Skeleton w={50} h={4} rounded={15} />
        )}
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
        <Heading mx={2} py={2} pt={5} size="sm">{translate('home_assetsAccount_title')}</Heading>
        <Box borderTopWidth={1} borderBottomWidth={1} borderColor="gray.200">
          {accounts && accounts?.filter((a) => a.attributes.active).map((account, index) => (
            <HStack
              key={account.attributes.name}
              mx={3}
              py={2}
              minH={45}
              alignItems="center"
              justifyContent="space-between"
              borderBottomWidth={index + 1 === accounts?.filter((a) => a.attributes.active).length ? 0 : 1}
              borderColor="gray.200"
            >
              <Text style={{ fontFamily: 'Montserrat' }}>
                {account.attributes.name}
                {' '}
                <Text style={{
                  fontSize: 10,
                  fontFamily: 'Montserrat',
                  color: colors.brandDanger,
                }}
                >
                  {account.attributes.include_net_worth ? '' : '(*)'}
                </Text>
              </Text>

              {!loading ? (
                <Text style={{
                  fontFamily: 'Montserrat_Bold',
                  color: account.attributes.current_balance < 0 ? colors.brandDanger : colors.brandStyle3,
                }}
                >
                  {account.attributes.current_balance_formatted}
                </Text>
              ) : (
                <Skeleton w={70} h={5} rounded={15} />
              )}
            </HStack>
          ))}
        </Box>
        <View style={{ height: 140 }} />
      </ScrollView>

    </Animated.View>
  </>
);

export default Home;
