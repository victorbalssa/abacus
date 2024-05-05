import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { AxiosError } from 'axios';

import { CommonActions, useNavigation } from '@react-navigation/native';
import { RootState } from '../../store';
import ToastMessage from './ToastMessage';
import translate from '../../i18n/locale';
import useToasts from './useToasts';

export default function ErrorWidget() {
  const { showToast, toasts, removeToast } = useToasts();
  const error = useSelector((state: RootState) => state.loading.models.configuration.error);
  const success = useSelector((state: RootState) => state.loading.effects.transactions.upsertTransaction.success);
  const navigation = useNavigation();

  const goToCredentials = async () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
          { name: 'credentials' },
        ],
      }),
    );
  };

  const isFirstRun = useRef(true);
  useEffect(() => {
    (async () => {
      if (error && (error as Error).message && !isFirstRun.current) {
        const message = (error as AxiosError).response.data?.message ? (error as AxiosError).response.data?.message : (error as Error).message;
        showToast(translate('error_widget_title'), message, 'error');
      }

      if (success && !isFirstRun.current) {
        showToast(translate('transaction_form_success_title'), translate('transaction_form_success_description'), 'success');
      }

      if (error && (error as AxiosError).response?.status && (error as AxiosError).response?.status === 404 && !isFirstRun.current) {
        goToCredentials();
      }

      if (isFirstRun.current) {
        isFirstRun.current = false;
      }
    })();
  }, [error, success]);

  return toasts.map((toast) => (
    <ToastMessage
      key={toast.id}
      id={toast.id}
      type={toast.type}
      title={toast.title}
      description={toast.description}
      onUnmount={removeToast}
    />
  ));
}
