import { createModel } from '@rematch/core';
import { RootModel } from './index';

export type BudgetType = {
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

export type BudgetStateType = {
  budgets: BudgetType[],
}

const INITIAL_STATE = {
  budgets: [],
} as BudgetStateType;

export default createModel<RootModel>()({

  state: INITIAL_STATE,

  reducers: {
    setBudgets(state, payload): BudgetStateType {
      const {
        budgets = state.budgets,
      } = payload;

      return {
        ...state,
        budgets,
      };
    },

    resetConfiguration() {
      return INITIAL_STATE;
    },
  },

  effects: (dispatch) => ({
    /**
     * Get budgets list
     *
     * @returns {Promise}
     */
    async getBudgets(): Promise<void> {
      const { data: budgets } = await dispatch.configuration.apiFetch({ url: '/api/v1/budgets' });

      dispatch.budgets.setBudgets({ budgets });
    },
  }),
});
