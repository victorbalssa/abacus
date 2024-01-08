import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useToast } from 'native-base';
import { AxiosError } from 'axios';
import { useNavigation, CommonActions } from '@react-navigation/native';
import { View } from 'react-native';

import * as SecureStore from 'expo-secure-store';
import { RootState } from '../../store';
import ToastAlert from './ToastAlert';
import translate from '../../i18n/locale';
import secureKeys from '../../constants/oauth';

export default function ErrorWidget() {
  const toast = useToast();
  const { error } = useSelector((state: RootState) => state.loading.global);
  const navigation = useNavigation();

  const goToOauth = () => navigation.dispatch(
    CommonActions.reset({
      index: 0,
      routes: [
        { name: 'oauth' },
      ],
    }),
  );

  useEffect(() => {
    if (error && (error as Error).message) {
      toast.show({
        render: ({ id }) => (
          <ToastAlert
            onClose={() => toast.close(id)}
            title={translate('error_widget_title')}
            status="error"
            variant="solid"
            description={(error as Error).message}
          />
        ),
      });
    }

    if (error && (error as AxiosError).response?.status && (error as AxiosError).response?.status === 401) {
      Promise.all([SecureStore.deleteItemAsync(secureKeys.accessToken)]).then(goToOauth);
    }
  }, [error]);

  return <View />;
}
