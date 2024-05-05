import { createModel } from '@rematch/core';
import { AxiosResponse } from 'axios';
import { RootModel } from './index';
import translate from '../i18n/locale';

export type TransactionSplitType = {
  order?: number
  description: string,
  amount: string,
  type: string,
  categoryId: string,
  categoryName: string,
  budgetId: string,
  budgetName: string,
  currencyCode: string,
  currencySymbol: string,
  currencyDecimalPlaces?: number,
  date: string | Date,
  sourceName: string,
  destinationName: string,
  tags: string[],
  notes: string,
  foreignAmount: string,
  foreignCurrencyId: string,
  foreignCurrencyCode?: string,
  billId: string,
  billName: string,
}

export type TransactionType = {
  id: string
  type: string
  attributes: {
    groupTitle: string
    transactions: TransactionSplitType[]
    user: string
    createdAt: string
    updatedAt: string
  },
}

export type TransactionStateType = {
  transactionPayload: {
    title: string
    transactions: TransactionSplitType[]
  },
  page: number
  totalPages: number
}

export type ErrorStateType = {
  description: string
  sourceName: string
  destinationName: string
  amount: string
  categoryId: string
  budgetId: string
  tags: string
  foreignCurrencyId: string
  foreignAmount: string
  notes: string
}

export type GetTransactionsPayload = {
  type: '' | 'withdrawal' | 'deposit' | 'transfer'
  search?: string
  start?: Date
  end?: Date
  currentCode?: string
  account?: string
}

export const initialSplit = () => ({
  type: 'withdrawal',
  amount: '',
  currencyCode: '',
  currencySymbol: '',
  date: new Date(),
  description: '',
  foreignCurrencyId: '',
  foreignAmount: '',
  sourceName: '',
  destinationName: '',
  categoryName: '',
  categoryId: '',
  budgetName: '',
  budgetId: '',
  tags: [],
  notes: '',
  billId: '',
  billName: '',
}) as TransactionSplitType;

export const types = [
  {
    type: 'withdrawal',
    name: translate('transaction_form_type_withdraw'),
  },
  {
    type: 'deposit',
    name: translate('transaction_form_type_deposit'),
  },
  {
    type: 'transfer',
    name: translate('transaction_form_type_transfer'),
  },
];

const INITIAL_STATE = {
  page: 1,
  totalPages: 1,
  transactionPayload: null,
} as TransactionStateType;

