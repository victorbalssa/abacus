import React, { useMemo, useState } from 'react';
import {
  RefreshControl,
  View,
} from 'react-native';
import {
  HStack,
  Text,
  VStack,
  ScrollView,
  Box,
  Skeleton,
  Progress,
  Stack,
} from 'native-base';
import { HoldItem, HoldMenuProvider } from 'react-native-hold-menu';

import { useDispatch, useSelector } from 'react-redux';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import NavigationHeader from './UI/NavigationHeader';
import { translate } from '../i18n/locale';
import { localNumberFormat, useThemeColors } from '../lib/common';
import { RootDispatch, RootState } from '../store';
import TabControl from './TabControl';
import Filters from './UI/Filters';

const InsightCategories = () => {
  const { colors } = useThemeColors();
  const {
    categories: {
      getInsightCategories,
    },
  } = useDispatch<RootDispatch>();
  const insightCategories = useSelector((state: RootState) => state.categories.insightCategories);
  const { loading } = useSelector((state: RootState) => state.loading.effects.categories.getInsightCategories);

  return (
    <ScrollView
      refreshControl={(
        <RefreshControl
          refreshing={false}
          onRefresh={getInsightCategories}
          tintColor={colors.brandStyle}
        />
      )}
    >
      <Box mt={1} backgroundColor={colors.tileBackgroundColor} borderTopWidth={1} borderBottomWidth={1} borderColor={colors.listBorderColor}>
        {insightCategories.map((category, index) => (
          <HStack
            key={category.name}
            ml={5}
            pr={2}
            h={45}
            alignItems="center"
            justifyContent="space-between"
            borderBottomWidth={index + 1 === insightCategories.length ? 0 : 1}
            borderColor={colors.listBorderColor}
          >
            <Text>
              {category.name}
            </Text>

            {!loading ? (
              <Text>
                {localNumberFormat(category.currency_code, category.difference_float)}
              </Text>
            ) : (
              <Skeleton w={70} h={5} rounded={15} />
            )}
          </HStack>
        ))}
      </Box>
      <View style={{ height: 370 }} />
    </ScrollView>
  );
};

const InsightBudgets = () => {
  const { colors } = useThemeColors();
  const {
    budgets: {
      getInsightBudgets,
    },
  } = useDispatch<RootDispatch>();
  const insightBudgets = useSelector((state: RootState) => state.budgets.insightBudgets);
  const { loading } = useSelector((state: RootState) => state.loading.effects.budgets.getInsightBudgets);

  return (
    <ScrollView
      refreshControl={(
        <RefreshControl
          refreshing={false}
          onRefresh={getInsightBudgets}
          tintColor={colors.brandStyle}
        />
      )}
    >
      <Box mt={1} backgroundColor={colors.tileBackgroundColor} borderTopWidth={1} borderBottomWidth={1} borderColor={colors.listBorderColor}>
        {insightBudgets.map((budget, index) => (
          <Stack
            key={budget.name}
          >
            <VStack
              ml={5}
              pr={2}
              h={55}
              justifyContent="center"
              borderBottomWidth={index + 1 === insightBudgets.length ? 0 : 1}
              borderColor={colors.listBorderColor}
            >
              <HStack
                justifyContent="space-between"
                alignItems="center"
              >
                <Text>
                  {budget.name}
                </Text>

                {!loading ? (
                  <Text>
                    {localNumberFormat(budget.currency_code, budget.difference_float)}
                    /
                    {localNumberFormat(budget.currency_code, budget.limit)}
                  </Text>
                ) : (
                  <Skeleton w={140} h={5} rounded={15} />
                )}
              </HStack>
              <Progress
                colorScheme={-budget.difference_float > budget.limit ? 'danger' : 'success'}
                value={((-budget.difference_float * 100) / budget.limit) || 0}
                h={3}
                my={2}
              />
            </VStack>
          </Stack>
        ))}
      </Box>
      <View style={{ height: 370 }} />
    </ScrollView>
  );
};

