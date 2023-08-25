import React, { useState } from 'react';
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
  label,
  placeholder,
  value,
  onChangeText = (item: string) => {},
  onSelectAutocomplete,
  InputRightElement,
  routeApi,
  error,
  onDeleteMultiple = (item: string) => {},
  isDestination = false,
  multiple = false,
  small = false,
}) {
  const { colors } = useThemeColors();
  const backendURL = useSelector((state: RootState) => state.configuration.backendURL);
  const [autocompletes, setAutocompletes] = useState([]);
  const [displayAutocomplete, setDisplayAutocomplete] = useState(false);
  const refreshAutocomplete = async (query) => {
    const limit = 10;
    const type = isDestination ? 'Expense%20account' : 'Revenue%20account';
    const types = routeApi === 'accounts' ? `&types=Asset%20account,${type},Loan,Debt,Mortgage` : '';
    const response = await axios.get(`${backendURL}/api/v1/autocomplete/${routeApi}?limit=${limit}${types}&query=${encodeURIComponent(query)}`);
    setAutocompletes(convertKeysToCamelCase(response.data));
  };

  const handleChangeText = (text) => {
    if (!multiple) {
      onChangeText(text);
    }
    refreshAutocomplete(text);
  };
  const handleSelectAutocomplete = (autocomplete) => {
    onSelectAutocomplete(autocomplete);
    setDisplayAutocomplete(false);
  };
  const handleFocus = () => {
    setDisplayAutocomplete(true);
    refreshAutocomplete(value && !small && !multiple ? value : '');
  };
  const handleBlur = () => {
    setDisplayAutocomplete(false);
  };

  return (
    <FormControl mt="1" isInvalid={isInvalid}>
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
            my={2}
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
                onPress={() => onDeleteMultiple(item)}
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
        onSubmitEditing={({ nativeEvent: { text } }) => (multiple ? handleSelectAutocomplete({ name: text }) : null)}
        placeholder={placeholder}
        value={!multiple ? value : ''}
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
      {error && <FormControl.ErrorMessage>{error}</FormControl.ErrorMessage>}
    </FormControl>
  );
}
