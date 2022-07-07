import { createModel } from '@rematch/core';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
import secureKeys from '../constants/oauth';
import { RootModel } from './index';

export type ConfigurationStateType = {
  backendURL: string,
}

const INITIAL_STATE = {
  backendURL: '',
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
     * Reset all storage from app
     *
     * @returns {Promise}
     */
    async apiFetch({ url, config }, rootState): Promise<any> {
      const {
        configuration: {
          backendURL,
        },
      } = rootState;

      if (backendURL) {
        const { data } = await axios.get(`${backendURL}${url}`, config);

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
      dispatch.firefly.resetFireFly();
      dispatch.configuration.resetConfiguration();
    },
  }),
});
