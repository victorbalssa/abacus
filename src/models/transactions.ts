import { createModel } from '@rematch/core';
import { RootModel } from './index';

export type TransactionType = {
  attributes: {
    name: string,
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

export type TransactionStateType = {
  transactions: TransactionType[],
}

const INITIAL_STATE = {
  transactions: [],
} as TransactionStateType;

export default createModel<RootModel>()({

  state: INITIAL_STATE,

  reducers: {
    setTransactions(state, payload): TransactionStateType {
      const {
        transactions = state.transactions,
      } = payload;

      return {
        ...state,
        transactions,
      };
    },

    resetConfiguration() {
      return INITIAL_STATE;
    },
  },

  effects: (dispatch) => ({
    /**
     * Get transactions list
     *
     * @returns {Promise}
     */
    async getTransactions(): Promise<void> {
      const { data: transactions } = await dispatch.configuration.apiFetch({ url: '/api/v1/transactions' });

      dispatch.transactions.setTransactions({ transactions });
    },

    /**
     * Create transactions
     *
     * @returns {Promise}
     */
    async createTransactions(payload, rootState) {
      console.log(payload);
      const body = {
        transactions: [{
          type: 'deposit',

          /*budget_id: '4',*/
          /*category_id: '43',*/

          /*piggy_bank_id: '2',*/
          tags: 'test abaccus',
          notes: 'test abaccus notes',

          /*currency_id: '12',*/

          /*foreign_amount: '123.45',*/
          /*foreign_currency_id: '17',*/

          ...payload,
        }],
        error_if_duplicate_hash: false,
        apply_rules: true,
        fire_webhooks: true,
      };

      const data = await dispatch.configuration.apiPost({ url: '/api/v1/transactions', body });
      console.log(data);

      return data;
    },

  }),
});
