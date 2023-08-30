import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Alert,
  RefreshControl,
  View,
  Animated as OldAnimated,
} from 'react-native';
import Animated, { withTiming, useSharedValue } from 'react-native-reanimated';
import {
  Badge,
  Box,
  HStack,
  Icon,
  Pressable,
  Skeleton,
  Text,
  VStack,
} from 'native-base';
import moment from 'moment';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useDispatch, useSelector } from 'react-redux';
import {
  CommonActions,
  useFocusEffect,
  useNavigation,
} from '@react-navigation/native';
import { FlashList } from '@shopify/flash-list';
import { isEmpty } from 'lodash';

import { TransactionSplitType, TransactionType } from '../../models/transactions';
import { RootDispatch, RootState } from '../../store';
import translate from '../../i18n/locale';
import { localNumberFormat, useThemeColors } from '../../lib/common';
import { ScreenType } from './types';

const ITEM_HEIGHT = 90;

function ListFooterComponent() {
  const { colors } = useThemeColors();
  const { loading: loadingMore } = useSelector((state: RootState) => state.loading.effects.transactions.getMoreTransactions);
  const { loading } = useSelector((state: RootState) => state.loading.effects.transactions.getTransactions);

  return useMemo(() => (loading || loadingMore) && (
    <>
      <Box
        h={ITEM_HEIGHT}
        paddingLeft={2}
        backgroundColor={colors.tileBackgroundColor}
        borderBottomWidth={0.5}
        borderColor={colors.listBorderColor}
      >
        <HStack justifyContent="space-between" alignItems="flex-start" space={3} paddingTop={3} paddingRight={3}>
          <HStack>
            <Skeleton w={8} h={8} m={1} ml={0} rounded={10} />
            <Skeleton.Text w={130} ml={2} lines={3} />
          </HStack>
          <Skeleton w={75} h={8} rounded={10} />
        </HStack>
      </Box>
      <Box
        h={ITEM_HEIGHT}
        paddingLeft={2}
        backgroundColor={colors.tileBackgroundColor}
        borderBottomWidth={0.5}
        borderColor={colors.listBorderColor}
      >
        <HStack justifyContent="space-between" alignItems="flex-start" space={3} paddingTop={3} paddingRight={3}>
          <HStack>
            <Skeleton w={8} h={8} m={1} ml={0} rounded={10} />
            <Skeleton.Text w={130} ml={2} lines={3} />
          </HStack>
          <Skeleton w={75} h={8} rounded={10} />
        </HStack>
      </Box>
    </>
  ), [
    loadingMore,
    loading,
  ]);
}

