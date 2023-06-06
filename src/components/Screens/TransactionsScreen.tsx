import React, {
  FC,
  useCallback,
  useMemo, useRef,
  useState,
} from 'react';
import {
  Alert,
  RefreshControl,
  View,
} from 'react-native';
import {
  Box,
  HStack,
  Icon,
  Pressable,
  Skeleton,
  Text,
  VStack,
} from 'native-base';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { SwipeListView } from 'react-native-swipe-list-view';

import moment from 'moment';
import * as Haptics from 'expo-haptics';
import { useDispatch, useSelector } from 'react-redux';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  CommonActions, useFocusEffect, useNavigation, useScrollToTop,
} from '@react-navigation/native';
import _ from 'lodash';
import { TransactionType } from '../../models/transactions';
import { RootDispatch, RootState } from '../../store';
import { translate } from '../../i18n/locale';
import { localNumberFormat, useThemeColors } from '../../lib/common';

const ITEM_HEIGHT = 90;

const ListFooterComponent: FC = () => {
  const { colors } = useThemeColors();
  const { loading: loadingRefresh } = useSelector((state: RootState) => state.loading.effects.transactions.getTransactions);
  const { loading: loadingMore } = useSelector((state: RootState) => state.loading.effects.transactions.getMoreTransactions);

  return useMemo(() => (
    <>
      {(loadingRefresh || loadingMore) && (
        <>
          <Box
            h={ITEM_HEIGHT}
            paddingLeft={2}
            backgroundColor={colors.tileBackgroundColor}
            borderBottomWidth={1}
            borderColor={colors.listBorderColor}
            justifyContent="center"
          >
            <Box px={2}>
              <HStack justifyContent="space-between" alignItems="flex-start" space={3}>
                <HStack alignItems="flex-start">
                  <Skeleton w={8} h={8} m={1} ml={0} rounded={10} />
                  <Skeleton.Text w={145} lines={3} />
                </HStack>
                <Skeleton w={75} h={8} rounded={10} />
              </HStack>
            </Box>
          </Box>
          <Box
            h={ITEM_HEIGHT}
            paddingLeft={2}
            backgroundColor={colors.tileBackgroundColor}
            borderBottomWidth={1}
            borderColor={colors.listBorderColor}
            justifyContent="center"
          >
            <Box px={2}>
              <HStack justifyContent="space-between" alignItems="flex-start" space={3}>
                <HStack alignItems="flex-start">
                  <Skeleton w={8} h={8} m={1} ml={0} rounded={10} />
                  <Skeleton.Text w={145} lines={3} />
                </HStack>
                <Skeleton w={75} h={8} rounded={10} />
              </HStack>
            </Box>
          </Box>
        </>
      )}
    </>
  ), [
    loadingRefresh,
    loadingMore,
    colors,
  ]);
};

const RenderItem = ({ item }: { item: TransactionType }) => {
  const { colors } = useThemeColors();
  const navigation = useNavigation();

  // TODO: do not pass entire payload into this modal
  const goToEdit = (id, payload) => navigation.dispatch(
    CommonActions.navigate({
      name: 'TransactionsEditModal',
      params: {
        id,
        payload,
      },
    }),
  );

  // TODO: do not pass entire payload into this modal
  const goToDuplicate = (payload) => navigation.dispatch(
    CommonActions.navigate({
      name: 'TransactionsCreateModal',
      params: {
        payload,
      },
    }),
  );

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

  const getTransactionTypeAttributes = (type: string): { bg: string, color: string, icon: any, prefix: string } => {
    if (typeof colorItemTypes[type] === 'undefined') {
      return colorItemTypes.transfer;
    }

    return colorItemTypes[type];
  };

  return useMemo(() => (
    <Pressable
      h={ITEM_HEIGHT}
      paddingLeft={2}
      backgroundColor={colors.tileBackgroundColor}
      borderBottomWidth={0.5}
      borderColor={colors.listBorderColor}
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        goToEdit(item.id, item.attributes.transactions[0]);
      }}
      onLongPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        goToDuplicate(item.attributes.transactions[0]);
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
              paddingTop={3}
            >
              {item.attributes.transactions[0].description}
            </Text>

            <Text
              fontSize="xs"
              alignSelf="flex-start"
              numberOfLines={1}
            >
              {`${item.attributes.transactions[0].type === 'withdrawal' ? `${item.attributes.transactions[0].source_name}` : `${item.attributes.transactions[0].destination_name}`}`}
            </Text>

            <Text
              fontSize="xs"
              alignSelf="flex-start"
              maxW={170}
              numberOfLines={1}
            >
              {`${moment(item.attributes.transactions[0].date).format('ll')} ${item.attributes.transactions[0].category_name ? `• ${item.attributes.transactions[0].category_name}` : ''}`}
            </Text>
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
            {`${getTransactionTypeAttributes(item.attributes.transactions[0].type).prefix}${localNumberFormat(item.attributes.transactions[0].currency_code, item.attributes.transactions[0].amount)}`}
          </Text>
        </Box>
      </HStack>
    </Pressable>
  ), [item]);
};

