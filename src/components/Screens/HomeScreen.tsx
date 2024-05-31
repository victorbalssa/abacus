import React, {
  useEffect,
  useMemo,
  useRef,
  useCallback,
  useState,
} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useFocusEffect, useScrollToTop } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  RefreshControl,
  Animated,
  Switch,
  View, Pressable,
  TouchableOpacity,
} from 'react-native';
import axios from 'axios';
import type { PagerViewOnPageScrollEventData } from 'react-native-pager-view';
import PagerView from 'react-native-pager-view';

import { FontAwesome, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { RootDispatch, RootState } from '../../store';
import translate from '../../i18n/locale';
import { localNumberFormat, useThemeColors } from '../../lib/common';
import BillListItem from '../UI/Bills/BillListItem';

import Pagination from '../UI/Pagination';
import {
  AScrollView,
  AStack,
  AText,
  AView,
  AProgressBar,
  ASkeleton, AStackFlex,
} from '../UI/ALibrary';

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
  const [nameSortOrder, setNameSortOrder] = useState('asc');
  const [balanceSortOrder, setBalanceSortOrder] = useState('desc');
  const [lastPressed, setLastPressed] = useState(null);

  const handleSortPress = (position) => {
    setLastPressed(position);
    if (position === 'left') {
      setNameSortOrder(nameSortOrder === 'asc' ? 'desc' : 'asc');
      setBalanceSortOrder(null);
    } else if (position === 'right') {
      setBalanceSortOrder(balanceSortOrder === 'desc' ? 'asc' : 'desc');
      setNameSortOrder(null);
    }
  };

  const sortedAccounts = accounts
    .filter((a) => a.display || displayAllAccounts)
    .sort((a, b) => {
      if (nameSortOrder) {
        return nameSortOrder === 'asc'
          ? a.attributes.name.localeCompare(b.attributes.name)
          : b.attributes.name.localeCompare(a.attributes.name);
      } else if (balanceSortOrder) {
        return balanceSortOrder === 'asc'
          ? parseFloat(a.attributes.currentBalance) - parseFloat(b.attributes.currentBalance)
          : parseFloat(b.attributes.currentBalance) - parseFloat(a.attributes.currentBalance);
      }
      return 0;
    });

  return (
    <AScrollView
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
      <AView>
        <AStack px={5} row justifyContent="space-between">
          <AText fontSize={25} lineHeight={27} style={{ margin: 15 }} bold>
            {displayAllAccounts ? translate('home_all_accounts') : translate('home_accounts')}
          </AText>
          <Switch style={{ marginHorizontal: 10 }} thumbColor="white" trackColor={{ false: '#767577', true: colors.brandStyle }} onValueChange={onSwitch} value={displayAllAccounts} />
        </AStack>
        <AStack px={5} row justifyContent="space-between">
        <View style={{ flex: 1, alignItems: 'flex-start', paddingLeft: '5%'  }}>
          <TouchableOpacity onPress={() => handleSortPress('left')}>
            <MaterialCommunityIcons
              name="sort"
              size={22}
              color={lastPressed === 'left' ? colors.primary : colors.text}
            />
          </TouchableOpacity>
        </View>
        <View style={{ flex: 1, alignItems: 'flex-end', paddingRight: '5%' }}>
          <TouchableOpacity onPress={() => handleSortPress('right')}>
            <MaterialCommunityIcons
              name="sort"
              size={22}
              color={lastPressed === 'right' ? colors.primary : colors.text}
              style={{ transform: [{ scaleX: -1 }] }}
            />
          </TouchableOpacity>
        </View>
      </AStack>
        {sortedAccounts.map((account, index) => (
          <AStack
            key={account.id}
            row
            mx={15}
            style={{
              height: 45,
              borderColor: colors.listBorderColor,
              borderBottomWidth: index + 1 === accounts.length ? 0 : 0.5,
            }}
            justifyContent="space-between"
          >
            <AText
              fontSize={14}
              maxWidth="60%"
              numberOfLines={1}
            >
              {account.attributes.name}
              <AText fontSize={10}>
                {account.attributes.includeNetWorth ? '' : '*'}
              </AText>
            </AText>

            <ASkeleton loading={loading}>
              <AText
                maxWidth={150}
                fontSize={14}
                numberOfLines={1}
              >
                {localNumberFormat(account.attributes.currencyCode, parseFloat(account.attributes.currentBalance))}
              </AText>
            </ASkeleton>
          </AStack>
        ))}
        <AText fontSize={9} py={10} px={15}>
          {translate('account_not_included_in_net_worth')}
        </AText>
        <AView style={{ height: 150 }} />
      </AView>
    </AScrollView>
  );
}

