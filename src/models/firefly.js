import { exchangeCodeAsync, refreshAsync } from 'expo-auth-session';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
import { maxBy, minBy } from 'lodash';
import secureKeys from '../constants/oauth';
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
      const today = new Date().toISOString().slice(0, 10);

      const summary = await dispatch.configuration.apiFetch({ url: `/api/v1/summary/basic?start=2022-01-01&end=${today}` });

      const netWorth = [];
      Object.keys(summary).forEach((key) => {
        if (key.includes('net-worth-in')) {
          netWorth.push(summary[key]);
        }
      });

      this.setData({ summary: netWorth });
    },

    /**
     * Get the dashboard summary
     *
     * @returns {Promise}
     */
    async getDashboardBasic() {
      const today = new Date().toISOString().slice(0, 10);
      const dashboard = await dispatch.configuration.apiFetch({ url: `/api/v1/chart/account/overview?start=2022-01-02&end=${today}` });

      const colors = ['#7f7f7f', '#FFF', '#df5314', '#121212'];

      dashboard.forEach((v, index) => {
        dashboard[index].color = colors[index];
        dashboard[index].entries = Object.keys(v.entries)
          .map((key) => {
            const value = dashboard[index].entries[key];
            const date = new Date(key.replace(/T.*/, ''));

            return {
              x: +date,
              y: value,
            };
          });
        dashboard[index].maxY = maxBy(dashboard[index].entries, (o) => (o.y)).y;
        dashboard[index].minY = minBy(dashboard[index].entries, (o) => (o.y)).y;
      });

      this.setData({ dashboard: dashboard.filter((v, i) => ![].includes(i)) });
    },

    /**
     * Test the accessToken
     *
     * @returns {Promise}
     */
    async testAccessToken() {
      return dispatch.configuration.apiFetch({ url: '/api/v1/about/user' });
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
