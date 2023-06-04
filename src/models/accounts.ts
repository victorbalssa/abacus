import { createModel } from '@rematch/core';
import { RootModel } from './index';

export type AccountType = {
  attributes: {
    account_number: string,
    account_role: string,
    active: boolean,
    bic: null,
    created_at: Date,
    credit_card_type: string,
    currency_code: string,
    currency_decimal_places: number,
    currency_id: string,
    currency_symbol: string,
    current_balance: string,
    current_balance_date: Date,
    current_debt: string,
    iban: string,
    include_net_worth: boolean,
    interest: string,
    interest_period: string,
    liability_direction: string,
    liability_type: string,
    latitude: string,
    longitude: string,
    monthly_payment_date: string,
    name: string,
    notes: string,
    opening_balance: string,
    opening_balance_date: string,
    order: number,
    type: string,
    updated_at: Date,
    virtual_balance: string,
    zoom_level: null,
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

export type AutocompleteAccount = {
  id: string,
  name: string,
  name_with_balance: string,
  type: string,
  currency_id: string,
  currency_name: string,
  currency_code: string,
  currency_symbol: string,
  currency_decimal_places: number,
}

export type AutocompleteDescription = {
  id: string,
  name: string,
  description: string,
}

export type AccountStateType = {
  accounts: AccountType[],
  autocompleteAccounts: AutocompleteAccount[],
  autocompleteDescriptions: AutocompleteDescription[],
}

const INITIAL_STATE = {
  accounts: [],
  autocompleteAccounts: [],
  autocompleteDescriptions: [],
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

    setAutocompleteAccounts(state, payload): AccountStateType {
      const {
        autocompleteAccounts = state.autocompleteAccounts,
      } = payload;

      return {
        ...state,
        autocompleteAccounts,
      };
    },

    setAutocompleteDescriptions(state, payload): AccountStateType {
      const {
        autocompleteDescriptions = state.autocompleteDescriptions,
      } = payload;

      return {
        ...state,
        autocompleteDescriptions,
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
          current,
        },
        firefly: {
          end,
        },
      } = rootState;

      if (current && current.attributes.code) {
        const { data: accounts } = await dispatch.configuration.apiFetch({ url: `/api/v1/currencies/${current.attributes.code}/accounts?type=asset&date=${end}` });

        dispatch.accounts.setAccounts({ accounts });
      }
    },

    /**
     * Get autocomplete accounts with query
     *
     * @returns {Promise}
     */
    async getAutocompleteAccounts(payload): Promise<void> {
      const limit = 9;
      const {
        query,
        isDestination,
      } = payload;
      const type = isDestination ? 'Expense%20account' : 'Revenue%20account';
      const autocompleteAccounts = await dispatch.configuration.apiFetch(
        { url: `/api/v1/autocomplete/accounts?types=Asset%20account,${type},Loan,Debt,Mortgage&limit=${limit}&query=${encodeURIComponent(query)}` },
      );

      dispatch.accounts.setAutocompleteAccounts({ autocompleteAccounts });
    },

    /**
     * Get autocomplete accounts with query
     *
     * @returns {Promise}
     */
    async getAutocompleteDescriptions(payload): Promise<void> {
      const limit = 9;
      const {
        query,
      } = payload;
      const autocompleteDescriptions = await dispatch.configuration.apiFetch(
        { url: `/api/v1/autocomplete/transactions?limit=${limit}&query=${query}` },
      );

      dispatch.accounts.setAutocompleteDescriptions({ autocompleteDescriptions });
    },
  }),
});