function InsightCategories() {
  const { colors } = useThemeColors();
  const insightCategories = useSelector((state: RootState) => state.categories.insightCategories);
  const loading = useSelector((state: RootState) => state.loading.effects.categories.getInsightCategories?.loading);
  const dispatch = useDispatch<RootDispatch>();

  return (
    <AScrollView
      showsVerticalScrollIndicator={false}
      refreshControl={(
        <RefreshControl
          refreshing={false}
          onRefresh={() => Promise.all([
            dispatch.categories.getInsightCategories(),
            dispatch.firefly.getNetWorth(),
          ])}
        />
      )}
    >
      <AText fontSize={25} lineHeight={27} style={{ margin: 15 }} bold>
        {translate('home_categories')}
      </AText>
      {insightCategories.map((category, index) => (
        <AStack
          key={category.name}
          row
          mx={15}
          style={{
            height: 45,
            borderColor: colors.listBorderColor,
            borderBottomWidth: index + 1 === insightCategories.length ? 0 : 0.5,
          }}
          justifyContent="space-between"
        >
          <AText
            fontSize={14}
            maxWidth="60%"
            numberOfLines={1}
          >
            {category.name}
          </AText>

          <ASkeleton loading={loading}>
            <AText
              fontSize={14}
              maxWidth={100}
              numberOfLines={1}
            >
              {localNumberFormat(category.currencyCode, (category.differenceFloat * -1))}
            </AText>
          </ASkeleton>
        </AStack>
      ))}
      <AView style={{ height: 150 }} />
    </AScrollView>
  );
}

function InsightBudgets() {
  const { colors } = useThemeColors();
  const insightBudgets = useSelector((state: RootState) => state.budgets.budgets);
  const loading = useSelector((state: RootState) => state.loading.effects.budgets.getInsightBudgets?.loading);
  const dispatch = useDispatch<RootDispatch>();

  return (
    <AScrollView
      showsVerticalScrollIndicator={false}
      refreshControl={(
        <RefreshControl
          refreshing={false}
          onRefresh={() => Promise.all([
            dispatch.budgets.getInsightBudgets(),
            dispatch.firefly.getNetWorth(),
          ])}
        />
      )}
    >
      <AText fontSize={25} lineHeight={27} style={{ margin: 15 }} bold>
        {translate('home_budgets')}
      </AText>
      {insightBudgets.filter((budget) => budget.attributes?.active).map((budget) => (
        <AStack
          key={budget.attributes.name}
          mx={15}
          style={{ height: 60 }}
        >
          <AStackFlex row justifyContent="space-between">
            <AStack
              style={{ maxWidth: '80%' }}
              alignItems="flex-start"
            >
              <AText fontSize={14} lineHeight={22} numberOfLines={1}>
                {budget.attributes.name}
              </AText>
              <AText fontSize={12} lineHeight={20} numberOfLines={1}>
                {localNumberFormat(budget.currencyCode, budget.differenceFloat < 0 ? (budget.differenceFloat * -1) : budget.differenceFloat)}
                {' / '}
                {localNumberFormat(budget.currencyCode, budget.limit)}
              </AText>
            </AStack>

            <ASkeleton loading={loading}>
              <AStack alignItems="flex-end">
                <AStack
                  px={6}
                  py={2}
                  backgroundColor={-budget.differenceFloat > budget.limit ? colors.brandNeutralLight : colors.brandSuccessLight}
                  style={{ borderRadius: 5 }}
                >
                  <AText
                    fontSize={15}
                    numberOfLines={1}
                    color={-budget.differenceFloat > budget.limit ? colors.brandNeutral : colors.brandSuccess}
                    style={{ textAlign: 'center' }}
                    bold
                  >
                    {`${(budget.limit > 0 ? (((budget.differenceFloat * -1) * 100) / budget.limit).toFixed(0) : 0)}%`}
                  </AText>
                </AStack>
              </AStack>
            </ASkeleton>
          </AStackFlex>
          <AProgressBar
            color={-budget.differenceFloat > budget.limit ? colors.red : colors.green}
            value={((-budget.differenceFloat * 100) / budget.limit) || 0}
          />
        </AStack>
      ))}
      <AView style={{ height: 150 }} />
    </AScrollView>
  );
}

