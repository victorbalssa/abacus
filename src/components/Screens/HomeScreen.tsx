import React, {
  useEffect,
  useMemo,
  useRef,
  useCallback,
} from 'react';
import {
  Box,
  HStack,
  Progress,
  ScrollView,
  Skeleton,
  Stack,
  Text,
  useToast,
  View,
  VStack,
} from 'native-base';
import { useSelector, useDispatch } from 'react-redux';
import { CommonActions, useFocusEffect, useScrollToTop } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  RefreshControl,
  TouchableOpacity,
  Animated,
  Switch,
} from 'react-native';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
import type { PagerViewOnPageScrollEventData } from 'react-native-pager-view';
import PagerView from 'react-native-pager-view';

import { FontAwesome, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { RootDispatch, RootState } from '../../store';
import secureKeys from '../../constants/oauth';
import ToastAlert from '../UI/ToastAlert';
import translate from '../../i18n/locale';
import { isValidHttpUrl, localNumberFormat, useThemeColors } from '../../lib/common';

import { ScreenType } from './types';
import Pagination from '../UI/Pagination';
import { AStack } from '../UI/ALibrary';

const AnimatedPagerView = Animated.createAnimatedComponent(PagerView);

function AssetsAccounts() {
  const { colors } = useThemeColors();
  const accounts = useSelector((state: RootState) => state.accounts.accounts);
  const displayAllAccounts = useSelector((state: RootState) => state.configuration.displayAllAccounts);
  const loading = useSelector((state: RootState) => state.loading.effects.accounts.getAccounts?.loading);
  const dispatch = useDispatch<RootDispatch>();

  const onSwitch = async (bool: boolean) => {
    dispatch.configuration.setDisplayAllAccounts(bool);
    dispatch.accounts.getAccounts();
    return Promise.resolve();
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      refreshControl={(
        <RefreshControl
          refreshing={false}
          onRefresh={() => Promise.all([
            dispatch.accounts.getAccounts(),
            dispatch.firefly.getNetWorth(),
          ])}
        />
      )}
    >
      <View>
        <AStack px={15} py={15} row justifyContent="space-between">
          <Text
            style={{
              fontFamily: 'Montserrat_Bold',
              color: colors.text,
              fontSize: 25,
              lineHeight: 27,
            }}
          >
            {displayAllAccounts ? translate('home_all_accounts') : translate('home_accounts')}
          </Text>
          <Switch thumbColor={colors.text} trackColor={{ false: '#767577', true: colors.brandStyle }} onValueChange={onSwitch} value={displayAllAccounts} />
        </AStack>
        {accounts && accounts.filter((a) => a.display || displayAllAccounts).map((account, index) => (
          <HStack
            key={account.id}
            mx={4}
            h={45}
            alignItems="center"
            justifyContent="space-between"
            borderBottomWidth={index + 1 === accounts.length ? 0 : 0.5}
            borderColor={colors.listBorderColor}
          >
            <Text
              maxW="60%"
              numberOfLines={1}
            >
              {account.attributes.name}
              <Text style={{ fontSize: 10 }}>
                {account.attributes.includeNetWorth ? '' : '*'}
              </Text>
            </Text>

            {!loading ? (
              <Text
                maxW="39%"
                numberOfLines={1}
              >
                {localNumberFormat(account.attributes.currencyCode, parseFloat(account.attributes.currentBalance))}
              </Text>
            ) : (
              <Skeleton w={70} h={5} rounded={10} />
            )}
          </HStack>
        ))}
        <Text style={{ fontSize: 10, paddingHorizontal: 10 }}>
          {translate('account_not_included_in_net_worth')}
        </Text>
        <View style={{ height: 150 }} />
      </View>
    </ScrollView>
  );
}

function InsightCategories() {
  const { colors } = useThemeColors();
  const insightCategories = useSelector((state: RootState) => state.categories.insightCategories);
  const loading = useSelector((state: RootState) => state.loading.effects.categories.getInsightCategories?.loading);
  const dispatch = useDispatch<RootDispatch>();

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      refreshControl={(
        <RefreshControl
          refreshing={loading}
          onRefresh={() => Promise.all([
            dispatch.categories.getInsightCategories(),
            dispatch.firefly.getNetWorth(),
          ])}
        />
      )}
    >
      <Box>
        <Text
          style={{
            fontFamily: 'Montserrat_Bold',
            margin: 15,
            color: colors.text,
            fontSize: 25,
            lineHeight: 27,
          }}
        >
          {translate('home_categories')}
        </Text>
        {insightCategories.map((category, index) => (
          <HStack
            key={category.name}
            mx={4}
            h={45}
            alignItems="center"
            justifyContent="space-between"
            borderBottomWidth={index + 1 === insightCategories.length ? 0 : 0.5}
            borderColor={colors.listBorderColor}
          >
            <Text
              maxW="70%"
              numberOfLines={1}
            >
              {category.name}
            </Text>

            {!loading ? (
              <Text
                maxW="30%"
                numberOfLines={1}
              >
                {localNumberFormat(category.currencyCode, (category.differenceFloat * -1))}
              </Text>
            ) : (
              <Skeleton w={70} h={5} rounded={10} />
            )}
          </HStack>
        ))}
      </Box>
      <View style={{ height: 150 }} />
    </ScrollView>
  );
}

