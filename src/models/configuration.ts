import { createModel } from '@rematch/core';
import * as SecureStore from 'expo-secure-store';
import axios, { AxiosResponse } from 'axios';

import secureKeys from '../constants/oauth';
import { RootModel } from './index';
import { convertKeysToCamelCase } from '../lib/common';

type ConfigurationStateType = {
  backendURL: string
  scrollEnabled: boolean
  hideBalance: boolean
  displayAllAccounts: boolean
  faceId: boolean
  apiVersion: string
  serverVersion: string
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

const INITIAL_STATE = {
  backendURL: 'https://',
  scrollEnabled: true,
  hideBalance: false,
  displayAllAccounts: false,
  faceId: false,
  apiVersion: '',
  serverVersion: '',
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

    setFaceId(state): ConfigurationStateType {
      return {
        ...state,
        faceId: !state.faceId,
      };
    },

    disableScroll(state): ConfigurationStateType {
      return {
        ...state,
        scrollEnabled: false,
      };
    },

    enableScroll(state): ConfigurationStateType {
      return {
        ...state,
        scrollEnabled: true,
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

    resetState() {
      return INITIAL_STATE;
    },
  },

  effects: (dispatch) => ({
    /**
     * @returns {Promise}
     */
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

    /**
     * @returns {Promise}
     */
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

    /**
     * @returns {Promise}
     */
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

    /**
     * @returns {Promise}
     */
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

    /**
     * Test the accessToken
     *
     * @returns {Promise}
     */
    async testAccessToken(): Promise<void> {
      const { data } = await dispatch.configuration.apiFetch({ url: '/api/v1/about' }) as AboutType;

      if (data.apiVersion && data.version) {
        dispatch.configuration.setVersions({
          apiVersion: data.apiVersion,
          serverVersion: data.version,
        });
      }
    },

    /**
     * Reset all storage from app
     *
     * @returns {Promise}
     */
    async resetAllStorage(): Promise<void> {
      await Promise.all([
        SecureStore.deleteItemAsync(secureKeys.tokens),
        SecureStore.deleteItemAsync(secureKeys.oauthConfig),
        dispatch.accounts.resetState(),
        dispatch.budgets.resetState(),
        dispatch.categories.resetState(),
        dispatch.configuration.resetState(),
        dispatch.currencies.resetState(),
        dispatch.firefly.resetState(),
        dispatch.transactions.resetState(),
      ]);
    },
  }),
});
