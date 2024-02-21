import React, { useState } from 'react';
import moment from 'moment/moment';
import { Platform } from 'react-native';
import {
  Button,
  FormControl,
  HStack,
  IconButton,
  Input,
  Text,
  TextArea,
  VStack,
} from 'native-base';
import * as Haptics from 'expo-haptics';
import { AntDesign } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useDispatch } from 'react-redux';
import { getLocales } from 'expo-localization';

import translate from '../../i18n/locale';
import { useThemeColors } from '../../lib/common';
import AutocompleteField from './Fields/AutocompleteField';
import { RootDispatch } from '../../store';
import { TransactionSplitType } from '../../models/transactions';

export default function TransactionSplitForm({
  index,
  total,
  isNew,
  handleDelete,
  transaction,
}) {
  const [locale] = getLocales();
  const dispatch = useDispatch<RootDispatch>();
  const { colorScheme, colors } = useThemeColors();
  const [formData, setData] = useState<TransactionSplitType>({
    ...transaction,
    date: new Date(transaction.date),
    amount: transaction.amount ? parseFloat(transaction.amount).toFixed(2) : '',
    foreignAmount: transaction.foreignAmount ? parseFloat(transaction.foreignAmount).toFixed(2) : '',
  });
  const [showDatePicker, setShowDatePicker] = useState(Platform.OS === 'ios');
  const [showTimePicker, setShowTimePicker] = useState(false);

  const setTransaction = (data: TransactionSplitType) => {
    setData(data);
    dispatch.transactions.setTransactionSplitByIndex(index, data);
  };

  const resetTransaction = (fields: string[]) => {
    setData((split: TransactionSplitType) => {
      const newSplit = {
        ...split,
        ...fields.reduce((acc, curr) => {
          acc[curr] = '';
          return acc;
        }, {}),
      };
      dispatch.transactions.setTransactionSplitByIndex(index, newSplit);
      return newSplit;
    });
  };

  const resetTagTransaction = (item: string) => {
    setData((split: TransactionSplitType) => {
      const newSplit = {
        ...split,
        tags: split.tags.filter((tag) => tag !== item),
      };
      dispatch.transactions.setTransactionSplitByIndex(index, newSplit);
      return newSplit;
    });
  };

  const types = [
    {
      type: 'withdrawal',
      name: translate('transaction_form_type_withdraw'),
    },
    {
      type: 'deposit',
      name: translate('transaction_form_type_deposit'),
    },
    {
      type: 'transfer',
      name: translate('transaction_form_type_transfer'),
    },
  ];

  const colorItemTypes = {
    withdrawal: colors.red,
    deposit: colors.green,
    transfer: colors.blue,
    'opening balance': colors.blue,
  };

  const deleteBtn = (fields: string[]) => (
    <IconButton
      mr={0}
      h={8}
      w={8}
      variant="ghost"
      colorScheme="gray"
      _icon={{
        as: AntDesign,
        name: 'closecircle',
        size: 19,
        color: 'gray.500',
      }}
      onPress={() => resetTransaction(fields)}
    />
  );

  return (
    <VStack
      p={3}
      my={2}
      borderWidth={0.5}
      bgColor={colors.tileBackgroundColor}
      borderColor={colors.listBorderColor}
      borderRadius={10}
    >
      {index !== 0 && (
        <HStack justifyContent="space-between">
          <Text
            textAlign="center"
            justifyContent="center"
            width={10}
            height={10}
            pt={2}
            borderWidth={1}
            borderRadius={10}
            borderColor={colors.warmGray200}
            color={colors.warmGray200}
          >
            {index + 1}
            /
            {total}
          </Text>
          <IconButton
            variant="outline"
            colorScheme="gray"
            _icon={{
              as: AntDesign,
              name: 'delete',
              size: 22,
            }}
            onPress={handleDelete}
          />
        </HStack>
      )}
      {isNew && (
      <FormControl isRequired>
        <HStack justifyContent="center">
          <Button.Group isAttached borderRadius={10}>
            {types.map(({ type, name }) => (
              <Button
                onPress={() => {
                  if (type !== formData.type) {
                    setTransaction({
                      ...formData,
                      type,
                    });
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  }
                }}
                _text={{
                  color: type !== formData.type ? colors.text : colors.textOpposite,
                  fontFamily: 'Montserrat_Bold',
                  textTransform: 'capitalize',
                }}
                _disabled={{
                  opacity: 1,
                }}
                isDisabled={type === formData.type}
                backgroundColor={type !== formData.type ? colors.tileBackgroundColor : colorItemTypes[formData.type]}
                key={type}
                borderWidth={0.5}
                borderColor={colors.listBorderColor}
              >
                {name}
              </Button>
            ))}
          </Button.Group>
        </HStack>
      </FormControl>
      )}

      <FormControl mt="1" isRequired>
        <FormControl.Label>
          {translate('transaction_form_amount_label')}
        </FormControl.Label>
        <Input
          height={60}
          variant="outline"
          returnKeyType="done"
          keyboardType="decimal-pad"
          placeholder="0.00"
          value={formData.amount}
          textAlign="center"
          fontSize={30}
          onChangeText={(value) => setTransaction({
            ...formData,
            amount: value,
          })}
          InputRightElement={deleteBtn(['amount'])}
          InputLeftElement={(<Text pl={3} fontSize={12}>{`${formData.currencyCode} ${formData.currencySymbol}`}</Text>)}
        />
      </FormControl>

      <FormControl mt="1">
        <FormControl.Label>
          {translate('transaction_form_foreign_amount_label')}
        </FormControl.Label>
        <AutocompleteField
          label=""
          small
          placeholder={translate('transaction_form_foreign_currency_label')}
          value={formData.foreignCurrencyCode}
          onSelectAutocomplete={(autocomplete: { id: string, code: string }) => setTransaction({
            ...formData,
            foreignCurrencyId: autocomplete.id,
            foreignCurrencyCode: autocomplete.code,
          })}
          InputRightElement={null}
          routeApi="currencies-with-code"
        />
        <FormControl.Label />
        <Input
          variant="outline"
          returnKeyType="done"
          keyboardType="decimal-pad"
          placeholder="0.00"
          value={formData.foreignAmount}
          textAlign="center"
          fontSize={20}
          onChangeText={(value) => setTransaction({
            ...formData,
            foreignAmount: value,
          })}
          InputRightElement={deleteBtn(['foreignAmount', 'foreignCurrencyId', 'foreignCurrencyCode'])}
        />
        {(formData.foreignCurrencyId && formData.foreignAmount === '') && <FormControl.ErrorMessage>{translate('transaction_form_foreign_amount_error')}</FormControl.ErrorMessage>}
      </FormControl>

      <FormControl mt="1" isRequired>
        <FormControl.Label>
          {translate('transaction_form_date_label')}
        </FormControl.Label>
        {showDatePicker && (
          <DateTimePicker
            accentColor={colors.brandDark}
            themeVariant={colorScheme}
            locale={locale.languageCode}
            mode={Platform.select({ android: 'date', ios: 'datetime' })}
            style={{ width: 235, alignSelf: 'center' }}
            value={(formData.date instanceof Date) ? formData.date : new Date(formData.date)}
            onChange={(event, value) => {
              setShowDatePicker(Platform.OS === 'ios');
              setTransaction({
                ...formData,
                date: value,
              });
            }}
          />
        )}
        {showTimePicker && Platform.OS === 'android' && (
          <DateTimePicker
            accentColor={colors.brandDark}
            themeVariant={colorScheme}
            mode="time"
            style={{ width: 235, alignSelf: 'center' }}
            value={(formData.date instanceof Date) ? formData.date : new Date(formData.date)}
            onChange={(event, value) => {
              setShowTimePicker(false);
              setTransaction({
                ...formData,
                date: value,
              });
            }}
          />
        )}
        {Platform.OS === 'android' && (
          <HStack justifyContent="center">
            <Button
              mx={2}
              variant="outline"
              onPress={() => setShowDatePicker(true)}
            >
              <Text>{moment(formData.date).format('ll')}</Text>
            </Button>
            <Button
              mx={2}
              variant="outline"
              onPress={() => setShowTimePicker(true)}
            >
              <Text>{moment(formData.date).format('hh:mm a')}</Text>
            </Button>
          </HStack>
        )}
      </FormControl>

      <AutocompleteField
        isRequired
        label={translate('transaction_form_description_label')}
        placeholder={translate('transaction_form_description_label')}
        value={formData.description}
        onChangeText={(value) => {
          setTransaction({
            ...formData,
            description: value,
          });
        }}
        onSelectAutocomplete={(autocomplete) => setTransaction({
          ...formData,
          description: autocomplete.name,
        })}
        InputRightElement={deleteBtn(['description'])}
        routeApi="transactions"
      />

      <AutocompleteField
        isRequired={['withdrawal', 'transfer'].includes(formData.type)}
        label={translate('transaction_form_sourceAccount_label')}
        placeholder={translate('transaction_form_sourceAccount_label')}
        value={formData.sourceName}
        splitType={formData.type}
        onChangeText={(value: string) => setTransaction({
          ...formData,
          sourceName: value,
        })}
        onSelectAutocomplete={(autocomplete) => setTransaction({
          ...formData,
          sourceName: autocomplete.name,
          currencyCode: autocomplete.currencyCode,
          currencySymbol: autocomplete.currencySymbol,
        })}
        InputRightElement={deleteBtn(['sourceName', 'currencyCode', 'currencySymbol'])}
        routeApi="accounts"
      />

      <AutocompleteField
        isRequired={'deposit' === formData.type || 'transfer' === formData.type }
        label={translate('transaction_form_destinationAccount_label')}
        placeholder={translate('transaction_form_destinationAccount_label')}
        value={formData.destinationName}
        splitType={formData.type}
        designation="destination"
        onChangeText={(value) => setTransaction({
          ...formData,
          destinationName: value,
        })}
        onSelectAutocomplete={(autocomplete) => setTransaction({
          ...formData,
          destinationName: autocomplete.name,
        })}
        InputRightElement={deleteBtn(['destinationName'])}
        routeApi="accounts"
      />

      <AutocompleteField
        label={translate('transaction_form_category_label')}
        placeholder={translate('transaction_form_category_label')}
        value={formData.categoryName}
        onChangeText={(value) => setTransaction({
          ...formData,
          categoryName: value,
        })}
        onSelectAutocomplete={(autocomplete) => setTransaction({
          ...formData,
          categoryId: autocomplete.id,
          categoryName: autocomplete.name,
        })}
        InputRightElement={deleteBtn(['categoryId', 'categoryName'])}
        routeApi="categories"
      />

      <AutocompleteField
        label={translate('transaction_form_budget_label')}
        placeholder={translate('transaction_form_budget_label')}
        value={formData.budgetName}
        onChangeText={(value) => setTransaction({
          ...formData,
          budgetName: value,
        })}
        onSelectAutocomplete={(autocomplete) => setTransaction({
          ...formData,
          budgetId: autocomplete.id,
          budgetName: autocomplete.name,
        })}
        InputRightElement={deleteBtn(['budgetId', 'budgetName'])}
        routeApi="budgets"
      />

      <AutocompleteField
        multiple
        InputRightElement={null}
        label={translate('transaction_form_tags_label')}
        placeholder={translate('transaction_form_tags_label')}
        value={formData.tags}
        onChangeText={() => {}}
        onDeleteMultiple={resetTagTransaction}
        onSelectAutocomplete={(autocomplete) => setTransaction({
          ...formData,
          tags: Array.from(new Set([...formData.tags, autocomplete.name])),
        })}
        routeApi="tags"
      />

      <FormControl mt="1">
        <FormControl.Label>
          {translate('transaction_form_notes_label')}
        </FormControl.Label>
        <TextArea
          h={20}
          autoCompleteType
          value={formData.notes}
          onChangeText={(value) => setTransaction({
            ...formData,
            notes: value,
          })}
          placeholder={translate('transaction_form_notes_label')}
          InputRightElement={deleteBtn(['notes'])}
        />
      </FormControl>

      <Button
        mt="3"
        variant="outline"
        colorScheme="gray"
        onPress={() => {
          setTransaction({
            date: new Date(),
            sourceName: '',
            destinationName: '',
            description: '',
            amount: '',
            type: 'withdrawal',
            budgetId: '',
            budgetName: '',
            tags: [],
            categoryId: '',
            categoryName: '',
            foreignAmount: '',
            foreignCurrencyId: '',
            notes: '',
            currencySymbol: '',
            currencyCode: '',
          });
        }}
      >
        {translate('transaction_form_reset_button')}
      </Button>
    </VStack>
  );
}
