import { createModel } from '@rematch/core';
import { RootModel } from './index';

export type BudgetType = {
  name: string,
  id: string,
}

export type InsightBudgetType = {
  name: string,
  id: string,
  limit?: number,
  currency_code: string,
  currency_id: string,
  difference: string,
  difference_float: number,
}

export type BudgetsStateType = {
  budgets: BudgetType[],
  insightBudgets: InsightBudgetType[],
}

const INITIAL_STATE = {
  budgets: [],
  insightBudgets: [],
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

    setInsightBudgets(state, payload): BudgetsStateType {
      const {
        insightBudgets = state.insightBudgets,
      } = payload;

      return {
        ...state,
        insightBudgets,
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
        const insightBudgets = await dispatch.configuration.apiFetch({ url: `/api/v1/insight/expense/budget?start=${start}&end=${end}` });
        const { data: apiBudgetsLimits } = await dispatch.configuration.apiFetch({ url: `/api/v1/budget-limits?start=${start}&end=${end}` });
        const budgetsLimits = {};

        apiBudgetsLimits.forEach((limit) => {
          if (limit && limit.attributes) {
            const {
              attributes: {
                budget_id: budgetId,
                amount,
              },
            } = limit;

            budgetsLimits[budgetId] = parseFloat(amount);
          }
        });

        const filteredBudgets: InsightBudgetType = insightBudgets
          .filter((budget: InsightBudgetType) => budget.currency_code === current.attributes.code)
          .sort((a, b) => ((a.difference_float > b.difference_float) ? 1 : -1))
          .map((budget: InsightBudgetType) => ({
            limit: budgetsLimits[budget.id] || 0,
            ...budget,
          }));

        dispatch.budgets.setInsightBudgets({ insightBudgets: filteredBudgets });
      }
    },
  }),
});
