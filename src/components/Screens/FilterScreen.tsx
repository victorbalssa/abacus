import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import {
  TouchableOpacity, View, ScrollView, Text,
} from 'react-native';

import { AStackFlex, AText, AView } from '../UI/ALibrary';
import { RootState } from '../../store';
import { useThemeColors } from '../../lib/common';
import { ScreenType } from '../../types/screen';
import { types } from '../../models/transactions';

export default function FilterScreen({ navigation, route }: ScreenType) {
  const { colors } = useThemeColors();
  const {
    filterType,
    selectFilter,
  } = route.params;
  const currencies = useSelector((state: RootState) => state.currencies.currencies);
  const range = useSelector((state: RootState) => state.firefly.rangeDetails.range);
  const accounts = useSelector((state: RootState) => state.accounts.accounts);
  const selectedAccountIds = useSelector((state: RootState) => state.accounts.selectedAccountIds);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: filterType,
    });
  }, [navigation, filterType]);

  return useMemo(() => (
    <ScrollView bounces={false} contentContainerStyle={{ paddingHorizontal: 5 }}>
      {filterType === 'Type' && (
        <AStackFlex row justifyContent="center" flexWrap="wrap" py={10}>
          {types.map((type) => (
            <TouchableOpacity
              key={type.type}
              onPress={() => {
                selectFilter(type.type);
                navigation.goBack();
              }}
            >
              <AView style={{
                backgroundColor: colors.filterBorderColor,
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 10,
                paddingHorizontal: 10,
                height: 35,
                margin: 2,
              }}
              >
                <AText fontSize={15} color="white" bold>
                  {type.name}
                </AText>
              </AView>
            </TouchableOpacity>
          ))}
        </AStackFlex>
      )}
      {filterType === 'Currency' && (
      <AStackFlex row justifyContent="center" flexWrap="wrap" py={10}>
        {currencies.map((currency) => (
          <TouchableOpacity
            key={currency.id}
            onPress={() => {
              selectFilter(currency.attributes.code);
              navigation.goBack();
            }}
          >
            <AView style={{
              backgroundColor: colors.filterBorderColor,
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 10,
              width: 80,
              height: 35,
              margin: 2,
            }}
            >
              <AText fontSize={15} color="white" bold>
                {`${currency?.attributes.code} ${currency?.attributes.symbol}`}
              </AText>
            </AView>
          </TouchableOpacity>
        ))}
      </AStackFlex>
      )}
      {filterType === 'Account' && (
      <AStackFlex row justifyContent="center" flexWrap="wrap" py={10}>
        {accounts.map((account) => (
          <TouchableOpacity
            key={`key-${account.id}`}
            onPress={() => {
              selectFilter(account.attributes.name);
              navigation.goBack();
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
                style={{ fontFamily: 'Montserrat-Bold', color: 'white', maxWidth: 200 }}
                numberOfLines={1}
              >
                {account.attributes.name}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </AStackFlex>
      )}

      <View style={{ height: 200 }} />
    </ScrollView>
  ), [
    range,
    currencies,
    accounts,
    selectedAccountIds,
  ]);
}