function Bills() {
  const { colors } = useThemeColors();

  const billsSummary = useSelector((state: RootState) => state.firefly.bills);
  const bills = useSelector((state: RootState) => state.bills.bills);
  const loading = useSelector((state: RootState) => state.loading.effects.bills?.getBills?.loading);
  const dispatch = useDispatch<RootDispatch>();

  const totalPaid = useMemo(() => parseFloat(billsSummary?.paid?.monetaryValue || '0'), [billsSummary]);
  const totalUnpaid = useMemo(() => Math.abs(parseFloat(billsSummary?.unpaid?.monetaryValue || '0')), [billsSummary]);
  const total = useMemo(() => totalPaid + totalUnpaid, [totalPaid, totalUnpaid]);

  return (
    <AScrollView
      showsVerticalScrollIndicator={false}
      refreshControl={(
        <RefreshControl
          refreshing={false}
          onRefresh={() => dispatch.bills.getBills()}
        />
      )}
    >
      <AStack row>
        <AText fontSize={25} lineHeight={27} style={{ margin: 15, flex: 1 }} bold>
          {translate('home_bills')}
        </AText>

        {total !== 0 && (
          <AStack
            px={6}
            py={2}
            mx={15}
            backgroundColor={colors.brandSuccessLight}
            style={{ borderRadius: 5 }}
          >
            <AText
              fontSize={15}
              numberOfLines={1}
              color={colors.brandSuccess}
              style={{ textAlign: 'center' }}
              bold
            >
              {`${((totalPaid / total) * 100).toFixed(0)}%`}
            </AText>
          </AStack>
        )}
      </AStack>

      {total !== 0 && (
        <AStack mx={15} justifyContent="flex-start">
          <AProgressBar
            color={colors.green}
            value={(totalPaid / total) * 100}
          />
        </AStack>
      )}

      {bills.map((bill, index) => (
        <BillListItem
          key={bill.id}
          bill={bill}
          loading={loading}
          lastItem={index + 1 === bills.length}
        />
      ))}
      <AView style={{ height: 150 }} />
    </AScrollView>
  );
}

function PiggyBanks() {
  const { colors } = useThemeColors();
  const piggyBanks = useSelector((state: RootState) => state.piggybank.piggyBanks);
  const loading = useSelector((state: RootState) => state.loading.effects.piggybanks?.getPiggyBanks?.loading);
  const dispatch = useDispatch<RootDispatch>();

  return (
    <AScrollView
      showsVerticalScrollIndicator={false}
      refreshControl={(
        <RefreshControl
          refreshing={false}
          onRefresh={() => dispatch.piggybank.getPiggyBanks()}
        />
      )}
    >
      <AText fontSize={25} lineHeight={27} style={{ margin: 15 }}>
        {translate('home_piggy_banks')}
      </AText>
      {piggyBanks.map((pb) => (
        <AStack
          key={pb.id}
          mx={15}
          style={{
            height: 60,
          }}
        >
          <AStackFlex row justifyContent="space-between">
            <AStack
              style={{ maxWidth: '80%' }}
              alignItems="flex-start"
            >
              <AText fontSize={14} lineHeight={22} numberOfLines={1}>
                {pb.attributes.name}
              </AText>
              <AText fontSize={12} lineHeight={20} numberOfLines={1}>
                {localNumberFormat(pb.attributes.currencyCode, pb.attributes.currentAmount)}
                {' / '}
                {localNumberFormat(pb.attributes.currencyCode, pb.attributes.targetAmount)}
              </AText>
            </AStack>

            <ASkeleton loading={loading}>
              <AStack alignItems="flex-end">
                <AStack
                  px={6}
                  py={2}
                  backgroundColor={pb.attributes.leftToSave > 0.0 ? colors.brandNeutralLight : colors.brandSuccessLight}
                  style={{ borderRadius: 5 }}
                >
                  <AText
                    fontSize={15}
                    numberOfLines={1}
                    color={pb.attributes.leftToSave > 0.0 ? colors.brandNeutral : colors.brandSuccess}
                    style={{ textAlign: 'center' }}
                    bold
                  >
                    {`${pb.attributes.percentage.toFixed(0)}%`}
                  </AText>
                </AStack>
              </AStack>
            </ASkeleton>
          </AStackFlex>

          <AProgressBar
            color={pb.attributes.percentage > 50.0 ? colors.green : colors.brandWarning}
            value={pb.attributes.percentage}
          />
        </AStack>
      ))}
      <AView style={{ height: 150 }} />
    </AScrollView>
  );
}

