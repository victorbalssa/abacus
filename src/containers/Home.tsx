import React, { useEffect, FC } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
import { TokenResponse } from 'expo-auth-session';
import * as LocalAuthentication from 'expo-local-authentication';
import { useToast } from 'native-base';

import { CommonActions } from '@react-navigation/native';
import Layout from '../components/Home';
import { RootDispatch, RootState } from '../store';
import secureKeys from '../constants/oauth';
import ToastAlert from '../components/UI/ToastAlert';
import { ContainerPropType } from './types';

import { translate } from '../i18n/locale';


const Home: FC = ({ navigation }: ContainerPropType) => {
  const toast = useToast();
  const firefly = useSelector((state: RootState) => state.firefly);
  const accounts = useSelector((state: RootState) => state.accounts.accounts);
  const { backendURL, faceId } = useSelector((state: RootState) => state.configuration);
  const dispatch = useDispatch<RootDispatch>();
  const { loading } = useSelector((state: RootState) => state.loading.models.firefly);

  const fetchData = () => Promise.all([
    dispatch.firefly.getSummaryBasic(),
    dispatch.firefly.getDashboardBasic(),
    dispatch.accounts.getAccounts(),
  ]).catch();

  const goToOauth = () => navigation.dispatch(
    CommonActions.reset({
      index: 0,
      routes: [
        { name: 'oauth' },
      ],
    }),
  );

  const faceIdCheck = async () => {
    if (faceId) {
      const bioAuth = await LocalAuthentication.authenticateAsync();
      if (!bioAuth.success) {
        goToOauth();
      }
    }
  };

  useEffect(() => {
    (async () => {
      const tokens = await SecureStore.getItemAsync(secureKeys.tokens);
      const storageValue = JSON.parse(tokens);
      if (storageValue && storageValue.accessToken && backendURL) {
        axios.defaults.headers.Authorization = `Bearer ${storageValue.accessToken}`;

        try {
          if (!TokenResponse.isTokenFresh(storageValue)) {
            await dispatch.firefly.getFreshAccessToken(storageValue.refreshToken);
          }

          await faceIdCheck();
          await dispatch.currencies.getCurrencies();
          dispatch.firefly.handleChangeRange({}).catch();
        } catch (e) {
          toast.show({
            render: ({ id }) => (
              <ToastAlert
                onClose={() => toast.close(id)}
                title={translate('home_container_error_title')}
                status="error"
                variant="solid"
                description={`${translate('home_container_error_description')}, ${e.message}`}
              />
            ),
          });
        }
      } else {
        goToOauth();
      }
    })();
  }, []);

  return (
    <Layout
      accounts={accounts}
      netWorth={firefly.netWorth}
      balance={firefly.balance}
      fetchData={fetchData}
      loading={loading}
    />
  );
};

export default Home;
