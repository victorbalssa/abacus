import { createModel } from '@rematch/core';
import { RootModel } from './index';

export type CategoryType = {
  name: string,
  id: string,
}

export type CategoriesStateType = {
  categories: CategoryType[],
}

const INITIAL_STATE = {
  categories: [],
} as CategoriesStateType;

export default createModel<RootModel>()({

  state: INITIAL_STATE,

  reducers: {
    setCategories(state, payload): CategoriesStateType {
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
     * Get Autocomplete categories list
     *
     * @returns {Promise}
     */
    async getAutocompleteCategories(payload): Promise<void> {
      const { query } = payload;
      const limit = 10;
      const categories = await dispatch.configuration.apiFetch({ url: `/api/v1/autocomplete/categories?limit=${limit}&query=${query}` });

      dispatch.categories.setCategories({ categories });
    },
  }),
});
