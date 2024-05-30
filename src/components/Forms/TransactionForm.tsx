import React, {
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from 'react';
import {
  Keyboard,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  Pressable,
  Switch,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import * as Haptics from 'expo-haptics';
import * as Crypto from 'expo-crypto';
import { Ionicons } from '@expo/vector-icons';

import TransactionSplitForm from '../Forms/TransactionSplitForm';
import { RootDispatch, RootState } from '../../store';
import translate from '../../i18n/locale';
import GroupTitle from './Fields/GroupTitle';

import Loading from '../UI/Loading';
import { initialSplit } from '../../models/transactions';
import { AStackFlex, AText, AView } from '../UI/ALibrary';
import AButton from '../UI/ALibrary/AButton';
import { useThemeColors } from '../../lib/common';

function MultipleTransactionSplitForm({ isNew, splits, title }) {
  const { colors } = useThemeColors();
  const displayForeignCurrency = useSelector((state: RootState) => state.configuration.displayForeignCurrency);
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

  const onSwitch = async (bool: boolean) => {
    dispatch.configuration.setDisplayForeignCurrency(bool);
    return Promise.resolve();
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
      <AButton
        style={{
          height: 40,
          marginTop: 5,
          borderWidth: 0.5,
          borderColor: colors.listBorderColor,
        }}
        onPress={addTransactionSplit}
      >
        <AStackFlex row>
          <Ionicons name="add-circle" size={22} color={colors.greyLight} style={{ margin: 5 }} />
          <AText color={colors.greyLight} fontSize={15}>{translate('transaction_form_new_split_button')}</AText>
        </AStackFlex>
      </AButton>
      <GroupTitle title={title || ''} />
      <AStackFlex row py={10} alignItems="center" justifyContent="space-between">
        <AText color={colors.greyLight} fontSize={14} bold>{translate('transaction_form_foreign_currency_label')}</AText>
        <Switch thumbColor="white" trackColor={{ false: '#767577', true: colors.brandStyle }} onValueChange={onSwitch} value={displayForeignCurrency} />
      </AStackFlex>
    </AView>
  );
}

function TransactionFormButtons({ handleSubmit }) {
  const loading = useSelector((state: RootState) => state.loading.effects.transactions.upsertTransaction?.loading);

  return (
    <AButton type="primary" loading={loading} style={{ height: 40, marginTop: 5 }} onPress={handleSubmit}>
      <AStackFlex row>
        <Ionicons name="cloud-upload-sharp" size={20} color="white" style={{ margin: 5 }} />
        <AText color="white" fontSize={15}>{translate('transaction_form_submit_button')}</AText>
      </AStackFlex>
    </AButton>
  );
}

export default function TransactionForm({
  navigation,
  title,
  splits = [],
  id = '-1',
}) {
  const dispatch = useDispatch<RootDispatch>();
  const closeTransactionScreen = useSelector((state: RootState) => state.configuration.closeTransactionScreen);

  useEffect(() => {
    dispatch.transactions.resetTransaction({ splits, title });
  }, []);

  const handleSubmit = async () => {
    Keyboard.dismiss();
    try {
      await dispatch.transactions.upsertTransaction({ id });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch();
      if (closeTransactionScreen) {
        navigation.goBack();
      }
    } catch (e) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch();
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable onPress={handleSubmit}>
          <AText fontSize={16} bold>{translate('transaction_form_submit_button')}</AText>
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
          <TransactionFormButtons handleSubmit={handleSubmit} />
          <AView style={{ height: 170 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    ),
    [],
  );
}
