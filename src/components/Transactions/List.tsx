import React, { useMemo } from 'react';
import { Alert, RefreshControl } from 'react-native';
import {
  Box, HStack, Icon, Pressable, Skeleton, Text, VStack,
} from 'native-base';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { SwipeListView } from 'react-native-swipe-list-view';
import Animated, { Layout } from 'react-native-reanimated';

import moment from 'moment';
import * as Haptics from 'expo-haptics';
import { ImpactFeedbackStyle } from 'expo-haptics';
import { useSelector } from 'react-redux';
import RangeTitle from '../UI/RangeTitle';
import colors from '../../constants/colors';
import { TransactionType } from '../../models/transactions';
import { RootState } from '../../store';
import { translate } from '../../i18n/locale';

const Basic = ({
  loadingRefresh,
  loadingMore,
  onRefresh,
  onDeleteTransaction,
  onEndReached,
  onPressItem,
}) => {
  const transactions = useSelector((state: RootState) => state.transactions.transactions);

  const closeRow = (rowMap, rowKey) => {
    if (rowMap[rowKey]) {
      rowMap[rowKey].closeRow();
    }
  };

  const colorItemTypes = {
    withdrawal: {
      bg: colors.brandDangerLight,
      color: colors.brandDanger,
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
      bg: '#e5f2ff',
      color: 'blue',
      icon: 'arrow-left-right',
      prefix: '',
    },
    'opening balance': {
      bg: '#e5f2ff',
      color: 'blue',
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
      h="71"
      bg="white"
      m={1}
      borderWidth={1}
      borderColor="#E3E3E3FF"
      justifyContent="center"
      borderRadius={15}
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPressItem(item.id, item.attributes.transactions[0]);
      }}
      onLongPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        onPressItem(item.id, item.attributes.transactions[0]);
      }}
    >
      <Box px={3}>
        <HStack justifyContent="space-between" alignItems="center" space={3}>
          <HStack alignItems="center">
            <Box style={{
              borderColor: getTransactionTypeAttributes(item.attributes.transactions[0].type).bg,
              borderRadius: 15,
              borderWidth: 7,
              backgroundColor: getTransactionTypeAttributes(item.attributes.transactions[0].type).bg,
              margin: 10,
              marginLeft: 0,
            }}
            >
              <MaterialCommunityIcons name={getTransactionTypeAttributes(item.attributes.transactions[0].type).icon} size={24} color={getTransactionTypeAttributes(item.attributes.transactions[0].type).color} />
            </Box>
            <VStack>
              <Text
                fontFamily="Montserrat_Bold"
                maxW={170}
                numberOfLines={1}
              >
                {item.attributes.transactions[0].description}
              </Text>

              <Text
                fontSize="xs"
                color="coolGray.800"
                alignSelf="flex-start"
                maxW={170}
                numberOfLines={1}
              >
                {`${item.attributes.transactions[0].type === 'withdrawal' ? `${item.attributes.transactions[0].source_name}` : `${item.attributes.transactions[0].destination_name}`}`}
              </Text>

              <Text
                fontSize="xs"
                color="coolGray.800"
                alignSelf="flex-start"
                maxW={170}
                numberOfLines={1}
              >
                {`${moment(item.attributes.transactions[0].date).format('ll')} ${item.attributes.transactions[0].category_name ? `• ${item.attributes.transactions[0].category_name}` : ''}`}
              </Text>
            </VStack>
          </HStack>
          <Box style={{
            borderColor: getTransactionTypeAttributes(item.attributes.transactions[0].type).bg,
            borderRadius: 15,
            borderWidth: 7,
            backgroundColor: getTransactionTypeAttributes(item.attributes.transactions[0].type).bg,
            margin: 10,
            marginRight: 0,
          }}
          >
            <Text fontSize={15} fontFamily="Montserrat_Bold" style={{ color: getTransactionTypeAttributes(item.attributes.transactions[0].type).color }}>
              {`${getTransactionTypeAttributes(item.attributes.transactions[0].type).prefix}${item.attributes.transactions[0].currency_symbol}${parseFloat(item.attributes.transactions[0].amount).toFixed(item.attributes.transactions[0].currency_decimal_places)}`}
            </Text>
          </Box>
        </HStack>
      </Box>
    </Pressable>
  ), [item]);

  const deleteAlert = async (data, rowMap) => {
    await Haptics.impactAsync(ImpactFeedbackStyle.Light);
    Alert.alert(
      translate('transaction_list_alert_title'),
      `${translate('transaction_list_alert_text')}\n`
      + `${(data.item as TransactionType)?.attributes?.transactions[0]?.description}\n`
      + `${moment((data.item as TransactionType)?.attributes?.transactions[0]?.date).format('ll')} ${(data.item as TransactionType)?.attributes?.transactions[0]?.category_name ? `• ${(data.item as TransactionType)?.attributes?.transactions[0]?.category_name}` : ''}\n`,
      [
        {
          text: translate('transaction_list_delete_button'),
          onPress: async () => {
            await onDeleteTransaction((data.item as TransactionType)?.id);
          },
          style: 'destructive',
        },
        {
          text: translate('transaction_list_cancel_button'),
          onPress: () => closeRow(rowMap, (data.item as TransactionType)?.id),
          style: 'cancel',
        },
      ],
    );
  };

  const RenderHiddenItem = ({ data, rowMap }) => useMemo(() => (
    <HStack
      h="71"
      m={1}
    >
      <Pressable
        w="79"
        ml="auto"
        pl="3"
        bg="red.500"
        justifyContent="center"
        borderRightRadius={15}
        onPress={() => deleteAlert(data, rowMap)}
        _pressed={{
          opacity: 0.8,
        }}
      >
        <VStack alignItems="center" space={2}>
          <Icon as={<MaterialIcons name="delete" />} color="white" size="xs" />
          <Text color="white" fontSize="xs" fontWeight="medium">
            Delete
          </Text>
        </VStack>
      </Pressable>
    </HStack>
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
      initialNumToRender={10}
      keyExtractor={(item: TransactionType) => item.id}
      showsVerticalScrollIndicator
      onEndReached={onEndReached}
      onEndReachedThreshold={0}
      data={!loadingRefresh ? transactions : []}
      renderItem={({ item }) => <RenderItem item={item} />}
      renderHiddenItem={(data, rowMap) => <RenderHiddenItem data={data} rowMap={rowMap} />}
      rightOpenValue={-65}
      stopRightSwipe={-65}
      disableRightSwipe
      contentContainerStyle={{
        paddingTop: 5,
        paddingHorizontal: 5,
        paddingBottom: 320,
      }}
      ListFooterComponent={(
        <>
          {(loadingRefresh || loadingMore) && (
            <>
              <Box
                h="71"
                bg="white"
                m={1}
                borderWidth={1}
                borderColor="#E3E3E3FF"
                justifyContent="center"
                borderRadius={15}
              >
                <Box pl={4} pr={3} py={2}>
                  <HStack justifyContent="space-between" alignItems="center" space={3}>
                    <HStack alignItems="center">
                      <Skeleton w={10} m={2} ml={0} rounded={15} />
                      <Skeleton.Text w={145} lines={3} />
                    </HStack>
                    <Skeleton w={75} rounded={15} />
                  </HStack>
                </Box>
              </Box>
              <Box
                h="71"
                bg="white"
                m={1}
                borderWidth={1}
                borderColor="#E3E3E3FF"
                justifyContent="center"
                borderRadius={15}
              >
                <Box px={3}>
                  <HStack justifyContent="space-between" alignItems="center" space={3}>
                    <HStack alignItems="center">
                      <Skeleton w={10} m={2} ml={0} rounded={15} />
                      <Skeleton.Text w={145} lines={3} />
                    </HStack>
                    <Skeleton w={75} rounded={15} />
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
}) => (
  <>
    <RangeTitle />
    <Animated.View style={{ flex: 1 }} layout={Layout}>
      <Basic
        loadingRefresh={loadingRefresh}
        loadingMore={loadingMore}
        onRefresh={onRefresh}
        onDeleteTransaction={onDeleteTransaction}
        onEndReached={onEndReached}
        onPressItem={onPressItem}
      />
    </Animated.View>
  </>
);

export default Transactions;