export default createModel<RootModel>()({

  state: INITIAL_STATE,

  reducers: {
    setMetaPagination(state, payload): TransactionStateType {
      const {
        page = state.page,
        totalPages = state.totalPages,
      } = payload;

      return {
        ...state,
        page,
        totalPages,
      };
    },
    setGroupTitle(state, title): TransactionStateType {
      const {
        transactionPayload,
      } = state;

      return {
        ...state,
        transactionPayload: {
          ...transactionPayload,
          title,
        },
      };
    },
    setTransactionSplitByIndex(state, index, split): TransactionStateType {
      const {
        transactionPayload,
      } = state;

      const newTransactions = [...transactionPayload.transactions];
      newTransactions[index] = split;

      return {
        ...state,
        transactionPayload: {
          ...transactionPayload,
          transactions: newTransactions,
        },
      };
    },
    addTransactionSplit(state): TransactionStateType {
      const {
        transactionPayload,
      } = state;

      return {
        ...state,
        transactionPayload: {
          ...transactionPayload,
          transactions: [
            ...transactionPayload.transactions,
            initialSplit(),
          ],
        },
      };
    },
    deleteTransactionSplit(state, index): TransactionStateType {
      const {
        transactionPayload,
      } = state;

      return {
        ...state,
        transactionPayload: {
          ...transactionPayload,
          transactions: transactionPayload.transactions.filter((_, i) => i !== index),
        },
      };
    },
    setTransaction(state, payload): TransactionStateType {
      const {
        splits,
        title,
      } = payload;

      return {
        ...state,
        transactionPayload: {
          title,
          transactions: splits,
        },
      };
    },
    resetTransaction(state, payload): TransactionStateType {
      const {
        splits,
        title,
      } = payload;

      return {
        ...state,
        transactionPayload: {
          title,
          transactions: splits.length ? splits.map((split) => ({
            ...split,
            date: new Date(split.date),
            amount: split.amount ? parseFloat(split.amount).toFixed(2) : '',
            foreignAmount: split.foreignAmount ? parseFloat(split.foreignAmount).toFixed(2) : '',
          })) : [{ ...initialSplit() }],
        },
      };
    },
    resetState() {
      return INITIAL_STATE;
    },
  },

  effects: (dispatch) => ({
    async getTransactions(payload: GetTransactionsPayload): Promise<TransactionType[]> {
      const {
        type,
        start,
        account,
        currentCode,
        search: searchQuery,
      } = payload;

      const currentPage = 1;
      const todayInOneMonth = new Date();
      todayInOneMonth.setMonth(new Date().getMonth() + 1);
      const inOneMonth = todayInOneMonth.toISOString().split('T')[0];
      let search = searchQuery || ' ';
      search += ` date_after:${start.toISOString().split('T')[0]} date_before:${inOneMonth}`;
      search += (currentCode) ? ` currency_is:${currentCode}` : '';
      search += (type) ? ` type:${type}` : '';
      search += (account) ? ` account_contains:"${account}"` : '';

      const {
        data: transactions,
        meta,
      } = await dispatch.configuration.apiFetch({ url: `/api/v1/search/transactions?limit=15&page=${currentPage}&query=${search}` }) as {
        data: TransactionType[],
        meta
      };

      dispatch.transactions.setMetaPagination({
        page: meta.pagination.currentPage,
        totalPages: meta.pagination.totalPages,
      });

      return transactions;
    },

    async getMoreTransactions(payload: GetTransactionsPayload, rootState): Promise<TransactionType[]> {
      const {
        transactions: {
          page = 1,
          totalPages = 1,
        },
      } = rootState;

      const {
        type,
        start,
        account,
        currentCode,
        search: searchQuery,
      } = payload;

      const currentPage = (page < totalPages) ? page + 1 : 1;
      if (page < totalPages) {
        const todayInOneMonth = new Date();
        todayInOneMonth.setMonth(new Date().getMonth() + 1);
        const inOneMonth = todayInOneMonth.toISOString().split('T')[0];
        let search = searchQuery || ' ';
        search += ` date_after:${start.toISOString().split('T')[0]} date_before:${inOneMonth}`;
        search += (currentCode) ? ` currency_is:${currentCode}` : '';
        search += (type) ? ` type:${type}` : '';
        search += (account) ? ` account_contains:"${account}"` : '';

        const {
          data: transactions,
          meta,
        } = await dispatch.configuration.apiFetch({ url: `/api/v1/search/transactions?limit=15&page=${currentPage}&query=${search}` }) as {
          data: TransactionType[],
          meta
        };

        dispatch.transactions.setMetaPagination({
          page: meta.pagination.currentPage,
          totalPages: meta.pagination.totalPages,
        });

        return transactions;
      }

      return [];
    },

    async upsertTransaction({ id = '-1' }, rootState): Promise<AxiosResponse> {
      const {
        transactions: {
          transactionPayload: {
            title,
            transactions,
          },
        },
      } = rootState;

      const body = {
        group_title: title,
        transactions: transactions.map((transaction) => ({
          tags: transaction.tags,
          notes: transaction.notes,
          foreign_amount: transaction.foreignAmount ? parseFloat(transaction.foreignAmount.replace(',', '.')) : null,
          foreign_currency_id: transaction.foreignCurrencyId,
          description: transaction.description,
          date: transaction.date,
          source_name: transaction.sourceName,
          destination_name: transaction.destinationName,
          category_id: transaction.categoryName === '' ? undefined : transaction.categoryId,
          category_name: transaction.categoryName,
          budget_id: transaction.budgetId,
          budget_name: transaction.budgetName,
          type: transaction.type,
          amount: transaction.amount ? parseFloat(transaction.amount.replace(',', '.')) : 0,
          bill_id: transaction.billId,
          bill_name: transaction.billName,
        })),
        error_if_duplicate_hash: false,
        apply_rules: true,
        fire_webhooks: true,
      };

      let response: AxiosResponse;
      if (id !== '-1') {
        response = await dispatch.configuration.apiPut({ url: `/api/v1/transactions/${id}`, body });
      } else {
        response = await dispatch.configuration.apiPost({ url: '/api/v1/transactions', body });
      }

      return response;
    },
    async deleteTransaction(id): Promise<AxiosResponse> {
      return dispatch.configuration.apiDelete({ url: `/api/v1/transactions/${id}` });
    },
  }),
});
