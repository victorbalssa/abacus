import { createModel } from '@rematch/core';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
import secureKeys from '../constants/oauth';
import { RootModel } from './index';

export type ConfigurationStateType = {
  backendURL: string,
  scrollEnabled: boolean,
}

const INITIAL_STATE = {
  backendURL: '',
  scrollEnabled: true,
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

    resetConfiguration() {
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
        const { data } = await axios.get(`${backendURL}${url}`, config);

        return data;
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
      dispatch.firefly.resetFireflyIII();
      dispatch.configuration.resetConfiguration();
    },
  }),
});
