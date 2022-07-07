import { exchangeCodeAsync, refreshAsync } from 'expo-auth-session';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
import { maxBy, minBy } from 'lodash';
import secureKeys from '../constants/oauth';
import { discovery, redirectUri } from '../lib/oauth';
import colors from '../constants/colors';

const getCurrentDate = () => new Date().toISOString().slice(0, 10);

export type HomeDisplayType = {
  title: string,
  value_parsed: string,
}

export type AssetAccountType = {
  title: string,
  value_parsed: string,
  skip: boolean,
  color: string,
  colorScheme: string,
  entries: { x: string, y: string }[],
  maxY: number,
  minY: number,
}

export type FireflyState = {
  start: string,
  end: string,
  range: number,
  netWorth: HomeDisplayType[],
  spent: HomeDisplayType[],
  earned: HomeDisplayType[],
  balance: HomeDisplayType[],
  dashboard: AssetAccountType[],
  user: null,
}

const INITIAL_STATE = {
  start: getCurrentDate(),
  end: getCurrentDate(),
  range: 3,
  netWorth: [],
  spent: [],
  earned: [],
  balance: [],
  dashboard: [],
  user: null,
};

export default {

  state: INITIAL_STATE as FireflyState,

  reducers: {
    setData(state, payload) {
      const {
        start = state.start,
        end = state.end,
        netWorth = state.netWorth,
        spent = state.spent,
        earned = state.earned,
        balance = state.balance,
        dashboard = state.dashboard,
        user = state.user,
      } = payload;

      return {
        ...state,
        start,
        end,
        netWorth,
        spent,
        earned,
        balance,
        dashboard,
        user,
      };
    },

    setRange(state, payload) {
      const {
        range,
      } = payload;

      return {
        ...state,
        range,
      };
    },

    filterData(state, payload) {
      const { index: filterIndex } = payload;
      const { dashboard } = state;
      const newDashboard = dashboard.map((d) => (d));
      newDashboard[filterIndex].skip = !newDashboard[filterIndex].skip;

      return {
        ...state,
        dashboard: newDashboard,
      };
    },

    resetFireFly() {
      return INITIAL_STATE;
    },
  },

  effects: (dispatch) => ({

    /**
     * Change the range
     *
     * @returns {Promise}
     */
    async handleChangeRange(payload, rootState) {
      const {
        firefly: {
          start: oldStart,
          end: oldEnd,
        },
      } = rootState;
      const {
        range = rootState.firefly.range,
        direction,
      } = payload;
      let start;
      let end;

      const rangeInt = parseInt(range, 10);

      if (direction !== undefined) {
        if (direction > 0) {
          start = new Date(oldStart);
          start.setMonth(start.getMonth() + rangeInt);
          end = new Date(oldEnd);
          end.setMonth(end.getMonth() + rangeInt);
        } else {
          start = new Date(oldStart);
          start.setMonth(start.getMonth() - rangeInt);
          end = new Date(oldEnd);
          end.setMonth(end.getMonth() - rangeInt);
        }
        start = start.toISOString().slice(0, 10);
        end = end.toISOString().slice(0, 10);
      } else {
        const today = new Date();
        const month = today.getMonth();
        const quarter = Math.floor((today.getMonth() + 3) / 3) - 1;
        const semi = Math.floor((today.getMonth() + 6) / 6);

        switch (rangeInt) {
          case 1:
            start = `${today.getFullYear()}-${(month + 1).toString().padStart(2, '0')}-01`;
            end = `${today.getFullYear()}-${(month + 1).toString().padStart(2, '0')}-30`;
            break;
          case 3:
            start = `${today.getFullYear()}-0${(quarter * 3) + 1}-01`;
            end = `${today.getFullYear()}-${((quarter + 1) * 3).toString().padStart(2, '0')}-30`;
            break;
          case 6:
            start = `${today.getFullYear()}-${semi === 1 ? '01' : '07'}-01`;
            end = `${today.getFullYear()}-${semi === 1 ? '06' : '12'}-30`;
            break;
          case 12:
            start = `${today.getFullYear()}-01-01`;
            end = `${today.getFullYear()}-12-31`;
            break;
          default:
            start = `${today.getFullYear()}-01-01`;
            end = `${today.getFullYear()}-12-31`;
            break;
        }
      }

      this.setRange({ range });
      this.setData({ start, end });

      await Promise.all([this.getSummaryBasic(), this.getDashboardBasic()]);
    },

    /**
     * Get the dashboard summary
     *
     * @returns {Promise}
     */
    async getSummaryBasic(payload, rootState) {
      const {
        firefly: {
          start,
          end,
        },
      } = rootState;

      const summary = await dispatch.configuration.apiFetch({ url: `/api/v1/summary/basic?start=${start}&end=${end}` });
      const netWorth = [];
      const spent = [];
      const earned = [];
      const balance = [];
      Object.keys(summary).forEach((key) => {
        if (key.includes('net-worth-in')) {
          netWorth.push(summary[key]);
        }
        if (key.includes('spent-in')) {
          spent.push(summary[key]);
        }
        if (key.includes('earned-in')) {
          earned.push(summary[key]);
        }
        if (key.includes('balance-in')) {
          balance.push(summary[key]);
        }
      });

      this.setData({
        netWorth,
        spent,
        earned,
        balance,
      });
    },

    /**
     * Get the dashboard summary
     *
     * @returns {Promise}
     */
    async getDashboardBasic(payload, rootState) {
      const {
        firefly: {
          start,
          end,
        },
      } = rootState;

      const dashboard = await dispatch.configuration.apiFetch({ url: `/api/v1/chart/account/overview?start=${start}&end=${end}` });
      let colorIndex = 0;

      dashboard.forEach((v, index) => {
        if (colorIndex >= 4) {
          colorIndex = 0;
        }
        dashboard[index].skip = false;
        dashboard[index].color = colors[`brandStyle${colorIndex}`];
        dashboard[index].colorScheme = `chart${colorIndex}`;
        colorIndex += 1;
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

      this.setData({ dashboard });
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
