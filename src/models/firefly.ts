import { createModel } from '@rematch/core';
import moment from 'moment';
import { exchangeCodeAsync, refreshAsync } from 'expo-auth-session';
import { maxBy, minBy } from 'lodash';
import semver from 'semver';
import axios from 'axios';
import {
  discovery,
  redirectUri,
  addCredential,
} from '../lib/oauth';
import colors from '../constants/colors';
import { RootModel } from './index';
import { generateRangeTitle } from '../lib/common';
import { AccountType } from './accounts';
import { TCredential } from '../types/credential';

export type HomeDisplayType = {
  title: string,
  valueParsed: string,
  monetaryValue: string,
  currencyCode: string,
}

export type AssetAccountType = {
  title: string,
  label: string,
  currencyCode: string,
  currencySymbol: string,
  valueParsed: string,
  color: string,
  colorScheme: string,
  entries: { x: number, y: number }[],
  maxY: number,
  minY: number,
}

export type BalanceType = {
  label: 'earned' | 'spent',
  currencyCode: string,
  entries: { [timestamp: string]:string }[],
}

export type FireflyStateType = {
  rangeDetails: RangeDetailsType,
  netWorth: HomeDisplayType[],
  spent: HomeDisplayType[],
  earned: HomeDisplayType[],
  balance: HomeDisplayType[],
  accounts: AssetAccountType[],
  bills: { paid: HomeDisplayType | null, unpaid: HomeDisplayType | null },
  earnedChart: { x: number, y: number }[],
  spentChart:{ x: number, y: number }[],
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
  earnedChart: [],
  spentChart: [],
  bills: { paid: null, unpaid: null },
} as FireflyStateType;

