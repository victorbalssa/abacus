import React, { useMemo } from 'react';
import { Alert, RefreshControl, View } from 'react-native';
import {
  Box, HStack, Icon, Pressable, Skeleton, Text, VStack,
} from 'native-base';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { SwipeListView } from 'react-native-swipe-list-view';
import Animated, { Layout } from 'react-native-reanimated';

import moment from 'moment';
import * as Haptics from 'expo-haptics';
import { useSelector } from 'react-redux';
import NavigationHeader from '../UI/NavigationHeader';
import { TransactionType } from '../../models/transactions';
import { RootState } from '../../store';
import { translate } from '../../i18n/locale';
import { localNumberFormat, useThemeColors } from '../../lib/common';
import Filters from '../UI/Filters';

const Basic = ({
  loadingRefresh,
  loadingMore,
  onRefresh,
  onDeleteTransaction,
  onEndReached,
  onPressItem,
  onLongPressItem,
}) => {
  const transactions = useSelector((state: RootState) => state.transactions.transactions);
  const { colors } = useThemeColors();

  const closeRow = (rowMap, rowKey) => {
    if (rowMap[rowKey]) {
      rowMap[rowKey].closeRow();
    }
  };

  const deleteRow = (rowKey) => {
    onDeleteTransaction(rowKey);
    /*    const newData = [...listData];
    const prevIndex = listData.findIndex(item => item.key === rowKey);
    newData.splice(prevIndex, 1);
    setListData(newData); */
  };

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

  const getTransactionTypeAttributes = (type: string): { bg: string, color: string, icon: any, prefix: string} => {
    if (typeof colorItemTypes[type] === 'undefined') {
      return colorItemTypes.transfer;
    }

    return colorItemTypes[type];
  };

  const RenderItem = ({ item }) => useMemo(() => (
    <Pressable
      h={90}
      paddingLeft={2}
      backgroundColor={colors.backgroundColor}
      borderBottomWidth={0.5}
      borderColor={colors.listBorderColor}
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPressItem(item.id, item.attributes.transactions[0]);
      }}
      onLongPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        onLongPressItem(item.attributes.transactions[0]);
      }}
    >
      <HStack justifyContent="space-between" alignItems="start">
        <HStack alignItems="center">
          <Box style={{
            backgroundColor: getTransactionTypeAttributes(item.attributes.transactions[0].type).bg,
            borderRadius: 10,
            marginRight: 8,
            padding: 5,
          }}
          >
            <MaterialCommunityIcons name={getTransactionTypeAttributes(item.attributes.transactions[0].type).icon} size={24} color={getTransactionTypeAttributes(item.attributes.transactions[0].type).color} />
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
          <Text fontSize={15} fontFamily="Montserrat_Bold" style={{ color: getTransactionTypeAttributes(item.attributes.transactions[0].type).color }}>
            {`${getTransactionTypeAttributes(item.attributes.transactions[0].type).prefix}${localNumberFormat(item.attributes.transactions[0].currency_code, item.attributes.transactions[0].amount)}`}
          </Text>
        </Box>
      </HStack>
    </Pressable>
  ), [item]);

  const deleteAlert = async (transaction: TransactionType, rowMap) => {
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
          onPress: () => closeRow(rowMap, transaction?.id),
          style: 'cancel',
        },
      ],
    );
  };

  const RenderHiddenItem = ({ data, rowMap }) => useMemo(() => (
    <Pressable
      h={90}
      w="100%"
      ml="auto"
      bg="red.500"
      justifyContent="center"
      alignItems="flex-end"
      borderBottomWidth={1}
      borderColor={colors.listBorderColor}
      onPress={() => deleteAlert(data.item, rowMap)}
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
  ), [data, rowMap]);

  return (
    <SwipeListView
      refreshControl={(
        <RefreshControl
          refreshing={false}
          onRefresh={onRefresh}
          tintColor={colors.brandStyle}
        />
      )}
      initialNumToRender={2}
      keyExtractor={(item: TransactionType) => item.id}
      showsVerticalScrollIndicator={false}
      onEndReached={() => !(loadingRefresh || loadingMore) && onEndReached()}
      onEndReachedThreshold={0}
      data={!loadingRefresh ? transactions : []}
      renderItem={({ item }) => <RenderItem item={item} />}
      renderHiddenItem={(data, rowMap) => <RenderHiddenItem data={data} rowMap={rowMap} />}
      rightOpenValue={-80}
      stopRightSwipe={-250}
      rightActivationValue={-200}
      disableRightSwipe
      onRightActionStatusChange={({ key, isActivated }) => (isActivated ? deleteAlert(transactions.find((t) => t.id == key), []) : null)}
      contentContainerStyle={{
        marginTop: 50,
        paddingBottom: 250,
      }}
      ListFooterComponent={(
        <>
          {(loadingRefresh || loadingMore) && (
            <>
              <Box
                h={90}
                paddingLeft={2}
                backgroundColor={colors.backgroundColor}
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
                h={90}
                paddingLeft={2}
                backgroundColor={colors.backgroundColor}
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
      )}
    />
  );
};

const Transactions = ({
  loadingRefresh,
  loadingMore,
  onRefresh,
  onDeleteTransaction,
  onEndReached,
  onPressItem,
  onLongPressItem,
}) => (
  <Box safeAreaTop>
    <Basic
      loadingRefresh={loadingRefresh}
      loadingMore={loadingMore}
      onRefresh={onRefresh}
      onDeleteTransaction={onDeleteTransaction}
      onEndReached={onEndReached}
      onPressItem={onPressItem}
      onLongPressItem={onLongPressItem}
    />
    <NavigationHeader />
  </Box>
);

export default Transactions;
