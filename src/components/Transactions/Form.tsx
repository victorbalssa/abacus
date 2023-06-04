import React from 'react';
import {
  Keyboard,
  View,
} from 'react-native';
import {
  Button,
  FormControl,
  HStack,
  IconButton,
  Input,
  Pressable,
  Text,
  VStack,
} from 'native-base';
import * as Haptics from 'expo-haptics';
import { AntDesign } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import ToastAlert from '../UI/ToastAlert';
import { translate } from '../../i18n/locale';
import { AutocompleteAccount, AutocompleteDescription } from '../../models/accounts';
import { CategoryType } from '../../models/categories';
import { BudgetType } from '../../models/budgets';
import { useThemeColors } from '../../lib/common';

type ErrorStateType = {
  description: string,
  source_name: string,
  destination_name: string,
  amount: string,
  category_id: string,
  budget_id: string,
  global: string,
}

const INITIAL_ERROR = {
  description: '',
  amount: '',
  source_name: '',
  destination_name: '',
  category_id: '',
  budget_id: '',
  global: '',
} as ErrorStateType;

const Form = ({
  accounts = [],
  categories = [],
  budgets = [],
  loading,
  descriptions = [],
  getAutocompleteAccounts,
  getAutocompleteDescription,
  getAutocompleteCategories,
  getAutocompleteBudgets,
  submit,
  goToTransactions,
  payload,
}) => {
  const { colorScheme, colors } = useThemeColors();
  const [formData, setData] = React.useState({
    description: payload.description,
    date: new Date(payload.date),
    source_name: payload.source_name,
    destination_name: payload.destination_name,
    amount: payload.amount ? parseFloat(payload.amount).toFixed(2) : '',
    category_id: payload.category_id,
    category_name: payload.category_name,
    budget_id: payload.budget_id,
    budget_name: payload.budget_name,
    type: payload.type,
  });
  const [errors, setErrors] = React.useState(INITIAL_ERROR);
  const [success, setSuccess] = React.useState(false);
  const [displayAutocomplete, setDisplayAutocomplete] = React.useState({
    budget: false, category: false, description: false, source: false, destination: false,
  });
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
  const closeAllAutocomplete = () => setDisplayAutocomplete({
    budget: false, category: false, description: false, source: false, destination: false,
  });

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
      <FormControl mt="1" isRequired isInvalid={errors.description !== ''}>
        <FormControl.Label>
          {translate('transaction_form_description_label')}
        </FormControl.Label>
        <Input
          returnKeyType="done"
          placeholder={translate('transaction_form_description_label')}
          value={formData.description}
          onChangeText={(value) => {
            setData({
              ...formData,
              description: value,
            });
            getAutocompleteDescription({ query: value });
          }}
          onFocus={() => {
            getAutocompleteDescription({ query: formData.description });
            setDisplayAutocomplete({
              ...displayAutocomplete,
              description: true,
            });
          }}
          onBlur={closeAllAutocomplete}
          InputRightElement={deleteBtn(['description'])}
        />
        {'description' in errors ? <FormControl.ErrorMessage>{errors.description}</FormControl.ErrorMessage> : <></>}

        {displayAutocomplete.description && (
          <View>
            {descriptions.map((a: AutocompleteDescription) => (
              <Pressable
                key={a.id}
                mx={2}
                onPress={() => {
                  setData({
                    ...formData,
                    description: a.name,
                  });
                  closeAllAutocomplete();
                }}
                _pressed={{
                  borderRadius: 10,
                  backgroundColor: 'gray.300',
                }}
              >
                <HStack
                  justifyContent="space-between"
                  mx={2}
                  my={2}
                >
                  <Text underline>
                    {a.name || 'no name'}
                  </Text>
                </HStack>
              </Pressable>
            ))}
          </View>
        )}
      </FormControl>
      <FormControl mt="1" isInvalid={errors.source_name !== ''}>
        <FormControl.Label>
          {translate('transaction_form_sourceAccount_label')}
        </FormControl.Label>
        <Input
          returnKeyType="done"
          placeholder={translate('transaction_form_sourceAccount_label')}
          value={formData.source_name}
          onChangeText={(value) => {
            setData({
              ...formData,
              source_name: value,
            });
            getAutocompleteAccounts({ query: value, isDestination: false });
          }}
          onFocus={() => {
            getAutocompleteAccounts({ query: formData.source_name, isDestination: false });
            setDisplayAutocomplete({
              ...displayAutocomplete,
              source: true,
            });
          }}
          onBlur={closeAllAutocomplete}
          InputRightElement={deleteBtn(['source_name'])}
        />

        {displayAutocomplete.source && (
          <View>
            {accounts.map((a: AutocompleteAccount) => (
              <Pressable
                key={a.id}
                mx={2}
                onPress={() => {
                  setData({
                    ...formData,
                    source_name: a.name,
                  });
                  closeAllAutocomplete();
                }}
                _pressed={{
                  borderRadius: 10,
                  backgroundColor: 'gray.300',
                }}
              >
                <HStack
                  justifyContent="space-between"
                  mx={2}
                  my={2}
                >
                  <Text underline>
                    {a.name_with_balance || 'no name'}
                  </Text>
                </HStack>
              </Pressable>
            ))}
          </View>
        )}
      </FormControl>
      <FormControl mt="1" isInvalid={errors.destination_name !== ''}>
        <FormControl.Label>
          {translate('transaction_form_destinationAccount_label')}
        </FormControl.Label>
        <Input
          returnKeyType="done"
          placeholder={translate('transaction_form_destinationAccount_label')}
          value={formData.destination_name}
          onChangeText={(value) => {
            setData({
              ...formData,
              destination_name: value,
            });
            getAutocompleteAccounts({ query: value, isDestination: true });
          }}
          onFocus={() => {
            getAutocompleteAccounts({ query: formData.destination_name, isDestination: true });
            setDisplayAutocomplete({
              ...displayAutocomplete,
              destination: true,
            });
          }}
          onBlur={closeAllAutocomplete}
          InputRightElement={deleteBtn(['destination_name'])}
        />

        {displayAutocomplete.destination && (
          <View>
            {accounts.map((a: AutocompleteAccount) => (
              <Pressable
                key={a.id}
                mx={2}
                onPress={() => {
                  setData({
                    ...formData,
                    destination_name: a.name,
                  });
                  closeAllAutocomplete();
                }}
                _pressed={{
                  borderRadius: 10,
                  backgroundColor: 'gray.300',
                }}
              >
                <HStack
                  justifyContent="space-between"
                  mx={2}
                  my={2}
                >
                  <Text underline>
                    {a.name_with_balance || 'no name'}
                  </Text>
                </HStack>
              </Pressable>
            ))}
          </View>
        )}

      </FormControl>
      <FormControl mt="1" isRequired>
        <FormControl.Label>
          {translate('transaction_form_date_label')}
        </FormControl.Label>
        <DateTimePicker
          accentColor={colors.brandDark}
          themeVariant={colorScheme}
          mode="date"
          style={{ width: 130 }}
          value={formData.date}
          onChange={(event, value) => setData({
            ...formData,
            date: value,
          })}
        />
      </FormControl>
      <FormControl mt="1" isRequired isInvalid={errors.amount !== ''}>
        <FormControl.Label>
          {translate('transaction_form_amount_label')}
        </FormControl.Label>
        <Input
          InputLeftElement={<Text px={3} color="white">*</Text>}
          returnKeyType="done"
          keyboardType="numbers-and-punctuation"
          placeholder="0.00"
          value={formData.amount}
          textAlign="center"
          fontStyle="gray"
          fontSize={25}
          onChangeText={(value) => setData({
            ...formData,
            amount: value,
          })}
          InputRightElement={deleteBtn(['amount'])}
        />
        {'amount' in errors ? <FormControl.ErrorMessage>{errors.amount}</FormControl.ErrorMessage> : <></>}
      </FormControl>
      <FormControl mt="1" isInvalid={errors.category_id !== ''}>
        <FormControl.Label>
          {translate('transaction_form_category_label')}
        </FormControl.Label>
        <Input
          returnKeyType="done"
          placeholder={translate('transaction_form_category_label')}
          value={formData.category_name}
          onChangeText={(value) => {
            setData({
              ...formData,
              category_name: value,
            });
            getAutocompleteCategories({ query: value || '', isDestination: true });
          }}
          onFocus={() => {
            getAutocompleteCategories({ query: formData.category_name || '' });
            setDisplayAutocomplete({
              ...displayAutocomplete,
              category: true,
            });
          }}
          onBlur={closeAllAutocomplete}
          InputRightElement={deleteBtn(['category_id', 'category_name'])}
        />

        {displayAutocomplete.category && (
          <View>
            {categories.map((c: CategoryType) => (
              <Pressable
                key={c.id}
                mx={2}
                onPress={() => {
                  setData({
                    ...formData,
                    category_id: c.id,
                    category_name: c.name,
                  });
                  closeAllAutocomplete();
                }}
                _pressed={{
                  borderRadius: 10,
                  backgroundColor: 'gray.300',
                }}
              >
                <HStack
                  justifyContent="space-between"
                  mx={2}
                  my={2}
                >
                  <Text underline>
                    {c.name || 'no category name'}
                  </Text>
                </HStack>
              </Pressable>
            ))}
          </View>
        )}
      </FormControl>
      <FormControl mt="1" isInvalid={errors.budget_id !== ''}>
        <FormControl.Label>
          {translate('transaction_form_budget_label')}
        </FormControl.Label>
        <Input
          returnKeyType="done"
          placeholder={translate('transaction_form_budget_label')}
          value={formData.budget_name}
          onChangeText={(value) => {
            setData({
              ...formData,
              budget_name: value,
            });
            getAutocompleteBudgets({ query: value || '', isDestination: true });
          }}
          onFocus={() => {
            getAutocompleteBudgets({ query: formData.budget_name || '' });
            setDisplayAutocomplete({
              ...displayAutocomplete,
              budget: true,
            });
          }}
          onBlur={closeAllAutocomplete}
          InputRightElement={deleteBtn(['budget_id', 'budget_name'])}
        />

        {displayAutocomplete.budget && (
          <View>
            {budgets.map((b: BudgetType) => (
              <Pressable
                key={b.id}
                mx={2}
                onPress={() => {
                  setData({
                    ...formData,
                    budget_id: b.id,
                    budget_name: b.name,
                  });
                  closeAllAutocomplete();
                }}
                _pressed={{
                  borderRadius: 10,
                  backgroundColor: 'gray.300',
                }}
              >
                <HStack
                  justifyContent="space-between"
                  mx={2}
                  my={2}
                >
                  <Text underline>
                    {b.name || 'no budget name'}
                  </Text>
                </HStack>
              </Pressable>
            ))}
          </View>
        )}
      </FormControl>

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
            source_name: '',
            destination_name: '',
            description: '',
            amount: '',
            type: 'withdrawal',
            budget_id: '',
            budget_name: '',
            category_id: '',
            category_name: '',
          });
          resetErrors();
        }}
      >
        {translate('transaction_form_reset_button')}
      </Button>
      <Button
        mt="2"
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
};

export default Form;
