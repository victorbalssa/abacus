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
          current,
        },
        firefly: {
          rangeDetails: {
            end,
          },
        },
      } = rootState;

      if (current && current.attributes.code) {
        const { data: accounts } = await dispatch.configuration.apiFetch({ url: `/api/v1/currencies/${current.attributes.code}/accounts?type=asset&date=${end}` });

        dispatch.accounts.setAccounts({ accounts });
      }
    },
  }),
});
