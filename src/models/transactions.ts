import { createModel } from '@rematch/core';
import { RootModel } from './index';

export type TransactionSplitType = {
  description: string,
  amount: string,
  currency_decimal_places: number,
  type: string,
  category_name: string,
  currency_symbol: string,
  date: string,
  source_name: string,
  destination_name: string,
}

export type TransactionType = {
  attributes: {
    name: string,
    transactions: TransactionSplitType[],
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
  page: number,
  totalPages: number,
}

const INITIAL_STATE = {
  transactions: [],
  page: 1,
  totalPages: 1,
} as TransactionStateType;

export default createModel<RootModel>()({

  state: INITIAL_STATE,

  reducers: {
    setTransactions(state, payload): TransactionStateType {
      const {
        transactions = state.transactions,
        page = state.page,
        totalPages = state.totalPages,
      } = payload;

      return {
        ...state,
        page,
        totalPages,
        transactions,
      };
    },

    resetState() {
      return INITIAL_STATE;
    },
  },

  effects: (dispatch) => ({
    /**
     * Get transactions list
     *
     * @returns {Promise}
     */
    async getTransactions(_: void, rootState): Promise<void> {
      const {
        firefly: {
          start,
          end,
        },
        currencies: {
          current,
        },
      } = rootState;

      const type = 'all';
      const currentPage = 1;
      const {
        data: transactions,
        meta,
      } = await dispatch.configuration.apiFetch({ url: `/api/v1/currencies/${current?.attributes.code}/transactions?page=${currentPage}&start=${start}&end=${end}&type=${type}` });

      dispatch.transactions.setTransactions({
        transactions,
        page: meta.pagination.current_page,
        totalPages: meta.pagination.total_pages,
      });
    },

    /**
     * Get transactions list
     *
     * @returns {Promise}
     */
    async getMoreTransactions(_: void, rootState): Promise<void> {
      const {
        firefly: {
          start,
          end,
        },
        transactions: {
          transactions: oldTransactions,
          page = 1,
          totalPages = 1,
        },
        currencies: {
          current,
        },
      } = rootState;

      const type = 'all';
      const currentPage = (page < totalPages) ? page + 1 : 1;
      if (page < totalPages) {
        const {
          data: transactions,
          meta,
        } = await dispatch.configuration.apiFetch({ url: `/api/v1/currencies/${current?.attributes.code}/transactions?page=${currentPage}&start=${start}&end=${end}&type=${type}` });

        dispatch.transactions.setTransactions({
          transactions: (page < totalPages) ? [...oldTransactions, ...transactions] : transactions,
          page: meta.pagination.current_page,
          totalPages: meta.pagination.total_pages,
        });
      }
    },

    /**
     * Create transactions
     *
     * @returns {Promise}
     */
    async createTransactions(payload, rootState) {
      const body = {
        transactions: [{
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
          amount: payload.amount.replace(/,/g, '.'),
        }],
        error_if_duplicate_hash: false,
        apply_rules: true,
        fire_webhooks: true,
      };

      const data = await dispatch.configuration.apiPost({ url: '/api/v1/transactions', body });

      return data;
    },

    /**
     * Create transactions
     *
     * @returns {Promise}
     */
    async updateTransactions(payload, rootState) {
      const {
        id,
        transaction,
      } = payload;
      const body = {
        transactions: [{
          // TODO: Add support for:
          /* budget_id: '4', */
          /* category_id: '43', */
          /* piggy_bank_id: '2', */
          /* tags: 'test abaccus', */
          /* notes: 'test abaccus notes', */
          /* currency_id: '12', */
          /* foreign_amount: '123.45', */
          /* foreign_currency_id: '17', */

          ...transaction,
        }],
      };

      const data = await dispatch.configuration.apiPut({ url: `/api/v1/transactions/${id}`, body });

      return data;
    },

    /**
     * Delete transactions
     *
     * @returns {Promise}
     */
    async deleteTransaction(id, rootState) {
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
