import React, {
  useEffect,
  useMemo,
  useRef,
  useCallback,
  useState,
} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  CommonActions,
  useFocusEffect,
  useScrollToTop,
  useNavigation,
} from '@react-navigation/native';
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
import moment from 'moment';
import { RootDispatch, RootState } from '../../store';
import translate from '../../i18n/locale';
import {
  localNumberFormat, useThemeColors, isLargeScreen, isMediumScreen,
} from '../../lib/common';

import Pagination from '../UI/Pagination';
import {
  AScrollView,
  AStack,
  AText,
  AView,
  AProgressBar,
  ASkeleton, AStackFlex,
} from '../UI/ALibrary';
import DisplayAllAccountsSwitch from '../UI/DisplayAllAccountsSwitch';
import IncomeExpenseBar from '../UI/IncomeExpenseBar';
import ErrorBoundary from '../UI/ErrorBoundary';

const AnimatedPagerView = Animated.createAnimatedComponent(PagerView);

function AssetsAccounts() {
  const { colors } = useThemeColors();
  const accounts = useSelector((state: RootState) => state.accounts.accounts);
  const displayAllAccounts = useSelector((state: RootState) => state.configuration.displayAllAccounts);
  const loading = useSelector((state: RootState) => state.loading.effects.accounts.getAccounts?.loading);
  const dispatch = useDispatch<RootDispatch>();
  const selectedBrandStyle = useSelector((state: RootState) => state.configuration.selectedBrandStyle || colors.brandStyleOrange);

  // Responsive font sizing based on screen size
  const isLarge = isLargeScreen();
  const isMedium = isMediumScreen();
  const accountNameFontSize = isLarge ? 18 : isMedium ? 16 : 14;
  const accountAsteriskFontSize = isLarge ? 14 : isMedium ? 12 : 10;
  const balanceFontSize = isLarge ? 18 : isMedium ? 16 : 14;
  const balanceDifferenceFontSize = isLarge ? 16 : isMedium ? 14 : 12;
  const percentageBadgeFontSize = isLarge ? 16 : isMedium ? 14 : 12;
  const sectionTitleFontSize = isLarge ? 28 : isMedium ? 27 : 25;
  const footerTextFontSize = isLarge ? 12 : isMedium ? 11 : 9;
  const sortIconSize = isLarge ? 26 : isMedium ? 24 : 22;

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
      } if (balanceSortOrder) {
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
        <AStack mx={15} my={10} row justifyContent="space-between" alignItems="center">
          <AText fontSize={sectionTitleFontSize} bold>
            {displayAllAccounts ? translate('home_all_accounts') : translate('home_accounts')}
          </AText>
          <DisplayAllAccountsSwitch />
        </AStack>
        <AStack px={5} row justifyContent="space-between">
          <View style={{ flex: 1, alignItems: 'flex-start', paddingLeft: '5%' }}>
            <TouchableOpacity onPress={() => handleSortPress('left')}>
              <MaterialCommunityIcons
                name="sort"
                size={sortIconSize}
                color={lastPressed === 'left' ? selectedBrandStyle : colors.text}
              />
            </TouchableOpacity>
          </View>
          <View style={{ flex: 1, alignItems: 'flex-end', paddingRight: '5%' }}>
            <TouchableOpacity onPress={() => handleSortPress('right')}>
              <MaterialCommunityIcons
                name="sort"
                size={sortIconSize}
                color={lastPressed === 'right' ? selectedBrandStyle : colors.text}
                style={{ transform: [{ scaleX: -1 }] }}
              />
            </TouchableOpacity>
          </View>
        </AStack>
        {sortedAccounts.map((account, index) => {
          const balance = parseFloat(account.attributes.currentBalance);
          const balanceDifference = parseFloat(account.attributes.balanceDifference);
          const balanceDifferencePercent = balance && balanceDifference
            ? (Math.round((balanceDifference / Math.abs(balance)) * 10000) / 100)
            : 0;
          return (
            <AStackFlex
              key={account.id}
              row
              px={15}
              py={10}
              style={{
                borderColor: colors.listBorderColor,
                borderBottomWidth: index + 1 === accounts.length ? 0 : 0.5,
              }}
            >
              <AStackFlex
                row
                gap={10}
                justifyContent="flex-start"
                alignItems="center"
              >
                <AText
                  fontSize={accountNameFontSize}
                  numberOfLines={1}
                >
                  {account.attributes.name}
                  <AText fontSize={accountAsteriskFontSize}>
                    {account.attributes.includeNetWorth ? '' : '*'}
                  </AText>
                </AText>

                {balanceDifferencePercent !== 0 && (
                  <ASkeleton loading={loading}>
                    <AText
                      fontSize={percentageBadgeFontSize}
                      numberOfLines={2}
                      textAlign="center"
                      px={3}
                      style={{
                        backgroundColor: balanceDifferencePercent < 0 && account.attributes.type !== 'liabilities' ? colors.red : colors.green,
                        borderRadius: 6,
                      }}
                      color="white"
                    >
                      {balanceDifferencePercent}
                      %
                    </AText>
                  </ASkeleton>
                )}
              </AStackFlex>
              <AStackFlex alignItems="flex-end" style={{ width: '100%' }}>
                <ASkeleton loading={loading}>
                  <AText
                    maxWidth={150}
                    fontSize={balanceFontSize}
                    numberOfLines={2}
                    textAlign="right"
                  >
                    {localNumberFormat(account.attributes.currencyCode, balance)}
                  </AText>
                  {balanceDifferencePercent !== 0 && (
                    <AText
                      maxWidth={150}
                      fontSize={balanceDifferenceFontSize}
                      numberOfLines={2}
                      textAlign="right"
                      color={balanceDifferencePercent < 0 && account.attributes.type !== 'liabilities' ? colors.brandDanger : colors.brandSuccess}
                    >
                      {localNumberFormat(account.attributes.currencyCode, balanceDifference)}
                    </AText>
                  )}
                </ASkeleton>
              </AStackFlex>
            </AStackFlex>
          );
        })}
        <AText fontSize={footerTextFontSize} py={10} px={15}>
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
  const insightCategoriesTotal = useSelector((state: RootState) => state.categories.total);
  const insightCategoriesPerDay = useSelector((state: RootState) => state.categories.perDay);
  const loading = useSelector((state: RootState) => state.loading.effects.categories.getInsightCategories?.loading);
  const startDate = useSelector((state: RootState) => state.firefly.rangeDetails.start);
  const dispatch = useDispatch<RootDispatch>();
  const navigation = useNavigation();
  const expensesOnly = useSelector((state: RootState) => state.configuration.displayOnlyExpenseCategories);
  const selectedBrandStyle = useSelector((state: RootState) => state.configuration.selectedBrandStyle || colors.brandStyleOrange);

  const onSwitch = async (bool: boolean) => {
    dispatch.configuration.setDisplayOnlyExpenseCategories(bool);
    return Promise.resolve();
  };

  const goToTransactions = async (id: string, transactionSearch: string) => {
    navigation.dispatch(
      CommonActions.navigate(translate('navigation_transactions_tab'), {
        screen: 'TransactionsScreen',
        merge: true,
        params: {
          id,
          transactionSearch,
          startDate: new Date(`${startDate}T12:00:00`),
        },
      }),
    );
  };

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
      <AStack mx={15} my={10} row justifyContent="space-between" alignItems="center">
        <AText fontSize={25} bold>
          {expensesOnly ? translate('home_expense_categories') : translate('home_all_categories')}
        </AText>
        <Switch thumbColor="white" trackColor={{ false: '#767577', true: selectedBrandStyle }} onValueChange={onSwitch} value={expensesOnly} />
      </AStack>
      {[insightCategoriesPerDay, insightCategoriesTotal, ...insightCategories].map((category, index) => {
        if (!category || (expensesOnly && category.expense >= 0)) {
          return null;
        }

        return (
          <TouchableOpacity
            key={category.id}
            onPress={() => {
              if (category.name === 'total' || category.name === 'perday') return;
              if (category.name === 'no-category') {
                goToTransactions(category.id, 'has_any_category:false');
              } else {
                goToTransactions(category.id, `category_is:"${category.name}"`);
              }
            }}
          >
            <AView
              key={category.name}
              style={{
                borderColor: category.name === 'total' ? colors.dividerColor : colors.listBorderColor,
                borderBottomWidth: index - 1 === insightCategories.length ? 0 : 1,
                paddingBottom: !expensesOnly && category.name === 'total' ? 10 : 0,
              }}
            >
              <AStack
                row
                mx={15}
                style={{
                  height: 45,
                }}
                justifyContent="space-between"
              >
                <AText
                  fontSize={category.name === 'perday' ? 12 : 14}
                  maxWidth="60%"
                  numberOfLines={1}
                  bold={(category.name === 'total' || category.name === 'perday')}
                >
                  {(category.name === 'no-category') ? translate('no_category') : ''}
                  {(category.name === 'total') ? translate(expensesOnly ? 'category_total_spent' : 'category_total_balance') : ''}
                  {(category.name === 'perday') ? translate(expensesOnly ? 'category_perday_spent' : 'category_perday_balance') : ''}
                  {(category.name !== 'no-category' && category.name !== 'total' && category.name !== 'perday') ? category.name : null}
                </AText>

                <ASkeleton loading={loading}>
                  <AText
                    fontSize={category.name === 'perday' ? 12 : 14}
                    maxWidth={100}
                    numberOfLines={1}
                    bold={(category.name === 'total' || category.name === 'perday')}
                    color={!expensesOnly ? category.difference > 0 ? colors.brandSuccess : category.difference < 0 ? colors.brandDanger : colors.text : colors.text}
                  >
                    {localNumberFormat(
                      category.currencyCode,
                      expensesOnly ? category.expense * -1 : category.difference,
                    )}
                  </AText>
                </ASkeleton>
              </AStack>
              {!expensesOnly && category.name !== 'perday' && insightCategoriesTotal && (
                <IncomeExpenseBar
                  income={category.income}
                  incomeTotal={category.name === 'total' ? insightCategoriesTotal.income - insightCategoriesTotal.expense : insightCategoriesTotal.income}
                  expense={category.expense}
                  expenseTotal={category.name === 'total' ? insightCategoriesTotal.income - insightCategoriesTotal.expense : insightCategoriesTotal.expense}
                  currencyCode={category.currencyCode}
                  loading={loading}
                  barHeight={category.name === 'total' ? 10 : undefined}
                />
              )}
            </AView>
          </TouchableOpacity>
        );
      })}
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

function formatDate(date) {
  if (!date) {
    return translate('date_unavailable');
  }
  const momentDate = moment(date);
  const formattedDate = momentDate.isValid() ? momentDate.format('LL') : translate('date_unavailable');
  return formattedDate;
}

function Bills() {
  const { colors } = useThemeColors();
  const bills = useSelector((state: RootState) => state.bills.bills);
  const loading = useSelector((state: RootState) => state.loading.effects.bills?.getBills?.loading);
  const dispatch = useDispatch<RootDispatch>();

  useEffect(() => {
    dispatch.bills.getBills();
  }, [dispatch]);

  return (
    <AScrollView
      showsVerticalScrollIndicator={false}
      refreshControl={(
        <RefreshControl
          refreshing={loading}
          onRefresh={() => Promise.all([
            dispatch.bills.getBills(),
            dispatch.firefly.getNetWorth(),
          ])}
        />
      )}
    >
      <AText fontSize={25} lineHeight={27} style={{ margin: 15 }} bold>
        {translate('home_bills')}
      </AText>
      {bills.map((bill) => {
        const amountPaid = parseFloat(bill.attributes.currentPaidAmount || '0');
        const amountMin = parseFloat(bill.attributes.amountMin);
        const percentagePaid = (amountPaid / amountMin) * 100;
        const isPaid = amountPaid >= amountMin;

        const statusText = isPaid
          ? `${translate('bills_paid')} ${formatDate(bill.attributes.nextExpectedMatch)}`
          : amountPaid > 0
            ? `${percentagePaid.toFixed(0)}%`
            : `${translate('due_by')} ${formatDate(bill.attributes.nextExpectedMatch)}`;

        return (
          <AStack
            key={bill.id}
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
                  {bill.attributes.name}
                </AText>
                <AText fontSize={12} lineHeight={20} numberOfLines={1}>
                  {localNumberFormat(bill.attributes.currencyCode, amountPaid)}
                  {' / '}
                  {localNumberFormat(bill.attributes.currencyCode, amountMin)}
                </AText>
              </AStack>

              <ASkeleton loading={loading}>
                <AStack alignItems="flex-end">
                  <AStack
                    px={6}
                    py={2}
                    backgroundColor={isPaid ? colors.brandSuccessLight : colors.brandNeutralLight}
                    style={{ borderRadius: 5 }}
                  >
                    <AText
                      fontSize={15}
                      numberOfLines={1}
                      color={isPaid ? colors.brandSuccess : colors.brandNeutral}
                      style={{ textAlign: 'center' }}
                      bold
                    >
                      {statusText}
                    </AText>
                  </AStack>
                </AStack>
              </ASkeleton>
            </AStackFlex>

            <AProgressBar
              color={percentagePaid >= 50.0 ? colors.green : colors.brandWarning}
              value={percentagePaid}
            />
          </AStack>
        );
      })}
      <AView style={{ height: 150 }} />
    </AScrollView>
  );
}

function PiggyBanks() {
  const { colors } = useThemeColors();
  const piggyBanks = useSelector((state: RootState) => state.piggyBanks.piggyBanks);
  const loading = useSelector((state: RootState) => state.loading.effects.piggyBanks?.getPiggyBanks?.loading);
  const dispatch = useDispatch<RootDispatch>();

  return (
    <AScrollView
      showsVerticalScrollIndicator={false}
      refreshControl={(
        <RefreshControl
          refreshing={false}
          onRefresh={() => Promise.all([
            dispatch.piggyBanks.getPiggyBanks(),
            dispatch.firefly.getNetWorth(),
          ])}
        />
      )}
    >
      <AText fontSize={25} lineHeight={27} style={{ margin: 15 }} bold>
        {translate('home_piggy_banks')}
      </AText>
      {piggyBanks.filter((pb) => pb.attributes?.percentage).map((pb) => (
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
                    {`${pb.attributes.percentage?.toFixed(0)}%`}
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
              <AText
                fontSize={35}
                lineHeight={37}
                bold
                numberOfLines={1}
                maxWidth="90%"
                textAlign="center"
                adjustsFontSizeToFit
                minimumFontScale={0.6}
              >
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
                    numberOfLines={1}
                    adjustsFontSizeToFit
                    minimumFontScale={0.7}
                    textAlign="center"
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
  const selectedTheme = useSelector((state: RootState) => state.configuration.selectedTheme || 'gradientOrange');
  const lightSelectedColor = colors[`${selectedTheme}Light`] || colors.gradientOrangeLight;
  const darkSelectedColor = colors[`${selectedTheme}Dark`] || colors.gradientOrangeDark;
  const gradientColors = colorScheme === 'light' ? lightSelectedColor : darkSelectedColor;

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

  const prevFiltersRef = useRef<string>(null);
  const viewPagerRef = useRef<PagerView>(null);
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
          dispatch.piggyBanks.getPiggyBanks();
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
      <ErrorBoundary>
        <LinearGradient
          colors={gradientColors}
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

        <View style={{ flex: 1 }}>
          <AView
            style={{
              backgroundColor: colors.tileBackgroundColor,
              borderTopLeftRadius: 30,
              borderTopRightRadius: 30,
              borderColor: colors.tileBackgroundColor,
              paddingTop: 5,
              position: 'absolute',
              top: -55,
              height: '150%',
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
      </ErrorBoundary>
    </AView>
  ), [colors]));
}
