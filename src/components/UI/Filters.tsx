import React, { FC, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  HStack,
  Text,
} from 'native-base';

import { View } from 'react-native';
import { HoldItem } from 'react-native-hold-menu';
import { FontAwesome } from '@expo/vector-icons';
import { RootDispatch, RootState } from '../../store';
import { translate } from '../../i18n/locale';
import { useThemeColors } from '../../lib/common';

const Filters: FC = () => {
  const { colors } = useThemeColors();
  const currencies = useSelector((state: RootState) => state.currencies.currencies);
  const currentCurrency = useSelector((state: RootState) => state.currencies.current);
  const range = useSelector((state: RootState) => state.firefly.range);
  const {
    firefly: {
      handleChangeRange,
    },
    currencies: {
      changeCurrent,
    },
  } = useDispatch<RootDispatch>();

  const currenciesItems = currencies.map((currency) => ({ text: `${currency.attributes.code} ${currency.attributes.symbol}`, icon: 'edit', onPress: () => changeCurrent(currency.id) }));
  const periodsItems = [
    { text: translate('period_switcher_monthly'), onPress: () => handleChangeRange({ range: 1 }) },
    { text: translate('period_switcher_quarterly'), onPress: () => handleChangeRange({ range: 3 }) },
    { text: translate('period_switcher_semiannually'), onPress: () => handleChangeRange({ range: 6 }) },
    { text: translate('period_switcher_yearly'), onPress: () => handleChangeRange({ range: 12 }) },
  ];
  const periodsConfig = {
    1: translate('period_switcher_monthly'),
    3: translate('period_switcher_quarterly'),
    6: translate('period_switcher_semiannually'),
    12: translate('period_switcher_yearly'),
  };
  return useMemo(() => (
    <HStack
      py={1}
      mx={3}
      alignItems="center"
      justifyContent="center"
      backgroundColor={colors.tabBackgroundColor}
    >
      <HoldItem
        activateOn="tap"
        hapticFeedback="None"
        items={currenciesItems}
      >
        <View style={{
          flexDirection: 'row',
          borderRadius: 15,
          borderWidth: 1,
          borderColor: colors.filterBorderColor,
          height: 25,
          paddingHorizontal: 10,
          marginHorizontal: 2,
          backgroundColor: colors.brandNeutralLight,
          justifyContent: 'center',
          alignItems: 'center',
        }}
        >
          <Text>
            {currentCurrency?.attributes.name}
          </Text>
          <FontAwesome name="angle-down" size={20} style={{ marginLeft: 3 }} color={colors.text} />
        </View>
      </HoldItem>
      <HoldItem
        activateOn="tap"
        hapticFeedback="None"
        items={periodsItems}
      >
        <View style={{
          flexDirection: 'row',
          borderRadius: 15,
          borderWidth: 1,
          borderColor: colors.filterBorderColor,
          height: 25,
          paddingHorizontal: 10,
          marginHorizontal: 2,
          backgroundColor: colors.brandNeutralLight,
          justifyContent: 'center',
          alignItems: 'center',
        }}
        >
          <Text>
            {`${periodsConfig[range]}`}
          </Text>
          <FontAwesome name="angle-down" size={20} style={{ marginLeft: 3 }} color={colors.text} />
        </View>
      </HoldItem>
    </HStack>
  ), [
    currencies,
    currentCurrency,
    changeCurrent,
    range,
    handleChangeRange,
  ]);
};

export default Filters;
