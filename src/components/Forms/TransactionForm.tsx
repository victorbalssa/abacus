import React, { useMemo, useState } from 'react';
import { Keyboard, Platform, View } from 'react-native';
import {
  Button, FormControl, Input, KeyboardAvoidingView, VStack,
} from 'native-base';
import { useDispatch, useSelector } from 'react-redux';
import * as Haptics from 'expo-haptics';

import { useThemeColors } from '../../lib/common';
import TransactionSplitForm from '../Forms/TransactionSplitForm';
import { RootDispatch, RootState } from '../../store';
import { ErrorStateType, TransactionSplitType } from '../../models/transactions';
import translate from '../../i18n/locale';
import ToastAlert from '../UI/ToastAlert';

const INITIAL_ERROR = {
  description: '',
  amount: '',
  sourceName: '',
  destinationName: '',
  categoryId: '',
  budgetId: '',
  tags: '',
  foreignCurrencyId: '',
  foreignAmount: '',
  notes: '',
} as ErrorStateType;

const INITIAL_SPLIT = {
  type: 'withdrawal',
  amount: '',
  currencyCode: '',
  currencySymbol: '',
  date: new Date(),
  description: '',
  foreignCurrencyId: '',
  foreignAmount: '',
  sourceName: '',
  destinationName: '',
  categoryName: '',
  categoryId: '',
  budgetName: '',
  budgetId: '',
  tags: [],
  notes: '',
} as TransactionSplitType;

export default function TransactionForm({ navigation, splits = [INITIAL_SPLIT], id = null }) {
  const { colors } = useThemeColors();
  const transactionSplits = splits ? [...splits] : [];
  const effect = useSelector((state: RootState) => state.loading.effects.transactions[id ? 'updateTransaction' : 'createTransaction']);
  const dispatch = useDispatch<RootDispatch>();

  const [splitNumber, setSplitNumber] = useState<number[]>(splits.map((split, i) => i) || [0]);
  const [groupTitle, setGroupTitle] = useState<string>('');
  const [transactions, setTransactions] = useState<TransactionSplitType[]>(splits.length ? transactionSplits.map((split) => ({
    ...split,
    date: new Date(split.date),
    amount: split.amount ? parseFloat(split.amount).toFixed(2) : '',
    foreignAmount: split.foreignAmount ? parseFloat(split.foreignAmount).toFixed(2) : '',
  })) : [{ ...INITIAL_SPLIT }]);
  const [globalError, setGlobalError] = useState('');
  const [errors, setErrors] = useState(splits.length ? [...splits].map(() => ({ ...INITIAL_ERROR })) : [{ ...INITIAL_ERROR }]);
  const [success, setSuccess] = useState(false);

  const goToTransactions = async () => {
    navigation.navigate('Transactions', {
      screen: 'TransactionsScreen',
      merge: true,
      params: {
        forceRefresh: true,
      },
    });
  };

  const resetAllErrors = () => {
    setErrors(errors.map(() => ({ ...INITIAL_ERROR })));
    setGlobalError('');
  };

  const resetErrors = (i) => {
    errors[i] = { ...INITIAL_ERROR };
    setErrors(errors);
  };

  const validate = () => {
    let errorCount = 0;
    const newErrors = errors.map(() => ({ ...INITIAL_ERROR }));
    transactions.forEach((transaction: TransactionSplitType, i) => {
      if (transaction.description === undefined || transaction.description.length < 1) {
        newErrors[i].description = translate('transaction_form_description_short');
        errorCount += 1;
      }
      if (transaction.amount === undefined || transaction.amount.length < 1) {
        newErrors[i].amount = translate('transaction_form_amount_required');
        errorCount += 1;
      }
    });
    setErrors(newErrors);

    return errorCount === 0;
  };

  const handleSubmit = async () => {
    Keyboard.dismiss();
    if (validate()) {
      try {
        resetAllErrors();
        if (id === null) {
          await dispatch.transactions.createTransaction({ transactions });
        } else {
          await dispatch.transactions.updateTransaction({ id, transactions });
        }
        setSuccess(true);
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } catch (e) {
        setSuccess(false);
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        if (e.response) {
          setGlobalError(e.response.data.message);
        }
      }
    }
  };

  const addTransactionSplit = () => {
    setErrors(errors.concat(INITIAL_ERROR));
    setTransactions([
      ...transactions,
      INITIAL_SPLIT,
    ]);
    setSplitNumber((prevState) => [...prevState, prevState[prevState.length - 1] + 1]);
  };

  const deleteTransactionSplit = (index: number) => {
    setSplitNumber((prevState) => prevState.filter((_, i) => i !== index));
    setErrors((prevState) => prevState.filter((_, i) => i !== index));
    setTransactions((prevState) => prevState.filter((_, i) => i !== index));
  };

  return useMemo(
    () => (
      <KeyboardAvoidingView
        enabled
        h={{
          base: '100%',
          lg: 'auto',
        }}
        keyboardVerticalOffset={Platform.select({ ios: 0, android: 500 })}
        style={{
          flex: 1,
          backgroundColor: colors.backgroundColor,
        }}
      >
        {splitNumber.map((e, i) => (
          <TransactionSplitForm
            key={e}
            index={i}
            transaction={transactionSplits[i]}
            handleChange={(data) => {
              const newTransactions = [...transactions];
              newTransactions[i] = data;
              setTransactions(newTransactions);
            }}
            errors={errors[i]}
            resetErrors={() => resetErrors(i)}
            handleDelete={() => deleteTransactionSplit(i)}
          />
        ))}
        {splitNumber.length > 1 && (
          <FormControl mt="1" isInvalid={groupTitle.length < 1}>
            <FormControl.Label>
              {translate('transaction_form_group_title_label')}
            </FormControl.Label>
            <Input
              variant="outline"
              returnKeyType="done"
              placeholder={translate('transaction_form_group_title_placeholder')}
              value={groupTitle}
              onChangeText={(value) => setGroupTitle(value)}
            />
            <FormControl.HelperText>{translate('transaction_form_group_title_helper')}</FormControl.HelperText>
          </FormControl>
        )}
        {success && !effect?.loading
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
        {globalError !== '' && !effect?.loading
          && (
            <ToastAlert
              title={translate('transaction_form_error_title')}
              status="error"
              variant="solid"
              onClose={() => setGlobalError('')}
              description={globalError}
            />
          )}
        <Button
          mt="3"
          _pressed={{
            style: {
              transform: [{
                scale: 0.99,
              }],
            },
          }}
          onPress={addTransactionSplit}
        >
          {translate('transaction_form_new_split_button')}
        </Button>
        <Button
          mt="3"
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
          isLoading={effect?.loading}
          isLoadingText="Submitting..."
          onPress={handleSubmit}
        >
          {translate('transaction_form_submit_button')}
        </Button>
        <View style={{ height: 240 }} />
      </KeyboardAvoidingView>
    ),
    [
      splitNumber,
      errors,
      effect,
      globalError,
      success,
    ],
  );
}