function NetWorth() {
  const { colors } = useThemeColors();
  const hideBalance = useSelector((state: RootState) => state.configuration.hideBalance);
  const netWorth = useSelector((state: RootState) => state.firefly.netWorth);
  const balance = useSelector((state: RootState) => state.firefly.balance);
  const spent = useSelector((state: RootState) => state.firefly.earned);
  const earned = useSelector((state: RootState) => state.firefly.spent);
  const currentCode = useSelector((state: RootState) => state.currencies.currentCode);
  const loading = useSelector((state: RootState) => state.loading.effects.firefly.getNetWorth?.loading);
  const dispatch = useDispatch<RootDispatch>();

  return useMemo(() => (
    <View testID="home_screen_net_worth">
      <Pressable onPress={() => dispatch.configuration.setHideBalance(!hideBalance)}>
        {!hideBalance && (
        <AView style={{
          height: 90,
          width: 300,
          justifyContent: 'center',
          alignItems: 'center',
        }}
        >
          <AText fontSize={12} lineHeight={18}>
            {`${translate('home_net_worth')} • ${currentCode}`}
          </AText>
          <ASkeleton loading={loading}>
            <AText fontSize={35} lineHeight={37} bold>
              {localNumberFormat(currentCode, parseFloat(netWorth[0]?.monetaryValue || '0'))}
            </AText>
          </ASkeleton>

          {balance && balance[0] && earned && earned[0] && spent && spent[0] && !hideBalance && (
          <ASkeleton loading={loading}>
            <AStack
              py={0}
              my={1}
              px={5}
              backgroundColor={parseFloat(balance[0].monetaryValue) < 0 ? colors.brandNeutralLight : colors.brandSuccessLight}
              style={{ borderRadius: 5 }}
            >
              <AText
                py={0}
                bold
                fontSize={12}
                color={parseFloat(balance[0].monetaryValue) < 0 ? colors.brandNeutral : colors.brandSuccess}
              >
                {`${parseFloat(balance[0].monetaryValue) > 0 ? '+' : ''}${localNumberFormat(balance[0].currencyCode, parseFloat(balance[0].monetaryValue))}`}
              </AText>
            </AStack>
          </ASkeleton>
          )}
        </AView>
        )}

        {hideBalance && (
          <AView style={{
            height: 90,
            width: 300,
            justifyContent: 'center',
            alignItems: 'center',
          }}
          >
            <FontAwesome
              name={hideBalance ? 'eye-slash' : 'eye'}
              size={30}
              color={colors.text}
            />
          </AView>
        )}
      </Pressable>
    </View>
  ), [
    loading,
    hideBalance,
    colors,
    netWorth,
    balance,
    earned,
    spent,
    currentCode,
  ]);
}

export default function HomeScreen() {
  const { colors, colorScheme } = useThemeColors();
  const safeAreaInsets = useSafeAreaInsets();
  const start = useSelector((state: RootState) => state.firefly.rangeDetails.start);
  const end = useSelector((state: RootState) => state.firefly.rangeDetails.end);
  const currentCode = useSelector((state: RootState) => state.currencies.currentCode);
  const dispatch = useDispatch<RootDispatch>();
  const renderIcons = [
    <Ionicons key="wallet" name="wallet" size={22} color={colors.text} />,
    <Ionicons key="pricetag" name="pricetags" size={22} color={colors.text} />,
    <MaterialCommunityIcons key="progress-check" name="progress-check" size={22} color={colors.text} />,
    <Ionicons key="calendar-clear" name="calendar-clear" size={22} color={colors.text} />,
    <MaterialCommunityIcons key="piggy-bank" name="piggy-bank" size={22} color={colors.text} />,
  ];

  useEffect(() => {
    (async () => {
      await Promise.all([
        dispatch.currencies.getCurrencies(),
        dispatch.configuration.getCurrentApiVersion(),
      ]);
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
          dispatch.bills.getBills();
          dispatch.piggybank.getPiggyBanks();
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
    <AView style={{ flex: 1 }}>
      <LinearGradient
        colors={colorScheme === 'light' ? ['rgb(255,211,195)', 'rgb(255,194,183)', 'rgb(248,199,193)', 'rgb(255,228,194)'] : ['#790277', '#d30847', '#FF5533', '#efe96d']}
        start={{ x: 0, y: 1 }}
        end={{ x: 1, y: 0 }}
        style={{ minHeight: 250 + safeAreaInsets.top, paddingTop: safeAreaInsets.top }}
      >
        <AStackFlex>
          <NetWorth />
          <Pagination
            renderIcons={renderIcons}
            handlePress={(index) => viewPagerRef?.current?.setPage(index)}
            scrollOffsetAnimatedValue={scrollOffsetAnimatedValue}
            positionAnimatedValue={positionAnimatedValue}
          />
        </AStackFlex>
      </LinearGradient>

      <View style={{ flex: 2 }}>
        <AView
          style={{
            backgroundColor: colors.tileBackgroundColor,
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
            borderColor: colors.tileBackgroundColor,
            paddingTop: 5,
            position: 'absolute',
            top: -55,
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
            <Bills key="4" />
            <PiggyBanks key="5" />
          </AnimatedPagerView>
        </AView>
      </View>
    </AView>
  ), [colors]));
}
