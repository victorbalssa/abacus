import { createModel } from '@rematch/core';
import moment from 'moment/moment';
import { RootModel } from './index';
import { TransactionType } from './transactions';

export type BillType = {
  id: string,
  type: string,
  attributes: {
    name: string,
    active: boolean;
    amountMin: string;
    amountMax: string;
    currencyId: string;
    currencyCode: string;
    currencySymbol: string;
    nextExpectedMatch: string | null;
    payDates: string[];
    paidDates: {
      transactionGroupId: string;
      transactionJournalId: string;
      date: string;
      amount: string;
    }[];
    currentPaidAmount: string;
  },
}

type BillsStateType = {
  bills: BillType[];
}

const INITIAL_STATE = {
  bills: [],
} as BillsStateType;

export default createModel<RootModel>()({

  state: INITIAL_STATE,

  reducers: {
    setBills(state, payload): BillsStateType {
      const {
        bills = state.bills,
      } = payload;

      return {
        ...state,
        bills,
      };
    },

    resetState() {
      return INITIAL_STATE;
    },
  },

  effects: (dispatch) => ({
    async getBills(_: void, rootState): Promise<void> {
      const {
        firefly: {
          rangeDetails: {
            start,
            end,
          },
        },
      } = rootState;

      const { data: bills } = await dispatch.configuration.apiFetch({ url: `/api/v1/bills?start=${start}&end=${end}` }) as { data: BillType[] };

      const { data: transactions } = await dispatch.configuration.apiFetch({ url: `/api/v1/transactions?start=${start}&end=${end}` }) as { data: TransactionType[] };

      const billTransactions = transactions.reduce((acc, transaction) => {
        transaction.attributes.transactions.forEach((split) => {
          if (split.billId) {
            if (!acc[split.billId]) {
              acc[split.billId] = 0;
            }
            acc[split.billId] += parseFloat(split.amount);
          }
        });
        return acc;
      }, {});

      const filteredBills = [...bills]
        // Filter out inactive bills
        .filter((bill) => bill.attributes.active)
        // Add the currentPaidAmount field
        .map((bill) => {
          const currentPaidAmount = billTransactions[bill.id] || 0;
          return {
            ...bill,
            attributes: {
              ...bill.attributes,
              currentPaidAmount: currentPaidAmount.toString(),
            },
          };
        })
        // Order by next expected date
        .sort((a, b) => moment(a.attributes.nextExpectedMatch).diff(moment(b.attributes.nextExpectedMatch)))
        // Make sure all paid bills are at the end of the list
        .sort((a, b) => a.attributes.paidDates.length - b.attributes.paidDates.length);

      dispatch.bills.setBills({ bills: filteredBills });
    },
  }),
});
