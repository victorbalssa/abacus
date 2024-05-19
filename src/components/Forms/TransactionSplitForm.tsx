import React, { useState } from 'react';
import moment from 'moment/moment';
import { Platform } from 'react-native';
import * as Haptics from 'expo-haptics';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useDispatch, useSelector } from 'react-redux';
import { getLocales } from 'expo-localization';

import translate from '../../i18n/locale';
import { useThemeColors } from '../../lib/common';
import AutocompleteField from './Fields/AutocompleteField';
import { RootDispatch, RootState } from '../../store';
import { TransactionSplitType, types } from '../../models/transactions';
import {
  AText,
  AInput,
  AIconButton,
  ALabel,
  AStack,
  AFormView,
  AButton, AStackFlex, APressable,
} from '../UI/ALibrary';
import ForeignCurrencyField from './Fields/ForeignCurrencyField';

export default function TransactionSplitForm({
  index,
  total,
  isNew,
  handleDelete,
  transaction,
}) {
  const [locale] = getLocales();
  const displayForeignCurrency = useSelector((state: RootState) => state.configuration.displayForeignCurrency);
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

  const colorItemTypes = {
    withdrawal: colors.red,
    deposit: colors.green,
    transfer: colors.blue,
    'opening balance': colors.blue,
  };

  const deleteBtn = (fields: string[]) => (
    <AIconButton
      icon={<AntDesign name="closecircle" size={19} color={colors.greyLight} />}
      onPress={() => resetTransaction(fields)}
    />
  );

  return (
    <AStack
      justifyContent="flex-start"
      alignItems="flex-start"
      backgroundColor={colors.tileBackgroundColor}
      py={10}
      my={5}
      style={{
        borderColor: colors.listBorderColor,
        borderWidth: 0.5,
        borderRadius: 10,
      }}
    >
      {index !== 0 && (
        <AStack style={{ width: '100%', paddingHorizontal: 10 }} justifyContent="space-between" row>
          <AText
            fontSize={15}
            color={colors.greyLight}
            textAlign="center"
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              width: 40,
              height: 40,
              paddingTop: 10,
              borderWidth: 0.5,
              borderRadius: 10,
              borderColor: colors.greyLight,
            }}
          >
            {index + 1}
            /
            {total}
          </AText>
          <AIconButton
            borderWidth={0.5}
            borderColor={colors.greyLight}
            icon={<Ionicons name="trash" size={20} color={colors.greyLight} />}
            onPress={handleDelete}
          />
        </AStack>
      )}
      {isNew && (
      <AFormView>
        <AStack style={{ width: '100%' }} row>
          {types.map(({ type, name }, i) => (
            <APressable
              key={type}
              onPress={() => {
                if (type !== formData.type) {
                  setTransaction({
                    ...formData,
                    type,
                  });
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch();
                }
              }}
              style={{
                width: 115,
                height: 40,
                borderTopLeftRadius: (i === 0) ? 10 : 0,
                borderBottomLeftRadius: (i === 0) ? 10 : 0,
                borderTopRightRadius: (i === 2) ? 10 : 0,
                borderBottomRightRadius: (i === 2) ? 10 : 0,
                justifyContent: 'center',
                backgroundColor: type !== formData.type ? colors.tileBackgroundColor : colorItemTypes[formData.type],
                borderWidth: 1,
                borderLeftWidth: (i === 1 || i === 2) ? 0 : 1,
                borderColor: colors.listBorderColor,
              }}
            >
              <AText fontSize={15} color={type === formData.type ? 'white' : colors.text} bold capitalize>{name}</AText>
            </APressable>
          ))}
        </AStack>
      </AFormView>
      )}

      <AFormView>
        <ALabel isRequired>
          {translate('transaction_form_amount_label')}
        </ALabel>
        <AInput
          bold
          height={90}
          returnKeyType="done"
          keyboardType="decimal-pad"
          placeholder="0.00"
          value={formData.amount}
          fontSize={35}
          onChangeText={(value) => setTransaction({
            ...formData,
            amount: value,
          })}
          InputRightElement={deleteBtn(['amount'])}
          InputLeftElement={(<AText px={10} fontSize={25} bold>{`${formData.currencySymbol}`}</AText>)}
        />
      </AFormView>

      {displayForeignCurrency && (
      <AFormView>
        <ALabel>
          {translate('transaction_form_foreign_amount_label')}
        </ALabel>
        <AInput
          height={30}
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
          InputLeftElement={(
            <ForeignCurrencyField
              placeholder={translate('transaction_form_foreign_currency_label')}
              value={formData.foreignCurrencyId}
              onSelect={(currencyId) => setTransaction({
                ...formData,
                foreignCurrencyId: currencyId,
              })}
            />
          )}
        />
      </AFormView>
      )}

      <AFormView>
        <ALabel isRequired>
          {translate('transaction_form_date_label')}
        </ALabel>
        <AStack row style={{ width: '100%', height: 40 }}>
          {showDatePicker && (
          <DateTimePicker
            accentColor={colors.brandDark}
            themeVariant={colorScheme}
            locale={locale.languageCode}
            mode={Platform.select({ android: 'date', ios: 'datetime' })}
            style={{ width: 250 }}
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
            style={{ width: 250, alignSelf: 'center' }}
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
          <AStack row>
            <AButton
              mx={10}
              px={10}
              onPress={() => setShowDatePicker(true)}
              style={{
                height: 40,
                borderWidth: 0.5,
                borderColor: colors.listBorderColor,
              }}
            >
              <AText fontSize={14}>{moment(formData.date).format('ll')}</AText>
            </AButton>
            <AButton
              mx={10}
              px={10}
              onPress={() => setShowTimePicker(true)}
              style={{
                height: 40,
                borderWidth: 0.5,
                borderColor: colors.listBorderColor,
              }}
            >
              <AText fontSize={14}>{moment(formData.date).format('hh:mm a')}</AText>
            </AButton>
          </AStack>
          )}
        </AStack>
      </AFormView>

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
          sourceId: autocomplete.id,
          currencyCode: autocomplete.currencyCode,
          currencySymbol: autocomplete.currencySymbol,
        })}
        InputRightElement={deleteBtn(['sourceName', 'currencyCode', 'currencySymbol'])}
        routeApi="accounts"
      />

      <AutocompleteField
        isRequired={['deposit', 'transfer'].includes(formData.type)}
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
          destinationId: autocomplete.id,
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
        onChangeText={(value: string) => setTransaction({
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
        label={translate('transaction_form_bill_label')}
        placeholder={translate('transaction_form_bill_label')}
        value={formData.billName}
        onChangeText={(value: string) => setTransaction({
          ...formData,
          billName: value,
        })}
        onSelectAutocomplete={(autocomplete) => setTransaction({
          ...formData,
          billId: autocomplete.id,
          billName: autocomplete.name,
        })}
        InputRightElement={deleteBtn(['billId', 'billName'])}
        routeApi="bills"
      />

      <AutocompleteField
        multiple
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

      <AFormView>
        <ALabel>
          {translate('transaction_form_notes_label')}
        </ALabel>
        <AInput
          height={60}
          numberOfLines={3}
          value={formData.notes}
          onChangeText={(value) => setTransaction({
            ...formData,
            notes: value,
          })}
          placeholder={translate('transaction_form_notes_label')}
          InputRightElement={deleteBtn(['notes'])}
        />
      </AFormView>

      <AButton
        style={{
          height: 40,
          marginTop: 15,
          marginHorizontal: 10,
          borderWidth: 0.5,
          borderColor: colors.listBorderColor,
        }}
        onPress={() => {
          setTransaction({
            date: new Date(),
            sourceName: '',
            sourceId: null,
            destinationName: '',
            destinationId: null,
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
            billId: '',
            billName: '',
          });
        }}
      >
        <AStackFlex row>
          <AntDesign name="closecircle" size={18} color={colors.greyLight} style={{ margin: 5 }} />
          <AText fontSize={15} color={colors.greyLight}>{translate('transaction_form_reset_button')}</AText>
        </AStackFlex>
      </AButton>
    </AStack>
  );
}
