import { createModel } from '@rematch/core';
import { RootModel } from './index';

export type BudgetSpentType = {
  sum: string
  currencyId: string
  currencyCode: string
  currencySymbol: string
  currencyDecimalPlaces: number
}

export type BudgetType = {
  id: string
  attributes: {
    name: string
    active: boolean
    createdAt: string
    updatedAt: string
    notes: string
    order: number
    spent: BudgetSpentType[]
  },
  limit?: number,
  currencyCode: string,
  differenceFloat: number,
}

export type BudgetsStateType = {
  budgets: BudgetType[],
}

const INITIAL_STATE = {
  budgets: [],
} as BudgetsStateType;

export default createModel<RootModel>()({

  state: INITIAL_STATE,

  reducers: {
    setBudgets(state, payload): BudgetsStateType {
      const {
        budgets = state.budgets,
      } = payload;

      return {
        ...state,
        budgets,
      };
    },

    resetState() {
      return INITIAL_STATE;
    },
  },

  effects: (dispatch) => ({
    /**
     * Get Insight budgets
     *
     * @returns {Promise}
     */
    async getInsightBudgets(_: void, rootState): Promise<void> {
      const {
        firefly: {
          rangeDetails: {
            start,
            end,
          },
        },
        currencies: {
          current,
        },
      } = rootState;
      if (current && current.attributes.code) {
        const { data: budgets } = await dispatch.configuration.apiFetch({ url: `/api/v1/budgets?start=${start}&end=${end}` });
        const { data: apiBudgetsLimits } = await dispatch.configuration.apiFetch({ url: `/api/v1/budget-limits?start=${start}&end=${end}` });
        const budgetsLimits = {};

        apiBudgetsLimits
          .filter((limit) => limit.attributes.currencyCode === current.attributes.code)
          .forEach((limit) => {
            if (limit && limit.attributes) {
              const {
                attributes: {
                  budgetId,
                  amount,
                },
              } = limit;

              if (budgetsLimits[budgetId] === undefined) {
                budgetsLimits[budgetId] = 0;
              }

              budgetsLimits[budgetId] += parseFloat(amount);
            }
          });

        const filteredBudgets: BudgetType = budgets
          .sort((a, b) => ((a.attributes.order > b.attributes.order) ? 1 : -1))
          .map((budget: BudgetType) => ({
            limit: budgetsLimits[budget.id] || 0,
            differenceFloat: budget.attributes.spent.find((budgetSpent) => budgetSpent.currencyCode === current.attributes.code)?.sum || 0,
            currencyCode: current.attributes.code,
            ...budget,
          }));

        dispatch.budgets.setBudgets({ budgets: filteredBudgets });
      }
    },
  }),
});
