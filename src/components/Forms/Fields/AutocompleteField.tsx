import React, { useState } from 'react';
import { View } from 'react-native';
import {
  FormControl,
  HStack,
  Input,
  Pressable,
  Text,
} from 'native-base';

import axios from 'axios';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { useThemeColors } from '../../../lib/common';

export type AutocompleteType = {
  name: string,
  id: string,
}

const AutocompleteField = ({
  isInvalid = false,
  label,
  placeholder,
  value,
  onChangeText,
  onSelectAutocomplete,
  InputRightElement,
  routeApi,
  isDestination = false,
  error,
}) => {
  const { colors } = useThemeColors();
  const backendURL = useSelector((state: RootState) => state.configuration.backendURL);
  const [autocompletes, setAutocompletes] = useState([]);
  const [displayAutocomplete, setDisplayAutocomplete] = useState(false);
  const getAutocompleteBudgets = async (query) => {
    const limit = 10;
    const type = isDestination ? 'Expense%20account' : 'Revenue%20account';
    const types = routeApi === 'accounts' ? `&types=Asset%20account,${type},Loan,Debt,Mortgage` : '';
    const response = await axios.get(`${backendURL}/api/v1/autocomplete/${routeApi}?limit=${limit}${types}&query=${encodeURIComponent(query)}`);
    setAutocompletes(response.data);
  };

  const handleChangeText = (text) => {
    onChangeText(text);
    getAutocompleteBudgets(text);
  };
  const handleSelectAutocomplete = (autocomplete) => {
    onSelectAutocomplete(autocomplete);
    setDisplayAutocomplete(false);
  };
  const handleFocus = () => {
    setDisplayAutocomplete(true);
    getAutocompleteBudgets(value || '');
  };
  const handleBlur = () => {
    setDisplayAutocomplete(false);
  };

  return (
    <FormControl mt="1" isInvalid={isInvalid}>
      <FormControl.Label>
        {label}
      </FormControl.Label>
      <Input
        returnKeyType="done"
        placeholder={placeholder}
        value={value}
        onChangeText={handleChangeText}
        onFocus={handleFocus}
        onBlur={handleBlur}
        InputRightElement={InputRightElement}
      />

      {displayAutocomplete && (
        <View>
          {autocompletes.map((autocomplete: AutocompleteType) => (
            <Pressable
              key={autocomplete.id}
              mx={2}
              onPress={() => handleSelectAutocomplete(autocomplete)}
              _pressed={{
                borderRadius: 10,
                backgroundColor: colors.tileBackgroundColor,
              }}
            >
              <HStack
                justifyContent="space-between"
                mx={2}
                my={2}
              >
                <Text underline>
                  {autocomplete.name || '-'}
                </Text>
              </HStack>
            </Pressable>
          ))}
        </View>
      )}
      {error ? <FormControl.ErrorMessage>{error}</FormControl.ErrorMessage> : <></>}
    </FormControl>
  );
};

export default AutocompleteField;
