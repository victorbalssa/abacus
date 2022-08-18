import { createModel } from '@rematch/core';
import { RootModel } from './index';

export type CategoryType = {
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

export type CategoryStateType = {
  categories: CategoryType[],
}

const INITIAL_STATE = {
  categories: [],
} as CategoryStateType;

export default createModel<RootModel>()({

  state: INITIAL_STATE,

  reducers: {
    setCategories(state, payload): CategoryStateType {
      const {
        categories = state.categories,
      } = payload;

      return {
        ...state,
        categories,
      };
    },

    resetState() {
      return INITIAL_STATE;
    },
  },

  effects: (dispatch) => ({
    /**
     * Get categories list
     *
     * @returns {Promise}
     */
    async getCategories(): Promise<void> {
      const { data: categories } = await dispatch.configuration.apiFetch({ url: '/api/v1/categories' });

      dispatch.categories.setCategories({ categories });
    },
  }),
});