function RenderItem({ flashListRef, deleteRow, item }) {
  const { colors } = useThemeColors();
  const dispatch = useDispatch<RootDispatch>();
  const navigation = useNavigation();
  const swipeableRef = useRef<Swipeable>();
  const colorItemTypes = {
    withdrawal: {
      bg: colors.brandNeutralLight,
      color: colors.brandNeutral,
      icon: 'arrow-up',
      prefix: '-',
    },
    deposit: {
      bg: colors.brandSuccessLight,
      color: colors.brandSuccess,
      icon: 'arrow-down',
      prefix: '+',
    },
    transfer: {
      bg: colors.brandInfoLight,
      color: colors.brandInfo,
      icon: 'arrow-left-right',
      prefix: '',
    },
    'opening balance': {
      bg: colors.brandNeutralLight,
      color: colors.brandNeutral,
      icon: 'arrow-left-right',
      prefix: '',
    },
  };
  const height = useSharedValue(ITEM_HEIGHT);
  useEffect(() => {
    // Reset value when id changes (view was recycled for another item)
    height.value = ITEM_HEIGHT;
  }, [item.id, height]);

  const goToEdit = (id: string, payload: { splits: TransactionSplitType[]; groupTitle: string; }) => navigation.dispatch(
    CommonActions.navigate({
      name: 'TransactionDetailScreen',
      params: {
        id,
        payload,
      },
    }),
  );

  const goToDuplicate = (payload: { splits: TransactionSplitType[]; groupTitle: string; }) => navigation.dispatch(
    CommonActions.navigate({
      name: 'TransactionCreateScreen',
      params: {
        payload,
      },
    }),
  );

  const getTransactionTypeAttributes = (type: string) => {
    if (typeof colorItemTypes[type] === 'undefined') {
      return colorItemTypes.transfer;
    }

    return colorItemTypes[type];
  };

  const renderLeftActions = (_: OldAnimated.AnimatedInterpolation<number>, dragX: OldAnimated.AnimatedInterpolation<number>) => {
    let impact = 0;
    const scale = dragX.interpolate({
      inputRange: [0, 89, 90],
      outputRange: [0.2, 0.6, 1],
      extrapolate: 'clamp',
    });
    scale.addListener((state: {value: number}) => {
      if (state.value >= 1 && impact === 0) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch();
        impact = 1;
      }
      if (state.value < 1 && impact === 1) {
        impact = 0;
      }
    });

    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          backgroundColor: colors.brandDarkLight,
        }}
      >
        <Box
          justifyContent="center"
          alignItems="center"
          flex={1}
          width={20}
          backgroundColor={colors.brandDarkLight}
        >
          <OldAnimated.View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              transform: [{ scale }],
              marginLeft: 'auto',
              marginRight: 20,
            }}
          >
            <Icon as={<MaterialIcons name="content-copy" />} color="white" size="sm" />
            <Text color="white" fontSize="xs" fontWeight="medium">
              Clone
            </Text>
          </OldAnimated.View>
        </Box>
      </View>
    );
  };

  const renderRightActions = (_: OldAnimated.AnimatedInterpolation<number>, dragX: OldAnimated.AnimatedInterpolation<number>) => {
    let impact = 0;
    const scale = dragX.interpolate({
      inputRange: [-90, -89, 0],
      outputRange: [1, 0.6, 0.2],
      extrapolate: 'clamp',
    });
    scale.addListener((state: {value: number}) => {
      if (state.value >= 1 && impact === 0) {
        impact = 1;
      }
      if (state.value < 1 && impact === 1) {
        impact = 0;
      }
    });

    return (
      <View
        style={{
          flex: 1,
          alignItems: 'flex-end',
          justifyContent: 'center',
          backgroundColor: colors.red,
        }}
      >
        <Box
          flex={1}
          width={20}
          justifyContent="center"
          alignItems="center"
          backgroundColor={colors.red}
        >
          <OldAnimated.View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              transform: [{ scale }],
              marginLeft: 'auto',
              marginRight: 20,
            }}
          >
            <Icon as={<MaterialIcons name="delete" />} color="white" size="sm" />
            <Text color="white" fontSize="xs" fontWeight="medium">
              Delete
            </Text>
          </OldAnimated.View>
        </Box>
      </View>
    );
  };

  const onSwipeableWillOpen = (direction: 'right' | 'left') => {
    if (direction === 'left') {
      goToDuplicate({
        splits: item.attributes.transactions,
        groupTitle: item.attributes.groupTitle,
      });
      swipeableRef.current.close();
    }

    if (direction === 'right') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy).catch();
      Alert.alert(
        translate('transaction_list_alert_title'),
        `${translate('transaction_list_alert_text')}\n`
        + `${item?.attributes?.transactions[0]?.description}\n`
        + `${moment(item?.attributes?.transactions[0]?.date).format('ll')} • ${item?.attributes?.transactions[0]?.categoryName || ''}\n`,
        [
          {
            text: translate('transaction_list_delete_button'),
            onPress: async () => {
              flashListRef.current.prepareForLayoutAnimationRender();
              height.value = withTiming(0, { duration: 170 });
              await dispatch.transactions.deleteTransaction(item.id);
              deleteRow(item.id);
            },
            style: 'destructive',
          },
          {
            text: translate('transaction_list_cancel_button'),
            onPress: () => swipeableRef.current.close(),
            style: 'cancel',
          },
        ],
      );
    }
  };

  return useMemo(() => (
    <Swipeable
      ref={swipeableRef}
      key={item.id}
      renderRightActions={renderRightActions}
      rightThreshold={90}
      renderLeftActions={renderLeftActions}
      leftThreshold={90}
      onSwipeableWillOpen={onSwipeableWillOpen}
      friction={1}
    >
      <Animated.View style={{ height }}>
        <Pressable
          h={ITEM_HEIGHT}
          paddingLeft={2}
          backgroundColor={colors.tileBackgroundColor}
          borderBottomWidth={0.5}
          borderColor={colors.listBorderColor}
          onPress={() => {
            goToEdit(item.id, {
              splits: item.attributes.transactions,
              groupTitle: item.attributes.groupTitle,
            });
          }}
          onLongPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy).catch();
            goToDuplicate({
              splits: item.attributes.transactions,
              groupTitle: item.attributes.groupTitle,
            });
          }}
        >
          <HStack justifyContent="space-between" alignItems="flex-start">
            <HStack alignItems="center">
              <Box style={{
                backgroundColor: getTransactionTypeAttributes(item.attributes.transactions[0].type).bg,
                borderRadius: 10,
                marginRight: 8,
                padding: 5,
              }}
              >
                <MaterialCommunityIcons
                  name={getTransactionTypeAttributes(item.attributes.transactions[0].type).icon}
                  size={24}
                  color={getTransactionTypeAttributes(item.attributes.transactions[0].type).color}
                />
              </Box>
              <VStack>
                <Text
                  fontFamily="Montserrat_Bold"
                  maxW={200}
                  numberOfLines={1}
                  paddingTop={2}
                >
                  {item.attributes.transactions.length > 1 ? `${item.attributes.transactions.length} splits • ${item.attributes.groupTitle}` : item.attributes.transactions[0].description}
                </Text>

                <Text
                  fontSize="xs"
                  alignSelf="flex-start"
                  maxW={170}
                  numberOfLines={1}
                >
                  {`${item.attributes.transactions[0].type === 'withdrawal' ? item.attributes.transactions[0].sourceName : item.attributes.transactions[0].destinationName}`}
                </Text>

                <Text
                  fontSize="xs"
                  alignSelf="flex-start"
                  maxW={170}
                  numberOfLines={1}
                >
                  {`${moment(item.attributes.transactions[0].date).format('ll')} • ${item.attributes.transactions[0].categoryName || ''}`}
                </Text>
                <HStack alignSelf="flex-start">
                  {item.attributes.transactions[0].tags.filter((_: string, index: number) => index < 2).map((tag: string) => (
                    <Badge
                      p={0}
                      mx={0.5}
                      px={0.5}
                      my={0}
                      key={tag}
                      borderRadius={5}
                    >
                      <Text fontSize={10} color="black" numberOfLines={1} maxW={90}>{tag}</Text>
                    </Badge>
                  ))}
                </HStack>
              </VStack>
            </HStack>
            <Box style={{
              borderRadius: 10,
              backgroundColor: getTransactionTypeAttributes(item.attributes.transactions[0].type).bg,
              margin: 10,
              marginTop: 15,
              padding: 5,
            }}
            >
              <Text
                fontSize={15}
                fontFamily="Montserrat_Bold"
                style={{ color: getTransactionTypeAttributes(item.attributes.transactions[0].type).color }}
              >
                {`${getTransactionTypeAttributes(item.attributes.transactions[0].type).prefix}${localNumberFormat(item.attributes.transactions[0].currencyCode, item.attributes.transactions.reduce((total: number, split: { amount: string; }) => total + parseFloat(split.amount), 0))}`}
              </Text>
            </Box>
          </HStack>
        </Pressable>
      </Animated.View>
    </Swipeable>
  ), [item]);
}

