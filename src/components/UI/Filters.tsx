import React, { FC, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  CheckIcon,
  Select,
  Stack,
} from 'native-base';
import { FontAwesome } from '@expo/vector-icons';

import { RootDispatch, RootState } from '../../store';
import { translate } from '../../i18n/locale';
import { useThemeColors } from '../../lib/common';

const Filters: FC = () => {
  const { colors } = useThemeColors();
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
    <Stack
      py={1}
      alignItems="flex-end"
      justifyContent="center"
      backgroundColor={colors.tabBackgroundColor}
    >
      <Select
        my={2}
        height={35}
        backgroundColor={colors.brandNeutralLight}
        borderColor={colors.filterBorderColor}
        width={100}
        borderWidth={1}
        borderRadius={10}
        dropdownIcon={<FontAwesome name="angle-down" size={20} style={{ marginRight: 10 }} color={colors.text} />}
        _selectedItem={{
          bg: 'primary.600',
          borderRadius: 10,
          endIcon: <CheckIcon size={5} color="white" />,
          _text: {
            fontFamily: 'Montserrat',
            color: 'white',
          },
        }}
        _item={{
          borderRadius: 10,
          _text: {
            fontFamily: 'Montserrat',
            color: colors.text,
          },
        }}
        selectedValue={currentCurrency?.id}
        onValueChange={(v) => handleChangeCurrent(v)}
      >
        {currencies.map((currency) => <Select.Item key={currency.id} label={`${currency?.attributes.code} ${currency?.attributes.symbol}`} value={currency.id} />)}
      </Select>
      <Select
        my={2}
        height={35}
        width={120}
        backgroundColor={colors.brandNeutralLight}
        borderColor={colors.filterBorderColor}
        borderWidth={1}
        borderRadius={10}
        dropdownIcon={<FontAwesome name="angle-down" size={20} style={{ marginRight: 10 }} color={colors.text} />}
        _selectedItem={{
          bg: 'primary.600',
          borderRadius: 10,
          endIcon: <CheckIcon size={5} color="white" />,
          _text: {
            fontFamily: 'Montserrat',
            color: 'white',
          },
        }}
        _item={{
          borderRadius: 10,
          _text: {
            fontFamily: 'Montserrat',
            color: colors.text,
          },
        }}
        selectedValue={`${range}`}
        onValueChange={(v) => handleChangeRange({ range: v })}
      >
        <Select.Item key="1" label={translate('period_switcher_monthly')} value="1" />
        <Select.Item key="3" label={translate('period_switcher_quarterly')} value="3" />
        <Select.Item key="6" label={translate('period_switcher_semiannually')} value="6" />
        <Select.Item key="12" label={translate('period_switcher_yearly')} value="12" />
      </Select>
    </Stack>
  ), [
    currencies,
    currentCurrency,
    handleChangeCurrent,
    range,
    handleChangeRange,
  ]);
};

export default Filters;
