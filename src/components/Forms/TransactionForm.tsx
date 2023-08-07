import React, { useState } from 'react';
import {
  Keyboard,
  Platform,
} from 'react-native';
import {
  Button,
  FormControl,
  HStack,
  IconButton,
  Input,
  Text,
  VStack,
} from 'native-base';
import * as Haptics from 'expo-haptics';
import { AntDesign } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment/moment';
import { useSelector } from 'react-redux';

import ToastAlert from '../UI/ToastAlert';
import translate from '../../i18n/locale';
import { useThemeColors } from '../../lib/common';
import AutocompleteField from './Fields/AutocompleteField';
import { RootState } from '../../store';

type ErrorStateType = {
  description: string
  sourceName: string
  destinationName: string
  amount: string
  categoryId: string
  budgetId: string
  global: string
}

const INITIAL_ERROR = {
  description: '',
  amount: '',
  sourceName: '',
  destinationName: '',
  categoryId: '',
  budgetId: '',
  global: '',
} as ErrorStateType;

export default function TransactionForm({
  submit,
  goToTransactions,
  payload,
}) {
  const { colorScheme, colors } = useThemeColors();
  const { loading } = useSelector((state: RootState) => state.loading.models.transactions);
  const [formData, setData] = useState({
    description: payload.description,
    date: new Date(payload.date),
    sourceName: payload.sourceName,
    destinationName: payload.destinationName,
    amount: payload.amount ? parseFloat(payload.amount).toFixed(2) : '',
    categoryId: payload.categoryId,
    categoryName: payload.categoryName,
    budgetId: payload.budgetId,
    budgetName: payload.budgetName,
    type: payload.type,
  });
  const [errors, setErrors] = useState(INITIAL_ERROR);
  const [success, setSuccess] = useState(false);
  const [showDateTimePicker, setShowDateTimePicker] = useState(Platform.OS === 'ios');
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

  const resetErrors = () => setErrors(INITIAL_ERROR);

  const validate = () => {
    if (formData.description === undefined) {
      setErrors({
        ...errors,
        description: translate('transaction_form_description_required'),
      });
      return false;
    }
    if (formData.description.length < 1) {
      setErrors({
        ...errors,
        description: translate('transaction_form_description_short'),
      });
      return false;
    }
    if (formData.amount === undefined || parseFloat(formData.amount) <= 0) {
      setErrors({
        ...errors,
        amount: translate('transaction_form_amount_required'),
      });
      return false;
    }

    return true;
  };

  const onSubmit = async () => {
    Keyboard.dismiss();
    if (validate()) {
      try {
        resetErrors();
        await submit(formData);
        setSuccess(true);
      } catch (e) {
        setSuccess(false);
        if (e.response) {
          setErrors({
            ...INITIAL_ERROR,
            global: e.response.data.message,
          });
        }
      }
    }
  };

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
      onPress={() => setData({
        ...formData,
        ...fields.reduce((acc, curr) => {
          acc[curr] = '';
          return acc;
        }, {}),
      })}
    />
  );

  return (
    <VStack mx="3" my={3} pb={240}>
      <FormControl isRequired>
        <HStack justifyContent="center">
          <Button.Group isAttached borderRadius={10}>
            {types.map(({ type, name }) => (
              <Button
                onPress={() => setData({
                  ...formData,
                  type,
                })}
                _text={{
                  color: type !== formData.type ? colors.text : colors.textOpposite,
                  fontFamily: 'Montserrat_Bold',
                  textTransform: 'capitalize',
                }}
                _disabled={{
                  opacity: 1,
                }}
                onTouchEnd={() => (type !== formData.type) && Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
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

      <FormControl mt="1" isRequired isInvalid={errors.amount !== ''}>
        <FormControl.Label>
          {translate('transaction_form_amount_label')}
        </FormControl.Label>
        <Input
          height={75}
          variant="underlined"
          returnKeyType="done"
          keyboardType="numbers-and-punctuation"
          placeholder="0.00"
          value={formData.amount}
          textAlign="center"
          fontSize={40}
          onChangeText={(value) => setData({
            ...formData,
            amount: value,
          })}
          InputRightElement={deleteBtn(['amount'])}
        />
        {'amount' in errors && <FormControl.ErrorMessage>{errors.amount}</FormControl.ErrorMessage>}
      </FormControl>

      <FormControl mt="1" isRequired>
        <FormControl.Label>
          {translate('transaction_form_date_label')}
        </FormControl.Label>
        {showDateTimePicker && (
          <DateTimePicker
            accentColor={colors.brandDark}
            themeVariant={colorScheme}
            mode="date"
            style={{ width: 130 }}
            value={formData.date}
            onChange={(event, value) => {
              setShowDateTimePicker(Platform.OS === 'ios');
              setData({
                ...formData,
                date: value,
              });
            }}
          />
        )}
        {Platform.OS === 'android' && (
          <Button
            height={10}
            variant="outline"
            onPress={() => setShowDateTimePicker(true)}
          >
            <Text>{moment(formData.date).format('ll')}</Text>
          </Button>
        )}
      </FormControl>

      <AutocompleteField
        label={translate('transaction_form_description_label')}
        placeholder={translate('transaction_form_description_label')}
        value={formData.description}
        isInvalid={errors.description !== ''}
        onChangeText={(value) => {
          setData({
            ...formData,
            description: value,
          });
        }}
        onSelectAutocomplete={(autocomplete) => setData({
          ...formData,
          description: autocomplete.name,
        })}
        InputRightElement={deleteBtn(['description'])}
        routeApi="transactions"
        error={errors.description}
      />

      <AutocompleteField
        label={translate('transaction_form_sourceAccount_label')}
        placeholder={translate('transaction_form_sourceAccount_label')}
        value={formData.sourceName}
        isInvalid={errors.sourceName !== ''}
        onChangeText={(value) => {
          setData({
            ...formData,
            sourceName: value,
          });
        }}
        onSelectAutocomplete={(autocomplete) => setData({
          ...formData,
          sourceName: autocomplete.name,
        })}
        InputRightElement={deleteBtn(['sourceName'])}
        routeApi="accounts"
        error={errors.sourceName}
      />

      <AutocompleteField
        label={translate('transaction_form_destinationAccount_label')}
        placeholder={translate('transaction_form_destinationAccount_label')}
        value={formData.destinationName}
        isInvalid={errors.destinationName !== ''}
        onChangeText={(value) => {
          setData({
            ...formData,
            destinationName: value,
          });
        }}
        onSelectAutocomplete={(autocomplete) => setData({
          ...formData,
          destinationName: autocomplete.name,
        })}
        InputRightElement={deleteBtn(['destinationName'])}
        routeApi="accounts"
        isDestination
        error={errors.destinationName}
      />

      <AutocompleteField
        label={translate('transaction_form_category_label')}
        placeholder={translate('transaction_form_category_label')}
        value={formData.categoryName}
        isInvalid={errors.categoryId !== ''}
        onChangeText={(value) => {
          setData({
            ...formData,
            categoryName: value,
          });
        }}
        onSelectAutocomplete={(autocomplete) => setData({
          ...formData,
          categoryId: autocomplete.id,
          categoryName: autocomplete.name,
        })}
        InputRightElement={deleteBtn(['categoryId', 'categoryName'])}
        routeApi="categories"
        error={errors.categoryId}
      />

      <AutocompleteField
        label={translate('transaction_form_budget_label')}
        placeholder={translate('transaction_form_budget_label')}
        value={formData.budgetName}
        isInvalid={errors.budgetId !== ''}
        onChangeText={(value) => {
          setData({
            ...formData,
            budgetName: value,
          });
        }}
        onSelectAutocomplete={(autocomplete) => setData({
          ...formData,
          budgetId: autocomplete.id,
          budgetName: autocomplete.name,
        })}
        InputRightElement={deleteBtn(['budgetId', 'budgetName'])}
        routeApi="budgets"
        error={errors.budgetId}
      />

      {success && !loading
        && (
          <ToastAlert
            title={translate('transaction_form_success_title')}
            status="success"
            variant="solid"
            onClose={() => setSuccess(false)}
            description={translate('transaction_form_success_description')}
            onPress={goToTransactions}
          />
        )}
      {errors.global !== '' && !loading
        && (
          <ToastAlert
            title={translate('transaction_form_error_title')}
            status="error"
            variant="solid"
            onClose={resetErrors}
            description={errors.global}
          />
        )}

      <Button
        mt="3"
        variant="outline"
        colorScheme="gray"
        onPress={() => {
          setData({
            date: new Date(),
            sourceName: '',
            destinationName: '',
            description: '',
            amount: '',
            type: 'withdrawal',
            budgetId: '',
            budgetName: '',
            categoryId: '',
            categoryName: '',
          });
          resetErrors();
        }}
      >
        {translate('transaction_form_reset_button')}
      </Button>
      <Button
        mt="3"
        shadow={2}
        _pressed={{
          style: {
            transform: [{
              scale: 0.99,
            }],
          },
        }}
        _loading={{
          bg: 'primary.50',
          _text: {
            color: 'white',
          },
          alignItems: 'flex-start',
          opacity: 1,
        }}
        _spinner={{
          color: 'white',
          size: 10,
        }}
        isLoading={loading}
        isLoadingText="Submitting..."
        onPress={() => {
          onSubmit();
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }}
      >
        {translate('transaction_form_submit_button')}
      </Button>
    </VStack>
  );
}