export default createModel<RootModel>()({

  state: INITIAL_STATE,

  reducers: {
    setData(state, payload) {
      const {
        netWorth = state.netWorth,
        balance = state.balance,
        spent = state.spent,
        earned = state.earned,
        accounts = state.accounts,
        earnedChart = state.earnedChart,
        spentChart = state.spentChart,
        bills = state.bills,
      } = payload;

      return {
        ...state,
        netWorth,
        balance,
        spent,
        earned,
        accounts,
        earnedChart,
        spentChart,
        bills,
      };
    },

    setRangeDetails(state, rangeDetails: RangeDetailsType) {
      return {
        ...state,
        rangeDetails,
      };
    },

    resetState() {
      return INITIAL_STATE;
    },
  },

  effects: (dispatch) => ({
    async setRange(payload, rootState): Promise<void> {
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

      let start: string;
      let end: string;

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

      // console.log('RANGE', range, title);
      // console.log('DATE', start, end);

      dispatch.firefly.setRangeDetails({
        title,
        range,
        start,
        end,
      });
    },

    async getNetWorth(_: void, rootState): Promise<void> {
      const {
        firefly: {
          rangeDetails: {
            start,
            end,
          },
        },
        currencies: {
          currentCode,
        },
      } = rootState;
      if (currentCode) {
        const params = new URLSearchParams({
          start,
          end,
          currency_code: currentCode,
        });
        const { data: summary } = await dispatch.configuration.apiFetch({ url: `/api/v1/summary/basic?${params.toString()}` });
        const netWorth = [];
        const balance = [];
        const earned = [];
        const spent = [];
        const bills = { paid: null, unpaid: null };
        Object.keys(summary).forEach((key) => {
          if (key.includes('net-worth-in')) {
            netWorth.push(summary[key]);
          }
          if (key.includes('balance-in')) {
            balance.push(summary[key]);
          }
          if (key.includes('earned-in')) {
            earned.push(summary[key]);
          }
          if (key.includes('spent-in')) {
            spent.push(summary[key]);
          }
          if (key.includes('bills-paid-in')) {
            bills.paid = summary[key];
          }
          if (key.includes('bills-unpaid-in')) {
            bills.unpaid = summary[key];
          }
        });

        dispatch.firefly.setData({
          netWorth,
          balance,
          earned,
          spent,
          bills,
        });
      }
    },

    async getAccountChart(_: void, rootState): Promise<void> {
      const {
        firefly: {
          rangeDetails: {
            range,
            start,
            end,
          },
        },
        currencies: {
          currentCode,
        },
        accounts: {
          selectedAccountIds,
        },
      } = rootState;

      const accountIdsParam = (selectedAccountIds && selectedAccountIds.length > 0) ? `&accounts[]=${selectedAccountIds.join('&accounts[]=')}` : '';
      const { data: accounts } = await dispatch.configuration.apiFetch({ url: `/api/v1/chart/account/overview?start=${start}&end=${end}${accountIdsParam}` }) as { data: AssetAccountType[] };
      let colorIndex = 0;

      accounts
        .forEach((v, index) => {
          if (colorIndex >= 6) {
            colorIndex = 0;
          }
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
          accounts[index].maxY = maxBy(accounts[index].entries, (o: { x: number, y: number }) => (o.y)).y;
          accounts[index].minY = minBy(accounts[index].entries, (o: { x: number, y: number }) => (o.y)).y;
        });

      dispatch.firefly.setData({ accounts: accounts.filter((account) => account.currencyCode === currentCode) });
    },

    async getBalanceChart(_: void, rootState): Promise<void> {
      const {
        firefly: {
          rangeDetails: {
            start,
            end,
          },
        },
        currencies: {
          currentCode,
        },
        configuration: {
          apiVersion,
        },
      } = rootState;

      try {
        const apiSemverMinimum = '2.0.9';
        const { data: accounts } = await dispatch.configuration.apiFetch({ url: `/api/v1/accounts?type=asset&date=${end}` }) as { data: AccountType[]};
        if (!semver.gte(apiVersion, apiSemverMinimum) || accounts.length === 0) {
          this.setData({ earnedChart: [], spentChart: [] });
          return;
        }

        const accountIdsParam = accounts.map((a) => a.id).join('&accounts[]=');
        const { data: balances } = await dispatch.configuration.apiFetch({ url: `/api/v2/chart/balance/balance?start=${start}&end=${end}&accounts[]=${accountIdsParam}&period=1M` }) as { data: BalanceType[] };

        const earnedChartEntries = balances.filter((balance) => balance.currencyCode === currentCode && balance.label === 'earned')[0]?.entries;

        if (earnedChartEntries) {
          this.setData({
            earnedChart: Object.keys(earnedChartEntries).map((key) => {
              const value = parseFloat(earnedChartEntries[key]);

              return {
                x: key,
                y: value,
              };
            }),
          });
        } else {
          this.setData({ earnedChart: [] });
        }

        const spentChartEntries = balances.filter((balance) => balance.currencyCode === currentCode && balance.label === 'spent')[0]?.entries;

        if (spentChartEntries) {
          this.setData({
            spentChart: Object.keys(spentChartEntries).map((key) => {
              const value = parseFloat(spentChartEntries[key]);

              return {
                x: key,
                y: value,
              };
            }),
          });
        } else {
          this.setData({ spentChart: [] });
        }
      } catch (error) {
        this.setData({ earnedChart: [], spentChart: [] });
      }
    },

    async getFreshAccessToken(credential: TCredential): Promise<void> {
      const response = await refreshAsync(
        {
          clientId: credential.oauthClientId,
          refreshToken: credential.refreshToken,
          extraParams: {
            client_secret: credential.oauthClientSecret,
          },
        },
        discovery(credential.backendURL),
      );

      if (!response.accessToken) {
        throw new Error('Failed to get accessToken with the refresh token. Please restart the Sign In process.');
      }

      const newCredential = { ...credential };
      newCredential.accessToken = response.accessToken;
      newCredential.refreshToken = response.refreshToken;
      newCredential.accessTokenExpiresIn = (response.issuedAt && response.expiresIn)
        ? (response.issuedAt + response.expiresIn + -600).toString() : '';
      await addCredential(newCredential);

      // set backend url and access token for this session
      axios.defaults.headers.Authorization = `Bearer ${response.accessToken}`;
    },

    async getNewAccessToken(payload): Promise<void> {
      const {
        backendURL,
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

      // test personal token and get user email
      axios.defaults.headers.Authorization = `Bearer ${response.accessToken}`;
      dispatch.configuration.setBackendURL(backendURL);
      const email = await dispatch.configuration.getCurrentUserEmail();

      const credential: TCredential = {
        email,
        backendURL,
        accessToken: response.accessToken,
        accessTokenExpiresIn: (response.issuedAt && response.expiresIn)
          ? (response.issuedAt + response.expiresIn + -600).toString() : '',
        oauthClientId,
        oauthClientSecret,
        refreshToken: response.refreshToken,
      };

      await addCredential(credential);
    },

  }),
});