function InsightBudgets() {
  const { colors } = useThemeColors();
  const insightBudgets = useSelector((state: RootState) => state.budgets.budgets);
  const loading = useSelector((state: RootState) => state.loading.effects.budgets.getInsightBudgets?.loading);
  const dispatch = useDispatch<RootDispatch>();

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      refreshControl={(
        <RefreshControl
          refreshing={loading}
          onRefresh={() => Promise.all([
            dispatch.budgets.getInsightBudgets(),
            dispatch.firefly.getNetWorth(),
          ])}
        />
      )}
    >
      <Box>
        <Text
          style={{
            fontFamily: 'Montserrat_Bold',
            margin: 15,
            color: colors.text,
            fontSize: 25,
            lineHeight: 27,
          }}
        >
          {translate('home_budgets')}
        </Text>
        {insightBudgets.filter((budget) => budget.attributes?.active).map((budget, index) => (
          <Stack
            key={budget.attributes.name}
          >
            <VStack
              mx={4}
              h={60}
              justifyContent="center"
              borderBottomWidth={index + 1 === insightBudgets.length ? 0 : 0.5}
              borderColor={colors.listBorderColor}
            >
              <HStack
                pt={1}
                justifyContent="space-between"
                alignItems="center"
              >
                <VStack
                  maxW="80%"
                  justifyContent="center"
                  alignItems="flex-start"
                >
                  <Text
                    numberOfLines={1}
                  >
                    {budget.attributes.name}
                  </Text>
                  <Text fontSize={10} numberOfLines={1}>
                    {localNumberFormat(budget.currencyCode, budget.differenceFloat < 0 ? (budget.differenceFloat * -1) : budget.differenceFloat)}
                    {' / '}
                    {localNumberFormat(budget.currencyCode, budget.limit)}
                  </Text>
                </VStack>

                {!loading ? (
                  <VStack
                    justifyContent="center"
                    alignItems="flex-end"
                  >
                    <Box style={{
                      backgroundColor: -budget.differenceFloat > budget.limit ? colors.brandNeutralLight : colors.brandSuccessLight,
                      borderRadius: 5,
                      paddingHorizontal: 5,
                    }}
                    >
                      <Text
                        numberOfLines={1}
                        style={{
                          fontSize: 14,
                          fontFamily: 'Montserrat_Bold',
                          textAlign: 'center',
                          color: -budget.differenceFloat > budget.limit ? colors.brandNeutral : colors.brandSuccess,
                        }}
                      >
                        {`${(budget.limit > 0 ? (((budget.differenceFloat * -1) * 100) / budget.limit).toFixed(0) : 0)}%`}
                      </Text>
                    </Box>
                  </VStack>
                ) : (
                  <VStack
                    justifyContent="center"
                    alignItems="flex-end"
                  >
                    <Skeleton w={10} h={5} rounded={5} />
                  </VStack>
                )}
              </HStack>
              <Progress
                colorScheme={-budget.differenceFloat > budget.limit ? 'danger' : 'success'}
                value={((-budget.differenceFloat * 100) / budget.limit) || 0}
                h={1}
                mt={1}
              />
            </VStack>
          </Stack>
        ))}
      </Box>
      <View style={{ height: 150 }} />
    </ScrollView>
  );
}

