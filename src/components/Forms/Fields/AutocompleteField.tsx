import React, { useCallback, useMemo, useState } from 'react';
import { View } from 'react-native';
import {
  FormControl,
  HStack,
  Input,
  Pressable,
  Text,
  Badge,
  IconButton,
  ScrollView,
} from 'native-base';
import axios from 'axios';
import { useSelector } from 'react-redux';

import { AntDesign } from '@expo/vector-icons';
import { RootState } from '../../../store';
import { convertKeysToCamelCase, useThemeColors } from '../../../lib/common';

type AutocompleteType = {
  name: string,
  id: string,
}

export default function AutocompleteField({
  isInvalid = false,
  isRequired = false,
  label,
  placeholder,
  value,
  onChangeText = null,
  onSelectAutocomplete,
  InputRightElement,
  routeApi,
  error = null,
  onDeleteMultiple = null,
  isDestination = false,
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
    const type = isDestination ? 'Expense%20account' : 'Revenue%20account';
    const types = routeApi === 'accounts' ? `&types=Asset%20account,${type},Loan,Debt,Mortgage` : '';
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
      <FormControl mt="1" isRequired={isRequired} isInvalid={isInvalid}>
        {!small && (
        <FormControl.Label>
          {label}
        </FormControl.Label>
        )}
        {multiple && (
        <ScrollView horizontal>
          {value.map((item, index) => (
            <Badge
              mr={1}
              mb={2}
              py={1}
              borderRadius={10}
              key={`${index + 1}${item}`}
              rightIcon={(
                <IconButton
                  mr={0}
                  h={1}
                  w={1}
                  variant="ghost"
                  colorScheme="gray"
                  _icon={{
                    as: AntDesign,
                    name: 'closecircle',
                    size: 19,
                  }}
                  onPress={() => handleDeleteMultiple(item)}
                />
                  )}
            >
              {item}
            </Badge>
          ))}
        </ScrollView>
        )}
        <Input
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
                  <Text maxW="90%" numberOfLines={1} underline>
                    {autocomplete.name || '-'}
                  </Text>
                </HStack>
              </Pressable>
            ))}
          </View>
        )}
        {error && <FormControl.ErrorMessage>{error}</FormControl.ErrorMessage>}
      </FormControl>
    ),
    [
      isInvalid,
      isRequired,
      label,
      placeholder,
      multiple,
      value,
      error,
      isDestination,
      small,
      multipleValue,
      autocompletes,
      displayAutocomplete,
    ],
  );
}
