import React, { useCallback, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';

import { RootState } from '../../../store';
import {
  APressable,
  AStack,
  AText,
  AView,
} from '../../UI/ALibrary';
import { CurrencyType } from '../../../models/currencies';

type ForeignCurrencyFieldProps = {
  placeholder?: string,
  value?: string,
  onSelect: (currencyId: string) => void,
}

export default function ForeignCurrencyField({
  placeholder,
  value,
  onSelect,
}: ForeignCurrencyFieldProps) {
  const currencies = useSelector((state: RootState) => state.currencies.currencies);
  const [displayAutocomplete, setDisplayAutocomplete] = useState(false);

  const handleSelectAutocomplete = useCallback((currencyId: string) => {
    onSelect(currencyId);
    setDisplayAutocomplete(false);
  }, [onSelect]);

  const handleFocus = () => {
    setDisplayAutocomplete(true);
  };

  return useMemo(
    () => (
      <AStack py={10} px={10}>
        {!displayAutocomplete && (
        <AText fontSize={14} onPress={handleFocus} numberOfLines={1}>
          {currencies[currencies.findIndex((s) => s.id === value)]?.attributes.code || placeholder}
        </AText>
        )}

        {displayAutocomplete && (
          <AView>
            {currencies.map((currency: CurrencyType) => (
              <APressable
                style={{ borderRadius: 10 }}
                key={currency.id}
                onPress={() => handleSelectAutocomplete(currency.id)}
              >
                <AStack
                  justifyContent="space-between"
                  my={5}
                >
                  <AText fontSize={14} numberOfLines={1} underline>
                    {currency.attributes.code || '-'}
                  </AText>
                </AStack>
              </APressable>
            ))}
          </AView>
        )}
      </AStack>
    ),
    [
      value,
      placeholder,
      displayAutocomplete,
    ],
  );
}