function NetWorth() {
  const { colors } = useThemeColors();
  const hideBalance = useSelector((state: RootState) => state.configuration.hideBalance);
  const netWorth = useSelector((state: RootState) => state.firefly.netWorth);
  const balance = useSelector((state: RootState) => state.firefly.balance);
  const currentCode = useSelector((state: RootState) => state.currencies.currentCode);
  const loading = useSelector((state: RootState) => state.loading.effects.firefly.getNetWorth?.loading);
  const dispatch = useDispatch<RootDispatch>();

  return useMemo(() => (
    <View testID="home_screen_net_worth" justifyContent="center">
      <TouchableOpacity onPress={() => dispatch.configuration.setHideBalance(!hideBalance)}>
        {netWorth && netWorth[0] && !hideBalance && (
        <VStack alignItems="center">
          <Text style={{
            fontSize: 11,
            fontFamily: 'Montserrat',
            color: colors.text,
          }}
          >
            {`${translate('home_net_worth')} • ${currentCode}`}
          </Text>
          <Skeleton isLoaded={!loading} speed={2} startColor={colors.brandWhiteOpacity} w={200} h={9} rounded={20}>
            <HStack alignItems="center">
              <Text
                style={{
                  fontSize: 35,
                  lineHeight: 37,
                  fontFamily: 'Montserrat_Bold',
                }}
              >
                {localNumberFormat(netWorth[0].currencyCode, parseFloat(netWorth[0].monetaryValue))}
              </Text>
            </HStack>
          </Skeleton>
        </VStack>
        )}

        {balance && balance[0] && !hideBalance && (
          <VStack p={1} justifyContent="center" alignItems="center">
            <Skeleton isLoaded={!loading} speed={2} startColor={colors.brandWhiteOpacity} w={70} h={5} mt={1} rounded={20}>
              <HStack style={{
                backgroundColor: parseFloat(balance[0].monetaryValue) < 0 ? colors.brandNeutralLight : colors.brandSuccessLight,
                borderRadius: 10,
                paddingHorizontal: 5,
              }}
              >
                <Text style={{
                  fontSize: 12,
                  fontFamily: 'Montserrat_Bold',
                  color: parseFloat(balance[0].monetaryValue) < 0 ? colors.brandNeutral : colors.brandSuccess,
                }}
                >
                  {`${parseFloat(balance[0].monetaryValue) > 0 ? '+' : ''}${localNumberFormat(balance[0].currencyCode, parseFloat(balance[0].monetaryValue))}`}
                </Text>
              </HStack>
            </Skeleton>
          </VStack>
        )}

        {hideBalance && (
          <View style={{
            height: 87, width: 200, justifyContent: 'center', alignItems: 'center',
          }}
          >
            <FontAwesome
              name={hideBalance ? 'eye-slash' : 'eye'}
              size={30}
              color={colors.text}
            />
          </View>
        )}
      </TouchableOpacity>
    </View>
  ), [
    loading,
    hideBalance,
    colors,
    netWorth,
    balance,
    currentCode,
  ]);
}

