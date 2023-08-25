import React, { useEffect, useMemo, useState } from 'react';
import { Keyboard, Platform, View } from 'react-native';
import {
  Button,
  KeyboardAvoidingView,
} from 'native-base';
import { useDispatch, useSelector } from 'react-redux';
import * as Haptics from 'expo-haptics';
import * as Crypto from 'expo-crypto';

import { useThemeColors } from '../../lib/common';
import TransactionSplitForm from '../Forms/TransactionSplitForm';
import { RootDispatch, RootState } from '../../store';
import translate from '../../i18n/locale';
import ToastAlert from '../UI/ToastAlert';
import GroupTitle from './Fields/GroupTitle';

export default function TransactionForm({
  navigation,
  title,
  splits = [],
  id = null,
}) {
  const { colors } = useThemeColors();
  const effect = useSelector((state: RootState) => state.loading.effects.transactions[id ? 'updateTransaction' : 'createTransaction']);
  const dispatch = useDispatch<RootDispatch>();

  const [splitNumber, setSplitNumber] = useState<string[]>([]);
  const [globalError, setGlobalError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    dispatch.transactions.resetTransaction({ splits, title });
    setSplitNumber(splits.length ? splits.map(() => Crypto.randomUUID()) : [Crypto.randomUUID()]);
  }, []);

  const goToTransactions = async () => {
    navigation.navigate('Transactions', {
      screen: 'TransactionsScreen',
      merge: true,
      params: {
        forceRefresh: true,
      },
    });
  };

  const handleSubmit = async () => {
    Keyboard.dismiss();
    try {
      setGlobalError('');
      if (id === null) {
        await dispatch.transactions.createTransaction();
      } else {
        await dispatch.transactions.updateTransaction({ id });
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
  };

  const addTransactionSplit = () => {
    dispatch.transactions.addTransactionSplit();
    setSplitNumber((prevState) => [...prevState, Crypto.randomUUID()]);
  };

  const deleteTransactionSplit = (index: number) => {
    setSplitNumber((prevState) => prevState.filter((_, i) => i !== index));
    dispatch.transactions.deleteTransactionSplit(index);
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
            total={splitNumber.length}
            transaction={splits[i]}
            handleDelete={() => deleteTransactionSplit(i)}
          />
        ))}
        {splitNumber.length > 1 && (<GroupTitle title={title || 'Default title'} />)}
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
      effect,
      globalError,
      success,
    ],
  );
}
