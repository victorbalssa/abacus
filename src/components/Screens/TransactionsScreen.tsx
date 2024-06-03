import React, {
  useCallback,
  useMemo,
  useLayoutEffect,
  useEffect,
  useState,
} from 'react';
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
} from 'react-native';
import moment from 'moment';
import { SwipeListView } from 'react-native-swipe-list-view';
import {
  EvilIcons,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useDispatch, useSelector } from 'react-redux';
import {
  CommonActions,
  useFocusEffect,
  useNavigation,
} from '@react-navigation/native';

import { GetTransactionsPayload, TransactionSplitType, TransactionType } from '../../models/transactions';
import { RootDispatch, RootState } from '../../store';
import translate from '../../i18n/locale';
import { D_WIDTH, localNumberFormat, useThemeColors } from '../../lib/common';
import { ScreenType } from '../../types/screen';
import {
  APressable, AScrollView, AStackFlex, AText, AView,
} from '../UI/ALibrary';
import AFilterButton from '../UI/ALibrary/AFilterButton';
import AButton from '../UI/ALibrary/AButton';
import ADateFilterButton from '../UI/ALibrary/ADateFilterButton';

const ITEM_HEIGHT = 90;

const resetTransactionsDates = (transactions: TransactionSplitType[]) => transactions.map((t) => ({
  ...t,
  date: new Date().toISOString(),
}));

function ListFooterComponent({ onLoadMore, initLoading }) {
  const { colors } = useThemeColors();
  const loading = useSelector((state: RootState) => state.loading.effects.transactions.getMoreTransactions?.loading);
  const { page, totalPages } = useSelector((state: RootState) => state.transactions);

  return useMemo(() => (loading || initLoading || (page < totalPages)) && (
    <AStackFlex
      style={{
        height: ITEM_HEIGHT,
      }}
    >
      {(loading || initLoading) && (
      <AStackFlex py={10} px={10}>
        <ActivityIndicator color={colors.text} />
      </AStackFlex>
      )}
      {(!initLoading && !loading && (page < totalPages)) && (
        <AButton style={{ height: 40 }} mx={30} onPress={onLoadMore}>
          <AStackFlex row>
            <Ionicons name="cloud-download" size={15} color="white" style={{ margin: 5 }} />
            <AText fontSize={15}>{translate('load_more')}</AText>
          </AStackFlex>
        </AButton>
      )}
    </AStackFlex>
  ), [
    colors,
    page,
    totalPages,
    loading,
    initLoading,
  ]);
}

