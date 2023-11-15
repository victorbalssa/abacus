import { createModel } from '@rematch/core';
import { RootModel } from './index';

export type AccountType = {
  attributes: {
    accountNumber: string,
    accountRole: string,
    active: boolean,
    bic: null,
    createdAt: Date,
    creditCardType: string,
    currencyCode: string,
    currencyDecimalPlaces: number,
    currencyId: string,
    currencySymbol: string,
    currentBalance: string,
    currentBalanceDate: Date,
    currentDebt: string,
    iban: string,
    includeNetWorth: boolean,
    interest: string,
    interestPeriod: string,
    liabilityDirection: string,
    liabilityType: string,
    latitude: string,
    longitude: string,
    monthlyPaymentDate: string,
    name: string,
    notes: string,
    openingBalance: string,
    openingBalanceDate: string,
    order: number,
    type: string,
    updatedAt: Date,
    virtualBalance: string,
    zoomLevel: null,
  },
  id: string,
  links: {
    0: {
      rel: string,
      uri: string,
    },
    self: string,
  },
  type: string,
}

export type AccountStateType = {
  accounts: AccountType[],
}

const INITIAL_STATE = {
  accounts: [],
} as AccountStateType;

export default createModel<RootModel>()({

  state: INITIAL_STATE,

  reducers: {
    setAccounts(state, payload): AccountStateType {
      const {
        accounts = state.accounts,
      } = payload;

      return {
        ...state,
        accounts,
      };
    },

    resetState() {
      return INITIAL_STATE;
    },
  },

  effects: (dispatch) => ({
    /**
     * Get accounts list
     *
     * @returns {Promise}
     */
    async getAccounts(_: void, rootState): Promise<void> {
      const {
        currencies: {
          currentCode,
        },
        firefly: {
          rangeDetails: {
            end,
          },
        },
        configuration: {
          displayAllAccounts = false,
        },
      } = rootState;

      if (currentCode) {
        const { data: accounts } = await dispatch.configuration.apiFetch({ url: `/api/v1/currencies/${currentCode}/accounts?${displayAllAccounts ? '' : 'type=asset'}&date=${end}` }) as { data: AccountType[]};

        const filteredAccounts = accounts
          .filter((a: AccountType) => a.attributes.active)
          .sort((a, b) => ((parseFloat(b.attributes.currentBalance) > parseFloat(a.attributes.currentBalance)) ? 1 : -1));

        dispatch.accounts.setAccounts({ accounts: filteredAccounts });
      }
    },
  }),
});
