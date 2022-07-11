import { createModel } from '@rematch/core';
import moment from 'moment';
import { exchangeCodeAsync, refreshAsync } from 'expo-auth-session';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
import { maxBy, minBy } from 'lodash';
import secureKeys from '../constants/oauth';
import { discovery, redirectUri } from '../lib/oauth';
import colors from '../constants/colors';
import { RootModel } from './index';

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

export type FireflyStateType = {
  start: string,
  end: string,
  range: number,
  rangeTitle: string,
  netWorth: HomeDisplayType[],
  spent: HomeDisplayType[],
  earned: HomeDisplayType[],
  balance: HomeDisplayType[],
  accounts: AssetAccountType[],
  user: null,
}

const INITIAL_STATE = {
  start: getCurrentDate(),
  end: getCurrentDate(),
  range: 3,
  rangeTitle: 'Q2 2022',
  netWorth: [],
  spent: [],
  earned: [],
  balance: [],
  accounts: [],
  user: null,
} as FireflyStateType;

export default createModel<RootModel>()({

  state: INITIAL_STATE,

  reducers: {
    setData(state, payload) {
      const {
        start = state.start,
        end = state.end,
        netWorth = state.netWorth,
        spent = state.spent,
        earned = state.earned,
        balance = state.balance,
        accounts = state.accounts,
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
        accounts,
        user,
      };
    },

    setRange(state, payload) {
      const {
        range,
        rangeTitle,
      } = payload;

      return {
        ...state,
        range,
        rangeTitle,
      };
    },

    filterData(state, payload) {
      const { index: filterIndex } = payload;
      const { accounts } = state;
      const newAccounts = accounts.map((d) => (d));
      newAccounts[filterIndex].skip = !newAccounts[filterIndex].skip;

      return {
        ...state,
        accounts: newAccounts,
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
          range: oldRange,
        },
      } = rootState;
      const {
        range = oldRange,
        direction,
      } = payload;
      let start;
      let end;

      const rangeInt = parseInt(range, 10);
      let rangeTitle = '';

      if (direction !== undefined) {
        if (direction > 0) {
          start = moment(oldStart).add(rangeInt, 'M').format('YYYY-MM-DD');
          end = moment(oldEnd).add(rangeInt, 'M').endOf('M').format('YYYY-MM-DD');
        } else {
          start = moment(oldStart).subtract(rangeInt, 'M').format('YYYY-MM-DD');
          end = moment(oldEnd).subtract(rangeInt, 'M').endOf('M').format('YYYY-MM-DD');
        }
      } else {
        const today = new Date();
        const month = today.getMonth();
        const quarter = Math.floor((today.getMonth() + 3) / 3) - 1;
        const semi = Math.floor((today.getMonth() + 6) / 6);

        switch (rangeInt) {
          case 1:
            start = `${today.getFullYear()}-${(month + 1).toString().padStart(2, '0')}-01`;
            end = `${today.getFullYear()}-${(month + 1).toString().padStart(2, '0')}-30`;
            end = moment(end).endOf('M').format('YYYY-MM-DD');
            break;
          case 3:
            start = `${today.getFullYear()}-0${(quarter * 3) + 1}-01`;
            end = `${today.getFullYear()}-${((quarter + 1) * 3).toString().padStart(2, '0')}-30`;
            end = moment(end).endOf('M').format('YYYY-MM-DD');
            break;
          case 6:
            start = `${today.getFullYear()}-${semi === 1 ? '01' : '07'}-01`;
            end = `${today.getFullYear()}-${semi === 1 ? '06' : '12'}-30`;
            end = moment(end).endOf('M').format('YYYY-MM-DD');
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

      switch (rangeInt) {
        case 1:
          rangeTitle = `${moment(start).utc().format('MMMM')} ${moment(start).utc().year()}.`;
          break;
        case 3:
          rangeTitle = `Q${moment(start).utc().quarter()} ${moment(start).utc().year()}.`;
          break;
        case 6:
          rangeTitle = `S${moment(start).utc().quarter() < 3 ? 1 : 2} ${moment(start).utc().year()}.`;
          break;
        case 12:
          rangeTitle = `${moment(start).utc().year()} Year.`;
          break;
        default:
          rangeTitle = `${moment(start).utc().year()} Year.`;
          break;
      }

      this.setRange({ range, rangeTitle });
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

      const accounts = await dispatch.configuration.apiFetch({ url: `/api/v1/chart/account/overview?start=${start}&end=${end}` });
      let colorIndex = 0;

      accounts.forEach((v, index) => {
        if (colorIndex >= 4) {
          colorIndex = 0;
        }
        accounts[index].skip = false;
        accounts[index].color = colors[`brandStyle${colorIndex}`];
        accounts[index].colorScheme = `chart${colorIndex}`;
        colorIndex += 1;
        accounts[index].entries = Object.keys(v.entries)
          .map((key) => {
            const value = accounts[index].entries[key];
            const date = new Date(key);

            return {
              x: +date,
              y: value,
            };
          });
        accounts[index].maxY = maxBy(accounts[index].entries, (o: { x: string, y: string}) => (o.y)).y;
        accounts[index].minY = minBy(accounts[index].entries, (o: { x: string, y: string}) => (o.y)).y;
      });

      this.setData({ accounts });
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
});
