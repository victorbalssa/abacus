import React, { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { HStack, VStack } from 'native-base';
import { Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { RootDispatch, RootState } from '../../store';
import translate from '../../i18n/locale';
import { useThemeColors } from '../../lib/common';

export default function Filters() {
  const { colors } = useThemeColors();
  const navigation = useNavigation();
  const currencies = useSelector((state: RootState) => state.currencies.currencies);
  const currentCurrency = useSelector((state: RootState) => state.currencies.current);
  const range = useSelector((state: RootState) => state.firefly.rangeDetails?.range || 1);
  const {
    firefly: {
      handleChangeRange,
    },
    currencies: {
      handleChangeCurrent,
    },
  } = useDispatch<RootDispatch>();

  return useMemo(() => (
    <VStack
      py={1}
      alignItems="center"
      justifyContent="center"
      backgroundColor={colors.tabBackgroundColor}
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

      <HStack justifyContent="center" flexDirection="row" flexWrap="wrap">
        {currencies.map((currency) => (
          <TouchableOpacity
            disabled={currentCurrency.id === currency.id}
            key={currency.id}
            onPress={() => {
              handleChangeCurrent(currency.id);
              navigation.goBack();
            }}
          >
            <View style={{
              backgroundColor: currentCurrency.id === currency.id ? colors.brandStyle : colors.filterBorderColor,
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
      </HStack>

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

      <HStack justifyContent="center" flexDirection="row" flexWrap="wrap">
        {[1, 3, 6, 12].map((period) => (
          <TouchableOpacity
            disabled={range === period}
            key={period}
            onPress={() => {
              handleChangeRange({ range: period });
              navigation.goBack();
            }}
          >
            <View style={{
              backgroundColor: range === period ? colors.brandStyle : colors.filterBorderColor,
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 25,
              width: 60,
              height: 40,
              margin: 2,
            }}
            >
              <Text style={{ fontFamily: 'Montserrat_Bold', color: 'white' }}>
                {`${period}M`}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </HStack>
    </VStack>
  ), [
    currencies,
    currentCurrency,
    handleChangeCurrent,
    range,
    handleChangeRange,
  ]);
}
