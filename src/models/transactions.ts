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
    async getTransactions(payload, rootState): Promise<void> {
      const {
        firefly: {
          start,
          end,
        },
      } = rootState;

      const type = 'all';
      const page = 1;
      const { data: transactions, meta } = await dispatch.configuration.apiFetch({ url: `/api/v1/transactions?page=${page}&start=${start}&end=${end}&type=${type}` });

      console.log(meta);

      dispatch.transactions.setTransactions({ transactions });
    },

    /**
     * Create transactions
     *
     * @returns {Promise}
     */
    async createTransactions(payload, rootState) {
      const body = {
        transactions: [{
          type: 'deposit',

          // TODO: Add support for:
          /* budget_id: '4', */
          /* category_id: '43', */
          /* piggy_bank_id: '2', */
          /* tags: 'test abaccus', */
          /* notes: 'test abaccus notes', */
          /* currency_id: '12', */
          /* foreign_amount: '123.45', */
          /* foreign_currency_id: '17', */

          ...payload,
        }],
        error_if_duplicate_hash: false,
        apply_rules: true,
        fire_webhooks: true,
      };

      const data = await dispatch.configuration.apiPost({ url: '/api/v1/transactions', body });

      return data;
    },

    /**
     * Delete transactions
     *
     * @returns {Promise}
     */
    async deleteTransaction(payload, rootState) {
      const {
        id,
      } = payload;
      const {
        transactions: {
          transactions,
        },
      } = rootState;
      const newTransactions = [...transactions];
      const prevIndex = transactions.findIndex((item) => item.id === id);
      newTransactions.splice(prevIndex, 1);

      const data = await dispatch.configuration.apiDelete({ url: `/api/v1/transactions/${id}` });

      dispatch.transactions.setTransactions({ transactions: newTransactions });

      return data;
    },

  }),
});
