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
    latitude: string,
    liability_direction: string,
    liability_type: string,
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

export type AutocompleteAccounts = {
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

export type ApiAccountType = {
  data: AccountType[],
}

export type AccountStateType = {
  accounts: AccountType[],
  autocompleteAccounts: AutocompleteAccounts[],
}

const INITIAL_STATE = {
  accounts: [],
  autocompleteAccounts: [],
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
    async getAccounts(): Promise<void> {
      const accounts = await dispatch.configuration.apiFetch({ url: '/api/v1/accounts?page=1' });

      dispatch.accounts.setAccounts({ accounts });
    },

    /**
     * Get autocomplete accounts with query
     *
     * @returns {Promise}
     */
    async getAutocompleteAccounts(payload): Promise<void> {
      const limit = 5;
      const {
        query,
        isDestination,
      } = payload;
      const type = isDestination ? 'Expense%20account' : 'Revenue%20account';
      const autocompleteAccounts = await dispatch.configuration.apiFetch(
        { url: `/api/v1/autocomplete/accounts?types=Asset%20account,${type},Loan,Debt,Mortgage&limit=${limit}&query=${query}` },
      );

      console.log('autocompleteAccounts', autocompleteAccounts);

      dispatch.accounts.setAutocompleteAccounts({ autocompleteAccounts });
    },
  }),
});
