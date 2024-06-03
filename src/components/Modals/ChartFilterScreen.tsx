import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import {
  TouchableOpacity,
  View,
  ScrollView,
} from 'react-native';

import { AStackFlex, AText, AView } from '../UI/ALibrary';
import { RootState } from '../../store';
import { useThemeColors } from '../../lib/common';
import { ScreenType } from '../../types/screen';
import { types } from '../../models/transactions';
import translate from '../../i18n/locale';

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
      {selectedAccountIds?.length > 0 && (
        <View style={{
          alignSelf: 'flex-start',
          borderWidth: 0.7,
          borderColor: colors.text,
          borderRadius: 10,
          paddingHorizontal: 5,
          marginHorizontal: 1,
        }}
        >
          <AText fontSize={10} lineHeight={12} bold>
            {`+${selectedAccountIds.length}`}
          </AText>
        </View>
      )}
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
      {filterType === translate('currency') && (
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

      {/*      {filterType === 'Period' ? (
        <>
          <Text
            style={{
              fontFamily: 'Montserrat-Bold',
              margin: 15,
              color: colors.text,
              fontSize: 15,
              lineHeight: 15,
            }}
          >
            {translate('period')}
          </Text>

          <AStackFlex row justifyContent="center" flexWrap="wrap">
            {[1, 3, 6, 12].map((period) => (
              <TouchableOpacity
                key={period}
                onPress={() => {
                  selectFilter({ start, end, title });
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
                    <Text style={{ fontFamily: 'Montserrat-Bold', color: 'white' }}>
                      {`${period}M`}
                    </Text>
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </AStackFlex>
        </>
      ) : null} */}
      <View style={{ height: 200 }} />
    </ScrollView>
  ), [
    range,
    currencies,
    accounts,
    selectedAccountIds,
  ]);
}