function RenderItem({ item }) {
  const { colors } = useThemeColors();
  const navigation = useNavigation();

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

  const colorItemTypes = {
    withdrawal: {
      bg: colors.brandNeutralLight,
      color: colors.brandNeutral,
      icon: 'arrow-down',
      prefix: '-',
    },
    deposit: {
      bg: colors.brandSuccessLight,
      color: colors.brandSuccess,
      icon: 'arrow-up',
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

  const getTransactionTypeAttributes = (type: string) => {
    if (typeof colorItemTypes[type] === 'undefined') {
      return colorItemTypes.transfer;
    }

    return colorItemTypes[type];
  };

  return useMemo(() => (
    <APressable
      style={{
        height: ITEM_HEIGHT,
        backgroundColor: colors.tileBackgroundColor,
        borderTopWidth: 0.5,
        borderColor: colors.listBorderColor,
        paddingLeft: 10,
      }}
      onPress={() => {
        goToEdit(item.id, {
          splits: item.attributes.transactions,
          groupTitle: item.attributes.groupTitle,
        });
      }}
      onLongPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy).catch();
        goToDuplicate({
          splits: resetTransactionsDates(item.attributes.transactions),
          groupTitle: item.attributes.groupTitle || '',
        });
      }}
    >
      <AStackFlex justifyContent="space-between" alignItems="flex-start" row>
        <AStackFlex justifyContent="flex-start" row>
          <AView
            style={{
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
          </AView>
          <AStackFlex alignItems="flex-start" py={7}>
            <AText fontSize={14} maxWidth={D_WIDTH - 175} numberOfLines={1} bold>
              {item.attributes.groupTitle}
              {item.attributes.groupTitle?.length > 0 ? ': ' : ''}
              {item.attributes.transactions[0].description}
            </AText>

            <AText fontSize={12} maxWidth={D_WIDTH - 175} numberOfLines={1}>
              {item.attributes.transactions[0].type === 'withdrawal'
                ? item.attributes.transactions[0].sourceName
                : item.attributes.transactions[0].destinationName}
            </AText>

            <AText fontSize={12} maxWidth={D_WIDTH - 175} numberOfLines={1}>
              {`${moment(item.attributes.transactions[0].date).format('ll')} • ${item.attributes.transactions[0].categoryName || ''}`}
            </AText>
            {item.attributes.transactions[0].tags.length > 0 && (
              <AStackFlex justifyContent="flex-start" alignItems="flex-start" row>
                {item.attributes.transactions[0].tags.filter((_, index) => index < 2).map((tag) => (
                  <AView
                    key={tag}
                    style={{
                      height: 15,
                      flexDirection: 'row',
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderRadius: 4,
                      paddingHorizontal: 2,
                      paddingVertical: 0,
                      backgroundColor: colors.brandNeutralFix,
                      marginHorizontal: 2,
                    }}
                  >
                    <EvilIcons name="tag" size={15} color={colors.brandDark} />
                    <AText fontSize={10} color={colors.brandDark} numberOfLines={1} maxWidth={100} bold>{tag}</AText>
                  </AView>
                ))}
              </AStackFlex>
            )}
          </AStackFlex>
        </AStackFlex>
        <AView
          style={{
            borderRadius: 10,
            backgroundColor: getTransactionTypeAttributes(item.attributes.transactions[0].type).bg,
            margin: 10,
            marginTop: 15,
            padding: 5,
          }}
        >
          <AText fontSize={15} color={getTransactionTypeAttributes(item.attributes.transactions[0].type).color} bold>
            {`${getTransactionTypeAttributes(item.attributes.transactions[0].type).prefix}${localNumberFormat(item.attributes.transactions[0].currencyCode, item.attributes.transactions.reduce((total, split) => total + parseFloat(split.amount), 0))}`}
          </AText>
        </AView>
      </AStackFlex>
    </APressable>
  ), [item, colors]);
}

async function deleteAlert(transaction: TransactionType, rowMap, closeRow, deleteRow) {
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning).catch();
  Alert.alert(
    translate('transaction_list_alert_title'),
    `${translate('transaction_list_alert_text')}\n`
    + `${transaction?.attributes?.transactions[0]?.description}\n`
    + `${moment(transaction?.attributes?.transactions[0]?.date).format('ll')} • ${transaction?.attributes?.transactions[0]?.categoryName || ''}\n`,
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
}

function RenderHiddenItem({ handleOnPressCopy, handleOnPressDelete }) {
  const { colors } = useThemeColors();

  return useMemo(() => (
    <AStackFlex row>
      <APressable
        style={{
          height: ITEM_HEIGHT,
          width: '50%',
          backgroundColor: colors.brandWarning,
          paddingHorizontal: 10,
          borderTopWidth: 0.5,
          borderColor: colors.listBorderColor,
        }}
        onPress={handleOnPressCopy}
      >
        <AStackFlex alignItems="flex-start">
          <AStackFlex style={{ width: 70 }}>
            <MaterialIcons name="content-copy" color="white" size={17} />
            <AText color="white" fontSize={12} bold>
              {translate('transaction_clone')}
            </AText>
          </AStackFlex>
        </AStackFlex>
      </APressable>
      <APressable
        style={{
          height: ITEM_HEIGHT,
          width: '50%',
          backgroundColor: colors.red,
          paddingHorizontal: 10,
          borderTopWidth: 0.5,
          borderColor: colors.listBorderColor,
        }}
        onPress={handleOnPressDelete}
      >
        <AStackFlex alignItems="flex-end">
          <AStackFlex style={{ width: 70 }}>
            <MaterialIcons name="delete" color="white" size={17} />
            <AText color="white" fontSize={12} bold>
              {translate('transaction_delete')}
            </AText>
          </AStackFlex>
        </AStackFlex>
      </APressable>
    </AStackFlex>
  ), [handleOnPressCopy, handleOnPressDelete]);
}

export default function TransactionsScreen({ navigation, route }: ScreenType) {
  const { params } = route;
  const { colors } = useThemeColors();
  const [loading, setLoading] = useState<boolean>(false);
  const [transactions, setTransactions] = useState<TransactionType[]>([]);
  const [search, setSearch] = useState('');
  const defaultStart = useSelector((state: RootState) => state.firefly.rangeDetails.start);
  const [start, setStartDate] = useState<Date>(new Date(`${defaultStart}T12:00:00`));
  const defaultEnd = useSelector((state: RootState) => state.firefly.rangeDetails.end);
  const [end] = useState<Date>(new Date(`${defaultEnd}T12:00:00`));
  const [account, setAccount] = useState<string>('');
  const [type, setType] = useState<'' | 'withdrawal' | 'deposit' | 'transfer'>('');
  const [currentCode, setCurrentCode] = useState('');
  const {
    transactions: {
      getMoreTransactions,
      getTransactions,
      deleteTransaction,
    },
  } = useDispatch<RootDispatch>();

  const onLoadMore = async () => {
    const payload: GetTransactionsPayload = {
      start,
      end,
      type,
      currentCode,
      account,
      search,
    };
    const effectTransactions = await getMoreTransactions(payload);
    setTransactions([...transactions, ...effectTransactions]);
  };

  const onLoad = async () => {
    const payload: GetTransactionsPayload = {
      start,
      end,
      type,
      currentCode,
      account,
      search,
    };
    setLoading(true);
    const effectTransactions = await getTransactions(payload);
    setTransactions(effectTransactions);
    setLoading(false);
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerSearchBarOptions: {
        autoCapitalize: 'none',
        placeholder: 'Search transactions...',
        headerIconColor: colors.text,
        textColor: colors.text,
        hintTextColor: colors.text,
        onChangeText: (event) => setSearch(event.nativeEvent.text),
        onBlur: () => onLoad(),
        onSearchButtonPress: () => onLoad(),
        disableBackButtonOverride: true,
        shouldShowHintSearchIcon: false,
      },
    });
  }, [navigation, search]);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      if (params?.forceRefresh === true) {
        if (isActive) {
          onLoad().catch();
          navigation.setParams({ forceRefresh: false });
        }
      }

      return () => {
        isActive = false;
      };
    }, [params, currentCode, type]),
  );

  useEffect(() => {
    onLoad().catch();
  }, [type, currentCode, start, account]);

  const closeRow = (rowKey: string | number, rowMap: { [x: string]: { closeRow: () => void; }; }) => {
    if (rowMap[rowKey]) {
      rowMap[rowKey].closeRow();
    }
  };

  const deleteRow = (id: string) => {
    deleteTransaction(id);
    setTransactions((prevState) => prevState.filter((item) => item.id !== id));
  };

  const goToDuplicate = (payload: { splits: TransactionSplitType[]; groupTitle: string; }) => navigation.dispatch(
    CommonActions.navigate({
      name: 'TransactionCreateScreen',
      params: {
        payload,
      },
    }),
  );

  const resetFilters = () => {
    setType('');
    setCurrentCode('');
    setSearch('');
    setAccount('');
    setStartDate(new Date(`${defaultStart}T12:00:00`));
  };

  return (
    <SwipeListView
      nestedScrollEnabled={false}
      contentInsetAdjustmentBehavior="automatic"
      refreshControl={(
        <RefreshControl
          refreshing={false}
          onRefresh={onLoad}
        />
      )}
      ListHeaderComponent={(
        <AStackFlex row backgroundColor={colors.tileBackgroundColor} py={5}>
          {(type !== '' || currentCode !== '' || account !== '') && (
            <AView
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                width: 30,
                height: 30,
                marginHorizontal: 5,
              }}

            >
              <Ionicons onPress={resetFilters} name="close-circle" size={24} color={colors.text} />
            </AView>
          )}
          <AScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
          >
            <ADateFilterButton currentDate={start} selectDate={(date: Date) => setStartDate(date)} />
            <AFilterButton filterType="Type" selected={type} selectFilter={(selected: 'withdrawal' | 'deposit' | 'transfer') => setType(selected)} navigation={navigation} capitalize />
            <AFilterButton filterType={translate('currency')} selected={currentCode} selectFilter={(selected) => setCurrentCode(selected)} navigation={navigation} />
            <AFilterButton filterType={translate('home_accounts')} selected={account} selectFilter={(selected) => setAccount(selected)} navigation={navigation} />
          </AScrollView>
        </AStackFlex>
      )}
      initialNumToRender={15}
      keyExtractor={(item: TransactionType) => item.id}
      data={!loading ? transactions : []}
      showsVerticalScrollIndicator
      renderItem={({ item }) => <RenderItem item={item} />}
      renderHiddenItem={(data, rowMap) => (
        <RenderHiddenItem
          handleOnPressCopy={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy).catch();
            goToDuplicate({
              splits: resetTransactionsDates(data.item.attributes.transactions),
              groupTitle: data.item.attributes.groupTitle || '',
            });
          }}
          handleOnPressDelete={() => deleteAlert(data.item, rowMap, closeRow, deleteRow)}
        />
      )}
      rightOpenValue={-90}
      stopRightSwipe={-190}
      rightActivationValue={-170}
      onRightActionStatusChange={({
        key,
        isActivated,
      }) => (isActivated ? deleteAlert(transactions.find((t) => t.id === key), [], closeRow, deleteRow) : null)}
      leftOpenValue={90}
      stopLeftSwipe={190}
      leftActivationValue={170}
      onLeftActionStatusChange={({
        key,
        isActivated,
      }) => (isActivated ? goToDuplicate({
        splits: resetTransactionsDates(transactions.find((t) => t.id === key).attributes.transactions),
        groupTitle: transactions.find((t) => t.id === key).attributes.groupTitle || '',
      }) : null)}
      contentContainerStyle={{ paddingBottom: 100 }}
      getItemLayout={(_, index: number) => ({ length: ITEM_HEIGHT + 1, offset: (ITEM_HEIGHT + 1) * index, index })}
      ListFooterComponent={ListFooterComponent({ onLoadMore, initLoading: loading })}
    />
  );
}
