import * as SecureStore from 'expo-secure-store';
import secureKeys from '../constants/oauth';

const INITIAL_STATE = {
  backendURL: '',
  defaultCurrency: 'EUR',
};

export default {

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
    async resetAllStorage() {
      await Promise.all([
        SecureStore.deleteItemAsync(secureKeys.tokens),
        SecureStore.deleteItemAsync(secureKeys.oauthConfig),
      ]);
      dispatch.firefly.resetFireFly();
      dispatch.configuration.resetConfiguration();
    },
  }),
};