export default function HomeScreen({ navigation }: ScreenType) {
  const { colors, colorScheme } = useThemeColors();
  const toast = useToast();
  const safeAreaInsets = useSafeAreaInsets();
  const start = useSelector((state: RootState) => state.firefly.rangeDetails.start);
  const end = useSelector((state: RootState) => state.firefly.rangeDetails.end);
  const currentCode = useSelector((state: RootState) => state.currencies.currentCode);
  const backendURL = useSelector((state: RootState) => state.configuration.backendURL);
  const dispatch = useDispatch<RootDispatch>();
  const renderIcons = [
    <Ionicons key="wallet" name="wallet" size={22} color={colors.text} />,
    <Ionicons key="pricetag" name="pricetags" size={22} color={colors.text} />,
    <MaterialCommunityIcons key="progress-check" name="progress-check" size={22} color={colors.text} />,
  ];

  const goToOauth = () => navigation.dispatch(
    CommonActions.reset({
      index: 0,
      routes: [
        { name: 'oauth' },
      ],
    }),
  );

  useEffect(() => {
    (async () => {
      const accessToken = await SecureStore.getItemAsync(secureKeys.accessToken);
      if (accessToken && isValidHttpUrl(backendURL)) {
        axios.defaults.headers.Authorization = `Bearer ${accessToken}`;

        try {
          dispatch.configuration.testAccessToken();
          dispatch.currencies.getCurrencies();
        } catch (e) {
          toast.show({
            render: ({ id }) => (
              <ToastAlert
                onClose={() => toast.close(id)}
                title={translate('home_container_error_title')}
                status="error"
                variant="solid"
                description={`${translate('home_container_error_description')}, ${e.message}`}
              />
            ),
          });
        }
      } else {
        goToOauth();
      }
    })();
  }, []);

  const prevFiltersRef = useRef<string>();
  const viewPagerRef = useRef<PagerView>();
  const scrollRef = useRef(null);

  useScrollToTop(scrollRef);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const fetchData = () => {
        if (isActive && axios.defaults.headers.Authorization) {
          dispatch.firefly.getNetWorth();
          dispatch.accounts.getAccounts();
          dispatch.categories.getInsightCategories();
          dispatch.budgets.getInsightBudgets();
        }
      };

      if (prevFiltersRef.current !== `${start}-${end}-${currentCode}`) {
        fetchData();
        prevFiltersRef.current = `${start}-${end}-${currentCode}`;
      }

      return () => {
        isActive = false;
      };
    }, [start, end, currentCode]),
  );

  const scrollOffsetAnimatedValue = React.useRef(new Animated.Value(0)).current;
  const positionAnimatedValue = React.useRef(new Animated.Value(0)).current;

  return (useMemo(() => (
    <Box style={{ flex: 1 }}>
      <LinearGradient
        colors={colorScheme === 'light' ? ['rgb(255,211,195)', 'rgb(255,194,183)', 'rgb(248,199,193)', 'rgb(255,228,194)'] : ['#790277', '#d30847', '#FF5533', '#efe96d']}
        start={{ x: 0, y: 1 }}
        end={{ x: 1, y: 0 }}
        style={{ minHeight: 250 + safeAreaInsets.top, paddingTop: safeAreaInsets.top + 50 }}
      >
        <VStack
          flex={1}
          mx={4}
          my={4}
          py={1}
          px={3}
          pb={5}
          justifyContent="space-between"
          alignItems="center"
        >
          <NetWorth />
          <Pagination
            renderIcons={renderIcons}
            handlePress={(index) => viewPagerRef?.current?.setPage(index)}
            scrollOffsetAnimatedValue={scrollOffsetAnimatedValue}
            positionAnimatedValue={positionAnimatedValue}
          />
        </VStack>
      </LinearGradient>

      <View style={{ flex: 2 }}>
        <Box
          backgroundColor={colors.tileBackgroundColor}
          borderTopRadius={30}
          borderColor={colors.tileBackgroundColor}
          style={{
            paddingTop: 5,
            position: 'absolute',
            top: -30,
            height: '100%',
            right: 0,
            left: 0,
          }}
        >
          <AnimatedPagerView
            ref={viewPagerRef}
            initialPage={0}
            style={{ flex: 1 }}
            onPageScroll={Animated.event<PagerViewOnPageScrollEventData>(
              [
                {
                  nativeEvent: {
                    offset: scrollOffsetAnimatedValue,
                    position: positionAnimatedValue,
                  },
                },
              ],
              {
                useNativeDriver: true,
              },
            )}
          >
            <AssetsAccounts key="1" />
            <InsightCategories key="2" />
            <InsightBudgets key="3" />
          </AnimatedPagerView>
        </Box>
      </View>
    </Box>
  ), [colors]));
}
