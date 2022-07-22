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

export type ApiAccountType = {
  data: AccountType[],
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

    resetConfiguration() {
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
      let { data: accounts, meta } = await dispatch.configuration.apiFetch({ url: '/api/v1/accounts?page=1' });

      const {
        pagination: {
          total_pages: totalPages,
        },
      } = meta;

      // /!\ TODO: implement search select with /autocomplete endpoints https://api-docs.firefly-iii.org/#/autocomplete/getAccountsAC
      if (totalPages > 1) {
        const promises: Promise<ApiAccountType>[] = [];
        for (let i = 2; i < totalPages + 1; i += 1) {
          promises.push(dispatch.configuration.apiFetch({ url: `/api/v1/accounts?page=${i}` }));
        }

        const pageAccounts = await Promise.all(promises);

        pageAccounts.forEach((a) => {
          const { data } = a;

          accounts = [...accounts, ...data];
        });

        dispatch.accounts.setAccounts({ accounts });
        return;
      }

      dispatch.accounts.setAccounts({ accounts });
    },
  }),
});