const AssetsAccounts = () => {
  const { colors } = useThemeColors();
  const {
    accounts: {
      getAccounts,
    },
  } = useDispatch<RootDispatch>();
  const accounts = useSelector((state: RootState) => state.accounts.accounts);
  const { loading } = useSelector((state: RootState) => state.loading.effects.accounts.getAccounts);

  return (
    <ScrollView
      refreshControl={(
        <RefreshControl
          refreshing={false}
          onRefresh={getAccounts}
          tintColor={colors.brandStyle}
        />
      )}
    >
      <Box mt={1} backgroundColor={colors.tileBackgroundColor} borderTopWidth={1} borderBottomWidth={1} borderColor={colors.listBorderColor}>
        {accounts && accounts?.filter((a) => a.attributes.active).map((account, index) => (
          <HStack
            key={account.attributes.name}
            ml={5}
            pr={2}
            h={45}
            alignItems="center"
            justifyContent="space-between"
            borderBottomWidth={index + 1 === accounts?.filter((a) => a.attributes.active).length ? 0 : 1}
            borderColor={colors.listBorderColor}
          >
            <Text>
              {account.attributes.name}
              {' '}
              <Text style={{ fontSize: 10 }}>
                {account.attributes.include_net_worth ? '' : '(*)'}
              </Text>
            </Text>

            {!loading ? (
              <Text>
                {localNumberFormat(account.attributes.currency_code, account.attributes.current_balance)}
              </Text>
            ) : (
              <Skeleton w={70} h={5} rounded={15} />
            )}
          </HStack>
        ))}
      </Box>
      <View style={{ height: 370 }} />
    </ScrollView>
  );
};

const Home = ({
  netWorth,
  balance,
  loading,
}) => {
  const { colorScheme, colors } = useThemeColors();
  const safeAreaInsets = useSafeAreaInsets();
  const [tab, setTab] = useState('home_accounts');

  return (useMemo(() => (
    <HoldMenuProvider safeAreaInsets={safeAreaInsets} theme={colorScheme}>
      <View>
        <View style={{ height: 100 }} />

        {netWorth && netWorth[0] && (
        <VStack pt={4} alignItems="center">

          {!loading ? (
            <Text style={{
              fontSize: 27,
              lineHeight: 30,
              fontFamily: 'Montserrat_Bold',
            }}
            >
              {localNumberFormat(netWorth[0].currency_code, netWorth[0].monetary_value)}
            </Text>
          ) : (
            <Skeleton w={170} h={8} rounded={15} />
          )}
          <Text style={{
            fontSize: 13,
            fontFamily: 'Montserrat_Light',
            color: 'gray',
          }}
          >
            {`${translate('home_net_worth')} (${netWorth[0].currency_code})`}
          </Text>
        </VStack>
        )}

        {balance && balance[0] && (
        <VStack p={1} pb={2} justifyContent="center" alignItems="center">
          {!loading ? (
            <Box style={{
              backgroundColor: balance[0].monetary_value < 0 ? colors.brandNeutralLight : colors.brandSuccessLight,
              borderRadius: 10,
              paddingHorizontal: 5,
            }}
            >
              <Text style={{
                fontSize: 13,
                fontFamily: 'Montserrat_Bold',
                textAlign: 'center',
                color: balance[0].monetary_value < 0 ? colors.brandNeutral : colors.brandSuccess,
              }}
              >
                {`${balance[0].monetary_value > 0 ? '+' : ''}${localNumberFormat(balance[0].currency_code, balance[0].monetary_value)}`}
              </Text>
            </Box>
          ) : (
            <Skeleton w={50} h={4} rounded={15} />
          )}
        </VStack>
        )}

        <Filters />
        <TabControl
          values={['home_accounts', 'home_categories', 'home_budgets']}
          onChange={setTab}
        />
        {tab === 'home_accounts' && <AssetsAccounts />}
        {tab === 'home_categories' && <InsightCategories />}
        {tab === 'home_budgets' && <InsightBudgets />}
        <View style={{ height: 240 }} />
        <NavigationHeader />
      </View>
    </HoldMenuProvider>
  ), [
    loading,
    netWorth,
    balance,
    tab,
  ]));
};

export default Home;
