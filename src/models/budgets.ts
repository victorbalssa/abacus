import { createModel } from '@rematch/core';
import { RootModel } from './index';

export type BudgetType = {
  name: string,
  id: string,
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
     * Get Autocomplete budgets list
     *
     * @returns {Promise}
     */
    async getAutocompleteBudgets(payload): Promise<void> {
      const { query } = payload;
      const limit = 10;
      const budgets = await dispatch.configuration.apiFetch({ url: `/api/v1/autocomplete/budgets?limit=${limit}&query=${query}` });

      dispatch.budgets.setBudgets({ budgets });
    },
  }),
});
