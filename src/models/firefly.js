import { exchangeCodeAsync, refreshAsync } from 'expo-auth-session';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
import secureKeys from '../constants/oauth';
import apiFetch from '../lib/apiFetch';
import { discovery, redirectUri } from '../lib/oauth';

const INITIAL_STATE = {
  summary: [],
  dashboard: [],
  user: null,
};

export default {

  state: INITIAL_STATE,

  reducers: {
    setData(state, payload) {
      const {
        summary = state.summary,
        dashboard = state.dashboard,
        user = state.user,
      } = payload;

      return {
        ...state,
        summary,
        dashboard,
        user,
      };
    },

    resetFireFly() {
      return INITIAL_STATE;
    },
  },

  effects: (dispatch) => ({

    /**
     * Get the dashboard summary
     *
     * @returns {Promise}
     */
    async getSummaryBasic() {
      const summary = await apiFetch('/api/v1/summary/basic?start=2022-01-01&end=2022-12-31');

      const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'CAD',
      });
      // summary['net-worth-in-CAD'].value_parsed
      // summary['net-worth-in-EUR'].value_parsed
      // TODO: set all net worth values
      const exchangeRate = 1.41;
      summary.netWorth = summary['net-worth-in-CAD'].monetary_value;
      summary.netWorthEURCAD = exchangeRate * summary['net-worth-in-EUR'].monetary_value;
      summary.netWorth += summary.netWorthEURCAD;
      summary.netWorth = formatter.format(summary.netWorth);
      summary.netWorthEURCAD = formatter.format(summary.netWorthEURCAD);

      this.setData({ summary });
    },

    /**
     * Get the dashboard summary
     *
     * @returns {Promise}
     */
    async getDashboardBasic() {
      const dashboard = await apiFetch('/api/v1/chart/account/overview?start=2022-01-01&end=2022-03-21');

      // console.log(dashboard);

      // summary['net-worth-in-CAD'].value_parsed
      // summary['net-worth-in-EUR'].value_parsed
      // TODO: set all net worth values
      this.setData({ dashboard });
    },

    /**
     * Test the accessToken
     *
     * @returns {Promise}
     */
    async testAccessToken() {
      return apiFetch('/api/v1/about/user');
    },

    /**
     * Get a fresh accessToken from refreshToken
     *
     * @returns {Promise}
     */
    async getFreshAccessToken(payload, rootState) {
      const {
        configuration: {
          backendURL,
        },
      } = rootState;
      const oauthConfig = await SecureStore.getItemAsync(secureKeys.oauthConfig);
      const oauthConfigStorageValue = JSON.parse(oauthConfig);

      const response = await refreshAsync(
        {
          clientId: oauthConfigStorageValue.oauthClientId,
          refreshToken: payload,
          extraParams: {
            client_secret: oauthConfigStorageValue.oauthClientSecret,
          },
        },
        discovery(backendURL),
      );

      if (!response.accessToken) {
        await dispatch.configuration.resetAllStorage();

        throw new Error('Failed to get accessToken with the refresh token. Please restart the Sign In process.');
      }

      const newStorageValue = JSON.stringify(response);
      await SecureStore.setItemAsync(secureKeys.tokens, newStorageValue);
      axios.defaults.headers.Authorization = `Bearer ${response.accessToken}`;
    },

    /**
     * Get a new accessToken from authorization code
     *
     * @returns {Promise}
     */
    async getNewAccessToken(payload, rootState) {
      const {
        configuration: {
          backendURL,
        },
      } = rootState;

      const {
        oauthClientId,
        oauthClientSecret,
        codeVerifier,
        code,
      } = payload;

      const response = await exchangeCodeAsync(
        {
          clientId: oauthClientId,
          redirectUri,
          code,
          extraParams: {
            client_secret: oauthClientSecret,
            code_verifier: codeVerifier,
          },
        },
        discovery(backendURL),
      );

      if (!response.accessToken) {
        throw new Error('Please check Oauth Client ID / Secret.');
      }

      const storageValue = JSON.stringify(response);
      const oauthConfigStorageValue = JSON.stringify({
        oauthClientId,
        oauthClientSecret,
      });
      await Promise.all([
        SecureStore.setItemAsync(secureKeys.tokens, storageValue),
        SecureStore.setItemAsync(secureKeys.oauthConfig, oauthConfigStorageValue),
      ]);

      axios.defaults.headers.Authorization = `Bearer ${response.accessToken}`;
    },

  }),
};