const deleteAlert = async (transaction: TransactionType, rowMap, closeRow, deleteRow) => {
  await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
  Alert.alert(
    translate('transaction_list_alert_title'),
    `${translate('transaction_list_alert_text')}\n`
    + `${transaction?.attributes?.transactions[0]?.description}\n`
    + `${moment(transaction?.attributes?.transactions[0]?.date).format('ll')} ${transaction?.attributes?.transactions[0]?.category_name ? `• ${transaction?.attributes?.transactions[0]?.category_name}` : ''}\n`,
    [
      {
        text: translate('transaction_list_delete_button'),
        onPress: () => deleteRow(transaction?.id),
        style: 'destructive',
      },
      {
        text: translate('transaction_list_cancel_button'),
        onPress: () => closeRow(transaction?.id, rowMap),
        style: 'cancel',
      },
    ],
  );
};

const RenderHiddenItem = ({ handleOnPress }) => {
  const { colors } = useThemeColors();

  return useMemo(() => (
    <Pressable
      h={ITEM_HEIGHT}
      w="100%"
      ml="auto"
      backgroundColor={colors.red}
      justifyContent="center"
      alignItems="flex-end"
      borderBottomWidth={1}
      borderColor={colors.listBorderColor}
      onPress={handleOnPress}
      _pressed={{
        opacity: 0.8,
      }}
    >
      <VStack alignItems="center" px={5}>
        <Icon as={<MaterialIcons name="delete" />} color="white" size="sm" />
        <Text color="white" fontSize="xs" fontWeight="medium">
          Delete
        </Text>
      </VStack>
    </Pressable>
  ), [handleOnPress]);
};

const TransactionsSwipeList: FC = () => {
  const { colors } = useThemeColors();
  const { loading: loadingRefresh } = useSelector((state: RootState) => state.loading.effects.transactions.getTransactions);
  const rangeDetails = useSelector((state: RootState) => state.firefly.rangeDetails);
  const currency = useSelector((state: RootState) => state.currencies.current);
  const [transactions, setTransactions] = useState<TransactionType[]>([]);
  const dispatch = useDispatch<RootDispatch>();

  const onRefresh = async () => {
    const effectTransactions = await dispatch.transactions.getTransactions();
    setTransactions(effectTransactions);
  };

  const prevFiltersRef = useRef<string>();
  const scrollRef = React.useRef(null);

  useScrollToTop(scrollRef);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const fetchData = async () => {
        try {
          if (isActive) {
            onRefresh();
          }
        } catch (e) {
        }
      };

      if (prevFiltersRef.current !== `${rangeDetails.start}-${rangeDetails.end}-${currency.id}`) {
        fetchData();
        prevFiltersRef.current = `${rangeDetails.start}-${rangeDetails.end}-${currency.id}`;
      }

      return () => {
        isActive = false;
      };
    }, [rangeDetails, currency]),
  );

  const onEndReached = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const effectTransactions = await dispatch.transactions.getMoreTransactions();
    setTransactions([...transactions, ...effectTransactions]);
  };

  const closeRow = (rowKey, rowMap) => {
    if (rowMap[rowKey]) {
      rowMap[rowKey].closeRow();
    }
  };

  const deleteRow = (id) => {
    dispatch.transactions.deleteTransaction(id);
    const newTransactions = [...transactions];
    const prevIndex = transactions.findIndex((item) => item.id === id);
    newTransactions.splice(prevIndex, 1);
    setTransactions(newTransactions);
  };

  return useMemo(() => (
    <SwipeListView
      refreshControl={(
        <RefreshControl
          ref={scrollRef}
          refreshing={loadingRefresh}
          onRefresh={onRefresh}
          tintColor={colors.text}
        />
      )}
      initialNumToRender={15}
      maxToRenderPerBatch={15}
      keyExtractor={(item: TransactionType) => item.id}
      showsVerticalScrollIndicator={false}
      onEndReached={() => (!loadingRefresh && !_.isEmpty(transactions)) && onEndReached()}
      data={loadingRefresh ? [] : transactions}
      renderItem={({ item }) => <RenderItem item={item} />}
      renderHiddenItem={(data, rowMap) => (
        <RenderHiddenItem
          handleOnPress={() => deleteAlert(data.item, rowMap, closeRow, deleteRow)}
        />
      )}
      rightOpenValue={-80}
      stopRightSwipe={-250}
      rightActivationValue={-200}
      disableRightSwipe
      onRightActionStatusChange={({
        key,
        isActivated,
      }) => (isActivated ? deleteAlert(transactions.find((t) => t.id === key), [], closeRow, deleteRow) : null)}
      contentContainerStyle={{
        paddingBottom: 350,
      }}
      useNativeDriver
      getItemLayout={(data, index) => ({ length: ITEM_HEIGHT, offset: ITEM_HEIGHT * index, index })}
      ListFooterComponent={() => <ListFooterComponent />}
    />
  ), [transactions, loadingRefresh]);
};

const TransactionsScreen = () => {
  const { colors } = useThemeColors();
  const safeAreaInsets = useSafeAreaInsets();

  return (
    <View
      style={{
        flex: 1,
        marginTop: safeAreaInsets.top + 55,
        backgroundColor: colors.backgroundColor,
      }}
    >
      <TransactionsSwipeList />
    </View>
  );
};

export default TransactionsScreen;