export default function TransactionsScreen({ navigation, route }: ScreenType) {
  const { params } = route;
  const { loading: loadingRefresh } = useSelector((state: RootState) => state.loading.effects.transactions.getTransactions);
  const { page, totalPages } = useSelector((state: RootState) => state.transactions);
  const rangeDetails = useSelector((state: RootState) => state.firefly.rangeDetails);
  const currency = useSelector((state: RootState) => state.currencies.current);
  const [transactions, setTransactions] = useState<TransactionType[]>([]);
  const { transactions: { getMoreTransactions, getTransactions } } = useDispatch<RootDispatch>();
  const FlashListRef = useRef<FlashList<TransactionType>>(null);

  const onRefresh = async () => {
    const effectTransactions = await getTransactions();
    setTransactions(effectTransactions);
  };

  const prevFiltersRef = useRef<string>();
  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      if (prevFiltersRef.current !== `${rangeDetails.start}-${rangeDetails.end}-${currency.id}` || params?.forceRefresh === true) {
        if (isActive) {
          onRefresh().then();
        }
        prevFiltersRef.current = `${rangeDetails.start}-${rangeDetails.end}-${currency.id}`;
      }

      return () => {
        isActive = false;
        navigation.setParams({ forceRefresh: null });
      };
    }, [
      params,
      rangeDetails,
      currency,
    ]),
  );

  const onEndReached = useCallback(async () => {
    if (page < totalPages) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch();
      const effectTransactions = await getMoreTransactions();
      setTransactions([...transactions, ...effectTransactions]);
    }
  }, [page, totalPages, transactions, getMoreTransactions]);

  const deleteRow = async (id: string) => {
    setTransactions((prevState) => prevState.filter((item) => item.id !== id));
  };

  return useMemo(() => (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <FlashList
        ref={FlashListRef}
        contentInsetAdjustmentBehavior="automatic"
        refreshControl={(
          <RefreshControl
            refreshing={loadingRefresh}
            onRefresh={onRefresh}
          />
        )}
        data={loadingRefresh ? [] : transactions}
        renderItem={({ item }) => <RenderItem flashListRef={FlashListRef} deleteRow={deleteRow} item={item} />}
        onEndReached={() => (!loadingRefresh && !isEmpty(transactions)) && onEndReached()}
        estimatedItemSize={ITEM_HEIGHT}
        contentContainerStyle={{
          paddingBottom: 350,
        }}
        keyExtractor={(item: TransactionType) => item.id}
        ListFooterComponent={ListFooterComponent}
      />
    </GestureHandlerRootView>
  ), [
    transactions,
    loadingRefresh,
  ]);
}
