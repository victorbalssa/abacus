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
  display: boolean,
  links: {
    0: {
      rel: string,
      uri: string,
    },
    self: string,
  },
  type: string,
}

export type PreferenceType = {
  attributes: {
    createdAt: Date,
    data: number[],
  },
  id: string,
  type: string,
}

export type AccountStateType = {
  accounts: AccountType[],
  selectedAccountIds: number[],
}

const INITIAL_STATE = {
  accounts: [],
  selectedAccountIds: [],
} as AccountStateType;

export default createModel<RootModel>()({

  state: INITIAL_STATE,

  reducers: {
    setAccounts(state: AccountStateType, payload): AccountStateType {
      const {
        accounts = state.accounts,
      } = payload;

      return {
        ...state,
        accounts,
      };
    },

    setSelectedAccountIds(state: AccountStateType, id: number): AccountStateType {
      const { selectedAccountIds } = state;

      if (selectedAccountIds?.includes(id)) {
        return {
          ...state,
          selectedAccountIds: selectedAccountIds?.filter((d) => d !== id),
        };
      }
      return {
        ...state,
        selectedAccountIds: [...selectedAccountIds || [], id],
      };
    },

    resetSelectedAccountIds(state: AccountStateType): AccountStateType {
      return {
        ...state,
        selectedAccountIds: [],
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
        const [
          { data: accounts },
          { data: frontpageAccounts },
        ] = await Promise.all([
          dispatch.configuration.apiFetch({ url: `/api/v1/currencies/${currentCode}/accounts?${displayAllAccounts ? '' : 'type=asset'}&date=${end}` }) as Promise<{ data: AccountType[] }>,
          dispatch.configuration.apiFetch({ url: '/api/v1/preferences/frontpageAccounts' }) as Promise<{ data: PreferenceType }>,
        ]);
        const filteredAccounts = accounts
          .filter((a: AccountType) => a.attributes.active)
          .filter((a: AccountType) => a.attributes.type != "initial-balance")
          .sort((a, b) => (b.attributes.name < a.attributes.name ? 1 : -1));
        const accountMap = filteredAccounts.map((account, index) => account.attributes.currentBalance)
        if (frontpageAccounts) {
          accounts.forEach((a: AccountType, index) => {
            accounts[index].display = frontpageAccounts.attributes.data.includes(parseInt(a.id, 10));
          });
        }

        dispatch.accounts.setAccounts({ accounts: filteredAccounts });
      }
    },
  }),
});
