import React, { useEffect, useMemo, useState } from 'react';
import { Keyboard, Platform, View } from 'react-native';
import {
  Button,
  KeyboardAvoidingView,
} from 'native-base';
import { useDispatch, useSelector } from 'react-redux';
import * as Haptics from 'expo-haptics';
import * as Crypto from 'expo-crypto';
import { Ionicons } from '@expo/vector-icons';

import { useThemeColors } from '../../lib/common';
import TransactionSplitForm from '../Forms/TransactionSplitForm';
import { RootDispatch, RootState } from '../../store';
import translate from '../../i18n/locale';
import ToastAlert from '../UI/ToastAlert';
import GroupTitle from './Fields/GroupTitle';

import Loading from '../UI/Loading';

function MultipleTransactionSplitForm({ splits, title }) {
  const [splitNumber, setSplitNumber] = useState<string[]>([]);
  const dispatch = useDispatch<RootDispatch>();

  useEffect(() => {
    setSplitNumber(splits.length ? splits.map(() => Crypto.randomUUID()) : [Crypto.randomUUID()]);
  }, [splits]);

  const addTransactionSplit = () => {
    setSplitNumber((prevState) => [...prevState, Crypto.randomUUID()]);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch();
    dispatch.transactions.addTransactionSplit();
  };

  const deleteTransactionSplit = (index: number) => {
    setSplitNumber((prevState) => prevState.filter((_, i) => i !== index));
    dispatch.transactions.deleteTransactionSplit(index);
  };

  if (splitNumber.length === 0) {
    return <Loading />;
  }

  return (
    <View>
      {splitNumber.map((e, i) => (
        <TransactionSplitForm
          key={e}
          index={i}
          total={splitNumber.length}
          transaction={splits[i]}
          handleDelete={() => deleteTransactionSplit(i)}
        />
      ))}
      <Button
        mt="3"
        leftIcon={<Ionicons name="add-circle" size={20} color="white" />}
        shadow={2}
        _pressed={{
          style: {
            transform: [{
              scale: 0.99,
            }],
          },
        }}
        onPress={addTransactionSplit}
        colorScheme="coolGray"
      >
        {translate('transaction_form_new_split_button')}
      </Button>
      {splitNumber.length > 1 && (<GroupTitle title={title || 'Default title'} />)}
    </View>
  );
}

function TransactionFormButtons({ navigation, id, handleSubmit }) {
  const { loading } = useSelector((state: RootState) => state.loading.effects.transactions[id ? 'updateTransaction' : 'createTransaction']);
  const error = useSelector((state: RootState) => state.transactions.error);
  const success = useSelector((state: RootState) => state.transactions.success);
  const dispatch = useDispatch<RootDispatch>();

  const goToTransactions = async () => {
    navigation.navigate('Transactions', {
      screen: 'TransactionsScreen',
      merge: true,
      params: {
        forceRefresh: true,
      },
    });
  };

  return (
    <View>
      {success && !loading && (
        <ToastAlert
          title={translate('transaction_form_success_title')}
          status="success"
          variant="solid"
          onClose={dispatch.transactions.resetStatus}
          description={translate('transaction_form_success_description')}
          onPress={goToTransactions}
        />
      )}
      {error !== '' && !loading && (
        <ToastAlert
          title={translate('transaction_form_error_title')}
          status="error"
          variant="solid"
          onClose={dispatch.transactions.resetStatus}
          description={error}
        />
      )}
      <Button
        mt="3"
        leftIcon={<Ionicons name="ios-cloud-upload-sharp" size={20} color="white" />}
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
        onPress={handleSubmit}
      >
        {translate('transaction_form_submit_button')}
      </Button>
    </View>
  );
}

export default function TransactionForm({
  navigation,
  title,
  splits = [],
  id = null,
}) {
  const { colors } = useThemeColors();
  const dispatch = useDispatch<RootDispatch>();

  useEffect(() => {
    dispatch.transactions.resetTransaction({ splits, title });

    return () => {
      dispatch.transactions.resetStatus();
    };
  }, []);

  const handleSubmit = async () => {
    Keyboard.dismiss();
    try {
      if (id === null) {
        await dispatch.transactions.createTransaction();
      } else {
        await dispatch.transactions.updateTransaction({ id });
      }
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      dispatch.transactions.setSuccessStatus();
    } catch (e) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      if (e.response) {
        dispatch.transactions.setErrorStatus(e.response.data.message);
      }
    }
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
        <MultipleTransactionSplitForm title={title} splits={splits} />
        <TransactionFormButtons navigation={navigation} id={id} handleSubmit={handleSubmit} />
        <View style={{ height: 240 }} />
      </KeyboardAvoidingView>
    ),
    [],
  );
}
