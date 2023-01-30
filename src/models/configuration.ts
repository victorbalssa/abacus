import { createModel } from '@rematch/core';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
import secureKeys from '../constants/oauth';
import { RootModel } from './index';

export type ConfigurationStateType = {
  backendURL: string,
  scrollEnabled: boolean,
  faceId: boolean,
  displayFilter: boolean,
}

const INITIAL_STATE = {
  backendURL: 'https://',
  scrollEnabled: true,
  faceId: false,
  displayFilter: false,
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

    setDefaultCurrency(state, payload) {
      return {
        ...state,
        defaultCurrency: payload,
      };
    },

    setDisplayFilter(state, payload) {
      return {
        ...state,
        displayFilter: payload,
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
    async apiFetch({ url, config }, rootState): Promise<any> {
      const {
        configuration: {
          backendURL,
        },
      } = rootState;

      if (backendURL) {
        console.log('GET  ', `${backendURL}${url}`);
        const response = await axios.get(`${backendURL}${url}`, config);

        if (response.data) return response.data;

        return response;
      }

      throw new Error('No backend URL defined.');
    },

    /**
     * @returns {Promise}
     */
    async apiPost({ url, body, config }, rootState): Promise<any> {
      const {
        configuration: {
          backendURL,
        },
      } = rootState;

      if (backendURL) {
        console.log('POST  ', `${backendURL}${url}`);
        const { data } = await axios.post(`${backendURL}${url}`, body, config);

        return data;
      }

      throw new Error('No backend URL defined.');
    },

    /**
     * @returns {Promise}
     */
    async apiPut({ url, body, config }, rootState): Promise<any> {
      const {
        configuration: {
          backendURL,
        },
      } = rootState;

      if (backendURL) {
        console.log('PUT  ', `${backendURL}${url}`);
        const { data } = await axios.put(`${backendURL}${url}`, body, config);

        return data;
      }

      throw new Error('No backend URL defined.');
    },

    /**
     * @returns {Promise}
     */
    async apiDelete({ url }, rootState): Promise<any> {
      const {
        configuration: {
          backendURL,
        },
      } = rootState;

      if (backendURL) {
        console.log('DELETE  ', `${backendURL}${url}`);
        const { data } = await axios.delete(`${backendURL}${url}`);

        return data;
      }

      throw new Error('No backend URL defined.');
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
      ]);
      dispatch.accounts.resetState();
      dispatch.budgets.resetState();
      dispatch.categories.resetState();
      dispatch.configuration.resetState();
      dispatch.currencies.resetState();
      dispatch.firefly.resetState();
      dispatch.transactions.resetState();
    },
  }),
});
