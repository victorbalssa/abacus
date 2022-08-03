import React from 'react';
import { RefreshControl } from 'react-native';
import {
  Box, HStack, Icon, Pressable, Text,
  ScrollView, VStack, Spacer, Skeleton,
} from 'native-base';
import {
  Entypo, Feather, MaterialCommunityIcons, MaterialIcons,
} from '@expo/vector-icons';
import { SwipeListView } from 'react-native-swipe-list-view';

import moment from 'moment';
import RangeTitle from '../UI/RangeTitle';
import colors from '../../../constants/colors';

type TransactionsType = {
  loading: boolean,
  transactions: [],
  onRefresh: () => void,
  onDeleteTransaction: (id: string) => Promise<void>,
  onEndReached: () => void,
  onPressItem: (id: string, payload: {}) => void,
}

const Basic = ({
  loading, onRefresh, transactions, onDeleteTransaction, onEndReached, onPressItem,
}) => {
  const closeRow = (rowMap, rowKey) => {
    if (rowMap[rowKey]) {
      rowMap[rowKey].closeRow();
    }
  };

  const deleteRow = async (rowMap, rowKey) => {
    closeRow(rowMap, rowKey);
    await onDeleteTransaction(rowKey);
  };

  const colorItemTypes = {
    withdrawal: {
      bg: '#ffe5e5',
      color: '#ff2d2d',
      icon: 'arrow-up',
      prefix: '-',
    },
    deposit: {
      bg: '#e5ffe5',
      color: 'green',
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

  const renderItem = ({
    item,
  }) => (
    <Pressable
      bg="white"
      m={1}
      borderRadius={15}
      shadow={2}
      onPress={() => onPressItem(item.id, item.attributes.transactions[0])}
    >
      <Box pl={4} pr={3} py={2}>
        <HStack justifyContent="space-between" alignItems="center" space={3}>
          <HStack alignItems="center">
            <Box style={{
              borderColor: colorItemTypes[item.attributes.transactions[0].type].bg,
              borderRadius: 15,
              borderWidth: 7,
              backgroundColor: colorItemTypes[item.attributes.transactions[0].type].bg,
              margin: 10,
              marginLeft: 0,
            }}
            >
              <MaterialCommunityIcons name={colorItemTypes[item.attributes.transactions[0].type].icon} size={24} color={colorItemTypes[item.attributes.transactions[0].type].color} />
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
            borderColor: colorItemTypes[item.attributes.transactions[0].type].bg,
            borderRadius: 15,
            borderWidth: 7,
            backgroundColor: colorItemTypes[item.attributes.transactions[0].type].bg,
            margin: 10,
            marginRight: 0,
          }}
          >
            <Text fontSize={15} fontFamily="Montserrat_Bold" style={{ color: colorItemTypes[item.attributes.transactions[0].type].color }}>
              {`${colorItemTypes[item.attributes.transactions[0].type].prefix}${item.attributes.transactions[0].currency_symbol}${parseFloat(item.attributes.transactions[0].amount).toFixed(item.attributes.transactions[0].currency_decimal_places)}`}
            </Text>
          </Box>
        </HStack>
      </Box>
    </Pressable>
  );

  const renderHiddenItem = (data, rowMap) => (
    <HStack flex={1} m={1}>
      <Pressable
        w="79"
        ml="auto"
        pl="3"
        bg="red.500"
        justifyContent="center"
        borderRightRadius={15}
        onPress={() => deleteRow(rowMap, data.item.id)}
        _pressed={{
          opacity: 0.5,
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
  );

  return (
    <SwipeListView
      refreshControl={(
        <RefreshControl
          refreshing={loading}
          onRefresh={onRefresh}
          tintColor={colors.brandStyle}
        />
      )}
      refreshing={loading}
      keyExtractor={(item) => item.id}
      showsVerticalScrollIndicator={false}
      onEndReached={onEndReached}
      onEndReachedThreshold={0}
      data={transactions}
      renderItem={renderItem}
      renderHiddenItem={renderHiddenItem}
      rightOpenValue={-65}
      stopRightSwipe={-65}
      disableRightSwipe
      /* TODO: preview
      previewRowKey="5356"
      previewOpenValue={-65}
      previewOpenDelay={2000}
      previewDuration={300}
      */
      contentContainerStyle={{
        paddingTop: 5,
        paddingHorizontal: 5,
        paddingBottom: 300,
      }}
      ListFooterComponent={(
        <>
          {loading && (
            <>
              <Box
                bg="white"
                m={1}
                borderRadius={15}
                shadow={2}
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
                bg="white"
                m={1}
                borderRadius={15}
                shadow={2}
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
            </>
          )}
        </>
)}
    />
  );
};

const Transactions = ({
  loading,
  transactions,
  onRefresh,
  onDeleteTransaction,
  onEndReached,
  onPressItem,
}: TransactionsType) => (
  <>
    <RangeTitle />
    <Box flex={1}>
      <Basic
        loading={loading}
        onRefresh={onRefresh}
        onDeleteTransaction={onDeleteTransaction}
        onEndReached={onEndReached}
        onPressItem={onPressItem}
        transactions={transactions}
      />
    </Box>
  </>
);

export default Transactions;
