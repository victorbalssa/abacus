import React, { useCallback, useMemo, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';

import { AntDesign, EvilIcons } from '@expo/vector-icons';
import { RootState } from '../../../store';
import { convertKeysToCamelCase, useThemeColors } from '../../../lib/common';
import {
  AInput,
  APressable,
  AStack,
  AText,
  AView,
  ALabel,
  AFormView, AIconButton,
} from '../../UI/ALibrary';

type AutocompleteType = {
  name: string,
  id: string,
}

export default function AutocompleteField({
  splitType = 'withdrawal',
  designation = 'source',
  isRequired = false,
  label,
  placeholder,
  value,
  onChangeText = null,
  onSelectAutocomplete,
  InputRightElement = null,
  routeApi,
  onDeleteMultiple = null,
  multiple = false,
  small = false,
}) {
  const { colors } = useThemeColors();
  const backendURL = useSelector((state: RootState) => state.configuration.backendURL);
  const [multipleValue, setMultipleValue] = useState('');
  const [autocompletes, setAutocompletes] = useState([]);
  const [displayAutocomplete, setDisplayAutocomplete] = useState(false);
  const refreshAutocomplete = async (query) => {
    const limit = 10;
    const accountTypeFilter = {
      'source-withdrawal': 'Asset%20account',
      'destination-withdrawal': 'Expense%20account',
      'source-deposit': 'Revenue%20account',
      'destination-deposit': 'Asset%20account',
      'source-transfer': 'Asset%20account',
      'destination-transfer': 'Asset%20account',
    };
    const types = routeApi === 'accounts' ? `&types=${accountTypeFilter[`${designation}-${splitType}`]},Loan,Debt,Mortgage` : '';
    const response = await axios.get(`${backendURL}/api/v1/autocomplete/${routeApi}?limit=${limit}${types}&query=${encodeURIComponent(query)}`);
    setAutocompletes(convertKeysToCamelCase(response.data));
  };

  const handleChangeText = useCallback((text: string) => {
    if (multiple) {
      setMultipleValue(text);
    } else if (onChangeText !== null) {
      onChangeText(text);
    }
    refreshAutocomplete(text);
  }, [multiple, onChangeText]);

  const handleSelectAutocomplete = useCallback((autocomplete) => {
    onSelectAutocomplete(autocomplete);
    setDisplayAutocomplete(false);
    if (multiple) {
      setMultipleValue('');
    }
  }, [onSelectAutocomplete]);

  const handleDeleteMultiple = useCallback((item) => {
    onDeleteMultiple(item);
  }, [onDeleteMultiple]);

  const handleFocus = () => {
    setDisplayAutocomplete(true);
    refreshAutocomplete(value && !small && !multiple ? value : '');
  };
  const handleBlur = () => {
    setDisplayAutocomplete(false);
  };

  return useMemo(
    () => (
      <AFormView>
        {!small && (
          <ALabel isRequired={isRequired}>
            {label}
          </ALabel>
        )}

        {multiple && (value.map((item: string, index: number) => (
          <AView key={`${index + 1}${item}`} style={{ width: '100%' }}>
            <AView
              style={{
                height: 30,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'flex-start',
                borderRadius: 10,
                paddingHorizontal: 0,
                marginBottom: 5,
                backgroundColor: colors.brandNeutralFix,
              }}
            >
              <EvilIcons name="tag" size={24} color={colors.brandDark} />
              <AText px={5} fontSize={15} lineHeight={20} color={colors.brandDark} numberOfLines={1} maxWidth={200} bold>{item}</AText>
              <AIconButton
                icon={<AntDesign name="closecircle" size={19} color={colors.greyLight} />}
                onPress={() => handleDeleteMultiple(item)}
              />
            </AView>
          </AView>
        )))}

        <AInput
          height={40}
          returnKeyType="done"
          onSubmitEditing={({ nativeEvent: { text } }) => ((multiple && text !== '') ? handleSelectAutocomplete({ name: text }) : null)}
          placeholder={placeholder}
          value={!multiple ? value : multipleValue}
          onChangeText={handleChangeText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          InputRightElement={InputRightElement}
        />

        {displayAutocomplete && (
          <AView style={{ maxWidth: '100%' }}>
            {autocompletes.map((autocomplete: AutocompleteType) => (
              <APressable
                style={{ borderRadius: 10, paddingLeft: 5 }}
                key={autocomplete.id}
                onPress={() => handleSelectAutocomplete(autocomplete)}
              >
                <AStack
                  justifyContent="space-between"
                  mx={5}
                  my={5}
                >
                  <AText fontSize={15} numberOfLines={1} underline>
                    {autocomplete.name || '-'}
                  </AText>
                </AStack>
              </APressable>
            ))}
          </AView>
        )}
      </AFormView>
    ),
    [
      isRequired,
      label,
      placeholder,
      multiple,
      value,
      designation,
      small,
      splitType,
      multipleValue,
      autocompletes,
      displayAutocomplete,
    ],
  );
}
