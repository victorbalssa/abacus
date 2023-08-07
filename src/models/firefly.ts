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
import { generateRangeTitle } from '../lib/common';

export type HomeDisplayType = {
  title: string,
  valueParsed: string,
  monetaryValue: string,
  currencyCode: string,
}

export type AssetAccountType = {
  title: string,
  valueParsed: string,
  skip: boolean,
  color: string,
  colorScheme: string,
  entries: { x: string, y: string }[],
  maxY: number,
  minY: number,
}

export type FireflyStateType = {
  rangeDetails: RangeDetailsType,
  netWorth: HomeDisplayType[],
  spent: HomeDisplayType[],
  earned: HomeDisplayType[],
  balance: HomeDisplayType[],
  accounts: AssetAccountType[],
}

export type RangeDetailsType = {
  title: string,
  range: number,
  start: string,
  end: string,
}

const formatDateToYYYYMMDD = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

const getCurrentQuarterStartDate = (): string => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  const quarterStartMonth = Math.floor(currentMonth / 3) * 3;
  const startDate = new Date(currentYear, quarterStartMonth, 1);

  return formatDateToYYYYMMDD(startDate);
};

const getCurrentQuarterEndDate = (): string => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  const quarterEndMonth = Math.floor(currentMonth / 3) * 3 + 2;
  const lastDayOfMonth = new Date(currentYear, quarterEndMonth + 1, 0).getDate();
  const endDate = new Date(currentYear, quarterEndMonth, lastDayOfMonth);

  return formatDateToYYYYMMDD(endDate);
};

const INITIAL_STATE = {
  rangeDetails: {
    title: generateRangeTitle(3, getCurrentQuarterStartDate(), getCurrentQuarterEndDate()),
    range: 3,
    start: getCurrentQuarterStartDate(),
    end: getCurrentQuarterEndDate(),
  },
  netWorth: [],
  spent: [],
  earned: [],
  balance: [],
  accounts: [],
} as FireflyStateType;

export default createModel<RootModel>()({

  state: INITIAL_STATE,

  reducers: {
    setData(state, payload) {
      const {
        netWorth = state.netWorth,
        balance = state.balance,
        accounts = state.accounts,
      } = payload;

      return {
        ...state,
        netWorth,
        balance,
        accounts,
      };
    },

    setRangeDetails(state, rangeDetails: RangeDetailsType) {
      return {
        ...state,
        rangeDetails,
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

    resetState() {
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
      if (rootState.firefly.rangeDetails === undefined) {
        dispatch.firefly.resetState();
      }
      const {
        firefly: {
          rangeDetails: {
            range: oldRange,
            start: oldStart,
            end: oldEnd,
          },
        },
      } = rootState;
      const {
        range = oldRange,
        direction,
      } = payload;
      let start;
      let end;

      const rangeInt = parseInt(range, 10);

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
            end = `${today.getFullYear()}-${(month + 1).toString().padStart(2, '0')}-28`;
            end = moment(end).endOf('M').format('YYYY-MM-DD');
            break;
          case 3:
            start = `${today.getFullYear()}-${((quarter * 3) + 1).toString().padStart(2, '0')}-01`;
            end = `${today.getFullYear()}-${((quarter + 1) * 3).toString().padStart(2, '0')}-28`;
            end = moment(end).endOf('M').format('YYYY-MM-DD');
            break;
          case 6:
            start = `${today.getFullYear()}-${semi === 1 ? '01' : '07'}-01`;
            end = `${today.getFullYear()}-${semi === 1 ? '06' : '12'}-28`;
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

      const title: string = generateRangeTitle(rangeInt, start, end);

      console.log('RANGE', range, title);
      console.log('DATE', start, end);

      dispatch.firefly.setRangeDetails({
        title,
        range,
        start,
        end,
      });
    },

    /**
     * Get home net worth
     *
     * @returns {Promise}
     */
    async getNetWorth(_: void, rootState) {
      const {
        firefly: {
          rangeDetails: {
            start,
            end,
          },
        },
        currencies: {
          current,
        },
      } = rootState;
      if (current && current.attributes.code) {
        const params = new URLSearchParams({
          start,
          end,
          currency_code: current?.attributes.code,
        });
        const summary = await dispatch.configuration.apiFetch({ url: `/api/v1/summary/basic?${params.toString()}` });
        const netWorth = [];
        const balance = [];
        Object.keys(summary).forEach((key) => {
          if (key.includes('net-worth-in')) {
            netWorth.push(summary[key]);
          }
          if (key.includes('balance-in')) {
            balance.push(summary[key]);
          }
        });

        this.setData({
          netWorth,
          balance,
        });
      }
    },

    /**
     * Get the dashboard summary
     *
     * @returns {Promise}
     */
    async getAccountChart(_: void, rootState) {
      const {
        firefly: {
          rangeDetails: {
            range,
            start,
            end,
          },
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
        accounts[index].entries = range > 3 ? Object.keys(v.entries)
          .filter((e, i) => i % 2 === 0)
          .filter((e, i) => i % 2 === 0)
          .filter((e, i) => i % 2 === 0)
          .map((key) => {
            const value = parseFloat(accounts[index].entries[key]);
            const date = new Date(key);

            return {
              x: +date,
              y: value,
            };
          })
          : Object.keys(v.entries).map((key) => {
            const value = parseFloat(accounts[index].entries[key]);
            const date = new Date(key);

            return {
              x: +date,
              y: value,
            };
          });
        accounts[index].maxY = maxBy(accounts[index].entries, (o: { x: string, y: string }) => (o.y)).y;
        accounts[index].minY = minBy(accounts[index].entries, (o: { x: string, y: string }) => (o.y)).y;
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
