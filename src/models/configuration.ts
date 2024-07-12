import { createModel } from '@rematch/core';
import axios, { AxiosResponse } from 'axios';

import { RootModel } from './index';
import { convertKeysToCamelCase } from '../lib/common';

type ConfigurationStateType = {
  backendURL: string
  hideBalance: boolean
  displayAllAccounts: boolean
  displayForeignCurrency: boolean
  useBiometricAuth: boolean
  apiVersion: string
  serverVersion: string
  closeTransactionScreen: boolean
}

type FireflyIIIApiResponse = {
  data: unknown,
  meta?: {
    pagination: {
      currentPage: number
      totalPages: number
    }
  },
}

type AboutType = {
  data?: {
    apiVersion: string
    version: string
  }
}

type AboutUserType = {
  data: {
    attributes: {
      email: string
    }
  }
}

const INITIAL_STATE = {
  backendURL: '',
  hideBalance: false,
  displayAllAccounts: false,
  displayForeignCurrency: false,
  useBiometricAuth: false,
  apiVersion: '',
  serverVersion: '',
  closeTransactionScreen: false,
} as ConfigurationStateType;

export default createModel<RootModel>()({

  state: INITIAL_STATE,

  reducers: {
    setBackendURL(state, payload) {
      return {
        ...state,
        backendURL: payload,
      };
    },

    setVersions(state, { apiVersion, serverVersion }) {
      return {
        ...state,
        apiVersion,
        serverVersion,
      };
    },

    setUseBiometricAuth(state): ConfigurationStateType {
      return {
        ...state,
        useBiometricAuth: !state.useBiometricAuth,
      };
    },

    setHideBalance(state, hideBalance: boolean): ConfigurationStateType {
      return {
        ...state,
        hideBalance,
      };
    },

    setDisplayAllAccounts(state, displayAllAccounts: boolean): ConfigurationStateType {
      return {
        ...state,
        displayAllAccounts,
      };
    },

    setDisplayForeignCurrency(state, displayForeignCurrency: boolean): ConfigurationStateType {
      return {
        ...state,
        displayForeignCurrency,
      };
    },

    resetState() {
      return INITIAL_STATE;
    },

    setCloseTransactionScreen(state, closeTransactionScreen: boolean): ConfigurationStateType {
      return {
        ...state,
        closeTransactionScreen,
      };
    },
  },

  effects: (dispatch) => ({

    async apiFetch({ url, config }, rootState): Promise<FireflyIIIApiResponse> {
      const {
        configuration: {
          backendURL,
        },
      } = rootState;

      if (backendURL) {
        // console.log('GET  ', `${backendURL}${url}`);
        const response = await axios.get(`${backendURL}${url}`, config);

        if (response.data) {
          const responseData = response.data.data || response.data;

          // recursively convert snake_case keys to camelCase
          return {
            data: convertKeysToCamelCase(responseData),
            meta: convertKeysToCamelCase(response.data.meta),
          };
        }

        return response;
      }

      throw new Error('No backend URL defined.');
    },

    async apiPost({ url, body, config }, rootState): Promise<AxiosResponse> {
      const {
        configuration: {
          backendURL,
        },
      } = rootState;

      if (backendURL) {
        // console.log('POST  ', `${backendURL}${url}`);
        const { data } = await axios.post(`${backendURL}${url}`, body, config);

        return data;
      }

      throw new Error('No backend URL defined.');
    },

    async apiPut({ url, body, config }, rootState): Promise<AxiosResponse> {
      const {
        configuration: {
          backendURL,
        },
      } = rootState;

      if (backendURL) {
        // console.log('PUT  ', `${backendURL}${url}`);
        const { data } = await axios.put(`${backendURL}${url}`, body, config);

        return data;
      }

      throw new Error('No backend URL defined.');
    },

    async apiDelete({ url }, rootState): Promise<AxiosResponse> {
      const {
        configuration: {
          backendURL,
        },
      } = rootState;

      if (backendURL) {
        // console.log('DELETE  ', `${backendURL}${url}`);
        const { data } = await axios.delete(`${backendURL}${url}`);

        return data;
      }

      throw new Error('No backend URL defined.');
    },

    async getCurrentApiVersion(): Promise<void> {
      const { data } = await dispatch.configuration.apiFetch({ url: '/api/v1/about' }) as AboutType;

      if (data.apiVersion && data.version) {
        dispatch.configuration.setVersions({
          apiVersion: data.apiVersion,
          serverVersion: data.version,
        });
      }
    },

    async getCurrentUserEmail(): Promise<string> {
      const { data } = await dispatch.configuration.apiFetch({ url: '/api/v1/about/user' }) as AboutUserType;

      return data.attributes.email;
    },

    async resetAllStates(): Promise<void> {
      await Promise.all([
        dispatch.accounts.resetState(),
        dispatch.budgets.resetState(),
        dispatch.categories.resetState(),
        dispatch.currencies.resetState(),
        dispatch.firefly.resetState(),
        dispatch.transactions.resetState(),
        dispatch.piggyBanks.resetState(),
      ]);
    },
  }),
});
