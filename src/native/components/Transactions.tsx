import React from 'react';
import { RefreshControl } from 'react-native';
import {
  Avatar,
  Box, HStack, Icon, Pressable, Text,
  ScrollView, VStack,
} from 'native-base';
import {Entypo, Feather, MaterialIcons} from '@expo/vector-icons';
import { SwipeListView } from 'react-native-swipe-list-view';

import RangeTitle from './UI/RangeTitle';
import colors from '../../constants/colors';

type TransactionsType = {
  loading: boolean,
  transactions: [],
  fetchData: () => Promise<void>,
}

const Basic = ({ transactions }) => {
  const dataOld = [{
    id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
    fullName: 'Afreen Khan',
    timeStamp: '12:47 PM',
    recentText: 'Good Day!',
    avatarUrl: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
  }];

  const closeRow = (rowMap, rowKey) => {
    if (rowMap[rowKey]) {
      rowMap[rowKey].closeRow();
    }
  };

  const deleteRow = (rowMap, rowKey) => {
    closeRow(rowMap, rowKey);
    /*
    const newData = [...listData];
    const prevIndex = listData.findIndex((item) => item.key === rowKey);
    newData.splice(prevIndex, 1);
    setListData(newData);
*/
  };

  const onRowDidOpen = (rowKey) => {
    console.log('This row opened', rowKey);
  };

  const renderItem = ({
    item,
  }) => (
    <Box bg="white" borderBottomWidth={0.4} borderBottomColor="coolGray.800">
      <Pressable onPress={() => console.log('You touched me')}>
        <Box pl="4" pr="5" py="2">
          <HStack justifyContent="space-between" alignItems="center" space={3}>
            <Feather name="arrow-down-left" size={24} color="green" />
            <VStack>
              <Text
                color="coolGray.800"
                bold
                maxW={200}
              >
                {item.attributes.transactions[0].description}
              </Text>

              <Text
                fontSize="xs"
                color="coolGray.800"
                alignSelf="flex-start"
              >
                {item.attributes.created_at}
              </Text>
            </VStack>
            <Text fontSize={20} fontFamily="Montserrat_Bold" style={{ color: 'green'}}>
              {'-' + item.attributes.transactions[0].currency_symbol + parseFloat(item.attributes.transactions[0].amount).toFixed(item.attributes.transactions[0].currency_decimal_places)}
            </Text>
          </HStack>
        </Box>
      </Pressable>
    </Box>
  );

  const renderHiddenItem = (data, rowMap) => (
    <HStack flex="1" pl="2">
      <Pressable
        w="70"
        ml="auto"
        bg="coolGray.200"
        justifyContent="center"
        onPress={() => closeRow(rowMap, data.item.key)}
        _pressed={{
          opacity: 0.5,
        }}
      >
        <VStack alignItems="center" space={2}>
          <Icon as={<Entypo name="dots-three-horizontal" />} size="xs" color="coolGray.800" />
          <Text fontSize="xs" fontWeight="medium" color="coolGray.800">
            More
          </Text>
        </VStack>
      </Pressable>
      <Pressable
        w="70"
        bg="red.500"
        justifyContent="center"
        onPress={() => deleteRow(rowMap, data.item.key)}
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
    <Box>
      <SwipeListView
        data={transactions}
        renderItem={renderItem}
        renderHiddenItem={renderHiddenItem}
        rightOpenValue={-130}
        previewRowKey="0"
        previewOpenValue={-40}
        previewOpenDelay={3000}
        onRowDidOpen={onRowDidOpen}
      />
    </Box>
  );
};

const Transactions = ({
  loading,
  transactions,
  fetchData,
}: TransactionsType) => (
  <>
    <RangeTitle />
    <Box flex={1}>
      <ScrollView
        p={3}
        _contentContainerStyle={{
          alignItems: 'center',
        }}
        refreshControl={(
          <RefreshControl
            refreshing={loading}
            onRefresh={fetchData}
            tintColor={colors.brandStyle}
          />
        )}
      />
      <Basic transactions={transactions} />
    </Box>
  </>
);

export default Transactions;
