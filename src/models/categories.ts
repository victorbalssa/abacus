import { createModel } from '@rematch/core';
import { RootModel } from './index';

export type InsightCategoryType = {
  name: string,
  id: string,
  currencyCode: string,
  currencyId: string,
  difference: string,
  differenceFloat: number,
}

export type CategoriesStateType = {
  insightCategories: InsightCategoryType[],
}

const INITIAL_STATE = {
  insightCategories: [],
} as CategoriesStateType;

export default createModel<RootModel>()({

  state: INITIAL_STATE,

  reducers: {
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
     * Get Insight categories
     *
     * @returns {Promise}
     */
    async getInsightCategories(_: void, rootState): Promise<void> {
      const {
        firefly: {
          rangeDetails: {
            start,
            end,
          },
        },
        currencies: {
          currentCode,
        },
      } = rootState;
      if (currentCode) {
        const { data: insightCategories } = await dispatch.configuration.apiFetch({ url: `/api/v1/insight/expense/category?start=${start}&end=${end}` }) as { data: InsightCategoryType[]};

        const filteredCategories = insightCategories
          .filter((category: InsightCategoryType) => category.currencyCode === currentCode)
          .sort((a, b) => ((a.differenceFloat > b.differenceFloat) ? 1 : -1));

        dispatch.categories.setInsightCategories({ insightCategories: filteredCategories });
      }
    },
  }),
});
