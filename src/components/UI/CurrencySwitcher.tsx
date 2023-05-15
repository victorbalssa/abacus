import React, { FC, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  CheckIcon,
  HStack,
  Select,
} from 'native-base';

import { RootDispatch, RootState } from '../../store';
import { translate } from '../../i18n/locale';
import colors from '../../constants/colors';

const CurrencySwitcher: FC = () => {
  const currencies = useSelector((state: RootState) => state.currencies.currencies);
  const currentCurrency = useSelector((state: RootState) => state.currencies.current);
  const { range } = useSelector((state: RootState) => state.firefly);
  const {
    firefly: {
      handleChangeRange,
    },
    currencies: {
      changeCurrent,
    },
  } = useDispatch<RootDispatch>();

  return useMemo(() => (
    <HStack
      py={1}
      justifyContent="center"
      alignItems="center"
      bgColor={colors.warmGray200}
      borderBottomWidth={0.5}
      borderColor="gray.200"
    >
      <Select
        ml={8}
        mr={1}
        borderWidth={0}
        borderRadius={5}
        width={90}
        height={7}
        dropdownIcon={<></>}
        _selectedItem={{
          bg: 'primary.600',
          borderRadius: 15,
          endIcon: <CheckIcon size={5} color="white" />,
          _text: {
            fontFamily: 'Montserrat_Bold',
            color: 'white',
          },
        }}
        _item={{
          borderRadius: 15,
          _text: {
            fontFamily: 'Montserrat_Bold',
            color: 'gray.600',
          },
        }}
        color="white"
        bgColor="primary.500"
        fontFamily="Montserrat_Bold"
        fontSize={12}
        selectedValue={currentCurrency?.id}
        onValueChange={(v) => changeCurrent(v)}
      >
        {currencies.map((c) => <Select.Item key={c.id} label={`${c.attributes.code} ${c.attributes.symbol}`} value={c.id} />)}
      </Select>
      <HStack flex={1} justifyContent="space-between" alignItems="space-between">
        <Select
          borderWidth={0}
          borderRadius={5}
          width={90}
          height={7}
          dropdownIcon={<></>}
          _selectedItem={{
            bg: 'primary.600',
            borderRadius: 15,
            endIcon: <CheckIcon size={5} color="white" />,
            _text: {
              fontFamily: 'Montserrat_Bold',
              color: 'white',
            },
          }}
          _item={{
            borderRadius: 15,
            _text: {
              fontFamily: 'Montserrat_Bold',
              color: 'gray.600',
            },
          }}
          color="white"
          bgColor="primary.500"
          fontFamily="Montserrat_Bold"
          fontSize={12}
          selectedValue={`${range}`}
          onValueChange={(v) => handleChangeRange({ range: v })}
        >
          <Select.Item key="1" label={translate('period_switcher_monthly')} value="1" />
          <Select.Item key="3" label={translate('period_switcher_quarterly')} value="3" />
          <Select.Item key="6" label={translate('period_switcher_semiannually')} value="6" />
          <Select.Item key="12" label={translate('period_switcher_yearly')} value="12" />
        </Select>
      </HStack>
    </HStack>
  ), [
    currencies,
    currentCurrency,
    changeCurrent,
    range,
    handleChangeRange,
  ]);
};

export default CurrencySwitcher;
