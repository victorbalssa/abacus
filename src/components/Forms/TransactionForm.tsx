import React, {
  useEffect, useLayoutEffect, useMemo, useRef, useState,
} from 'react';
import {
  Keyboard,
  Platform,
  View,
  KeyboardAvoidingView,
  ScrollView, Pressable,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import * as Haptics from 'expo-haptics';
import * as Crypto from 'expo-crypto';
import { Ionicons } from '@expo/vector-icons';

import TransactionSplitForm from '../Forms/TransactionSplitForm';
import { RootDispatch, RootState } from '../../store';
import translate from '../../i18n/locale';
import ToastMessage from '../UI/ToastMessage';
import GroupTitle from './Fields/GroupTitle';

import Loading from '../UI/Loading';
import { initialSplit } from '../../models/transactions';
import { AStackFlex, AText, AView } from '../UI/ALibrary';
import AButton from '../UI/ALibrary/AButton';
import ErrorWidget from '../UI/ErrorWidget';

function MultipleTransactionSplitForm({ isNew, splits, title }) {
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
    <AView>
      {splitNumber.map((e, i) => (
        <TransactionSplitForm
          key={e}
          index={i}
          isNew={isNew}
          total={splitNumber.length}
          transaction={splits[i] || initialSplit()}
          handleDelete={() => deleteTransactionSplit(i)}
        />
      ))}
      <AButton style={{ height: 40, marginTop: 5 }} onPress={addTransactionSplit}>
        <AStackFlex row>
          <Ionicons name="add-circle" size={20} color="white" style={{ margin: 5 }} />
          <AText fontSize={15}>{translate('transaction_form_new_split_button')}</AText>
        </AStackFlex>
      </AButton>
      <GroupTitle title={title || ''} />
    </AView>
  );
}

function TransactionFormButtons({ navigation, handleSubmit }) {
  const loading = useSelector((state: RootState) => state.loading.effects.transactions.upsertTransaction?.loading);
  const error = useSelector((state: RootState) => state.transactions.error);
  const success = useSelector((state: RootState) => state.transactions.success);

  const goToTransactions = async () => {
    navigation.navigate('Transactions', {
      screen: 'TransactionsScreen',
      merge: true,
      params: {
        forceRefresh: true,
      },
    });
  };

  const toastRef = useRef(null);
  const onHandleSubmit = async () => {
    await handleSubmit();
  };

  return (
    <View>
      <ToastMessage
        type={success ? 'success' : 'error'}
        title={translate(`transaction_form_${success ? 'success' : 'error'}_title`)}
        description={error || translate('transaction_form_success_description')}
        timeout={5000}
        onPress={goToTransactions}
        ref={toastRef}
      />

      <AButton type="primary" loading={loading} style={{ height: 40, marginTop: 5 }} onPress={onHandleSubmit}>
        <AStackFlex row>
          <Ionicons name="cloud-upload-sharp" size={20} color="white" style={{ margin: 5 }} />
          <AText fontSize={15}>{translate('transaction_form_submit_button')}</AText>
        </AStackFlex>
      </AButton>
    </View>
  );
}

export default function TransactionForm({
  navigation,
  title,
  splits = [],
  id = '-1',
}) {
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
      await dispatch.transactions.upsertTransaction({ id });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch();
      dispatch.transactions.setSuccessStatus();
    } catch (e) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch();
      if (e.response) {
        dispatch.transactions.setErrorStatus(e.response.data.message);
      }
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable onPress={handleSubmit}>
          <AText fontSize={16}>{translate('transaction_form_submit_button')}</AText>
        </Pressable>
      ),
    });
  }, [navigation, dispatch, title, splits, id]);

  return useMemo(
    () => (
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.select({ ios: 'padding', android: 'height' })}
      >
        <ScrollView
          style={{
            padding: 10,
          }}
          keyboardShouldPersistTaps="handled"
          bounces={false}
        >
          <MultipleTransactionSplitForm isNew={id === '-1'} title={title} splits={splits} />
          <TransactionFormButtons navigation={navigation} handleSubmit={handleSubmit} />
          <AView style={{ height: 170 }} />
        </ScrollView>
        <ErrorWidget />
      </KeyboardAvoidingView>
    ),
    [],
  );
}
