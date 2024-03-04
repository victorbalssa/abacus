import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { AxiosError } from 'axios';
import { useNavigation, CommonActions } from '@react-navigation/native';

import { RootState } from '../../store';
import ToastMessage from './ToastMessage';
import translate from '../../i18n/locale';

export default function ErrorWidget() {
  const { error } = useSelector((state: RootState) => state.loading.global);
  const navigation = useNavigation();

  const goToOauth = () => navigation.dispatch(
    CommonActions.reset({
      index: 0,
      routes: [
        { name: 'credentials' },
      ],
    }),
  );

  const toastRef = useRef(null);
  useEffect(() => {
    (async () => {
      if (error && (error as Error).message) {
        if (toastRef.current) {
          toastRef.current.show();
        }

        console.log('----',(error as Error).message);
      }

      if (error && (error as AxiosError).response?.status && (error as AxiosError).response?.status === 401) {
        goToOauth();
      }
    })();
  }, [error]);

  return (
    <ToastMessage
      type="error"
      title={translate('error_widget_title')}
      description={(error as Error).message}
      timeout={2000}
      ref={toastRef}
    />
  );
}
