import { createModel } from '@rematch/core';
import { RootModel } from './index';

export type CategoryType = {
  name: string,
  id: string,
}

export type InsightCategoryType = {
  name: string,
  id: string,
  currency_code: string,
  currency_id: string,
  difference: string,
  difference_float: number,
}

export type CategoriesStateType = {
  categories: CategoryType[],
  insightCategories: InsightCategoryType[],
}

const INITIAL_STATE = {
  categories: [],
  insightCategories: [],
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

    setInsightCategories(state, payload): CategoriesStateType {
      const {
        insightCategories = state.insightCategories,
      } = payload;

      return {
        ...state,
        insightCategories,
      };
    },

    resetState() {
      return INITIAL_STATE;
    },
  },

  effects: (dispatch) => ({
    /**
     * Get Autocomplete categories
     *
     * @returns {Promise}
     */
    async getAutocompleteCategories(payload): Promise<void> {
      const { query } = payload;
      const limit = 10;
      const categories = await dispatch.configuration.apiFetch({ url: `/api/v1/autocomplete/categories?limit=${limit}&query=${query}` });

      dispatch.categories.setCategories({ categories });
    },

    /**
     * Get Insight categories
     *
     * @returns {Promise}
     */
    async getInsightCategories(_: void, rootState): Promise<void> {
      const {
        firefly: {
          start,
          end,
        },
        currencies: {
          current,
        },
      } = rootState;
      const insightCategories = await dispatch.configuration.apiFetch({ url: `/api/v1/insight/expense/category?start=${start}&end=${end}` });

      const filteredCategories = insightCategories
        .filter((category: InsightCategoryType) => category.currency_code === current.attributes.code)
        .sort((a, b) => ((a.difference_float > b.difference_float) ? 1 : -1));

      dispatch.categories.setInsightCategories({ insightCategories: filteredCategories });
    },
  }),
});
