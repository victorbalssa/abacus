import React, { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Text,
  TouchableOpacity,
  View,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AntDesign, Ionicons } from '@expo/vector-icons';

import { AStack } from './ALibrary';
import { RootDispatch, RootState } from '../../store';
import translate from '../../i18n/locale';
import { useThemeColors } from '../../lib/common';

export default function Filters() {
  const { colors } = useThemeColors();
  const navigation = useNavigation();
  const currencies = useSelector((state: RootState) => state.currencies.currencies);
  const currentCode = useSelector((state: RootState) => state.currencies.currentCode);
  const range = useSelector((state: RootState) => state.firefly.rangeDetails.range);
  const accounts = useSelector((state: RootState) => state.accounts.accounts);
  const selectedAccountIds = useSelector((state: RootState) => state.accounts.selectedAccountIds);
  const {
    firefly: {
      setRange,
      getAccountChart,
    },
    currencies: {
      setCurrentCode,
    },
    accounts: {
      getAccounts,
      setSelectedAccountIds,
      resetSelectedAccountIds,
    },
  } = useDispatch<RootDispatch>();

  return useMemo(() => (
    <ScrollView contentContainerStyle={{
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.tabBackgroundColor,
      paddingHorizontal: 5,
    }}
    >
      <Text
        style={{
          fontFamily: 'Montserrat_Bold',
          margin: 15,
          color: colors.text,
          fontSize: 15,
          lineHeight: 15,
        }}
      >
        {translate('currency')}
      </Text>

      <AStack row justifyContent="center" flexWrap="wrap">
        {currencies.map((currency) => (
          <TouchableOpacity
            disabled={currentCode === currency.attributes.code}
            key={currency.id}
            onPress={() => {
              setCurrentCode(currency.attributes.code);
              navigation.goBack();
              getAccounts();
              resetSelectedAccountIds();
            }}
          >
            <View style={{
              backgroundColor: currentCode === currency.attributes.code ? colors.brandStyle : colors.filterBorderColor,
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 10,
              width: 80,
              height: 35,
              margin: 2,
            }}
            >
              <Text style={{ fontFamily: 'Montserrat_Bold', color: 'white' }}>
                {`${currency?.attributes.code} ${currency?.attributes.symbol}`}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </AStack>

      <Text
        style={{
          fontFamily: 'Montserrat_Bold',
          margin: 15,
          color: colors.text,
          fontSize: 15,
          lineHeight: 15,
        }}
      >
        {translate('period')}
      </Text>

      <AStack row justifyContent="center" flexWrap="wrap">
        {[1, 3, 6, 12].map((period) => (
          <TouchableOpacity
            key={period}
            onPress={() => {
              setRange({ range: period });
              navigation.goBack();
            }}
          >
            <View style={{
              backgroundColor: colors.filterBorderColor,
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 25,
              width: 60,
              height: 40,
              margin: 2,
            }}
            >
              {range === period ? (
                <Ionicons name="today" size={18} color="white" />
              ) : (
                <Text style={{ fontFamily: 'Montserrat_Bold', color: 'white' }}>
                  {`${period}M`}
                </Text>
              )}
            </View>
          </TouchableOpacity>
        ))}
      </AStack>
      <Text
        style={{
          fontFamily: 'Montserrat_Bold',
          margin: 15,
          color: colors.text,
          fontSize: 15,
          lineHeight: 15,
        }}
      >
        {translate('home_accounts')}
      </Text>
      <AStack justifyContent="center" row flexWrap="wrap">
        {accounts.map((account) => (
          <TouchableOpacity
            key={`key-${account.id}`}
            onPress={() => {
              setSelectedAccountIds(parseInt(account.id, 10));
              navigation.goBack();
              getAccountChart();
            }}
          >
            <View style={{
              backgroundColor: selectedAccountIds?.includes(parseInt(account.id, 10)) ? colors.brandStyle : colors.filterBorderColor,
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 10,
              height: 35,
              margin: 2,
              paddingHorizontal: 10,
            }}
            >
              <Text
                style={{ fontFamily: 'Montserrat_Bold', color: 'white', maxWidth: 200 }}
                numberOfLines={1}
              >
                {account.attributes.name}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
        <TouchableOpacity
          key="key-reset"
          onPress={() => {
            resetSelectedAccountIds();
            navigation.goBack();
            getAccountChart();
          }}
        >
          <View style={{
            backgroundColor: colors.filterBorderColor,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 10,
            height: 35,
            margin: 2,
            paddingHorizontal: 10,
          }}
          >
            <AntDesign name="close" size={20} color={colors.text} />
          </View>
        </TouchableOpacity>
      </AStack>
      <View style={{ height: 200 }} />
    </ScrollView>
  ), [
    range,
    currencies,
    currentCode,
    accounts,
    selectedAccountIds,
  ]);
}
