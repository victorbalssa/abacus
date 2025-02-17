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

const dateDiffInDays = (start, end) => {
  const _MS_PER_DAY = 1000 * 60 * 60 * 24;
  const a = new Date(start);
  const b = (new Date(end).getTime() > new Date().getTime()) ? new Date() : new Date(end);
  const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
  const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

  return Math.floor((utc2 - utc1) / _MS_PER_DAY) + 1;
};

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
        const { data: noCategories } = await dispatch.configuration.apiFetch({ url: `/api/v1/insight/expense/no-category?start=${start}&end=${end}` }) as { data: InsightCategoryType[]};

        noCategories.forEach((item: InsightCategoryType, index) => {
          const newItem: InsightCategoryType = { ...item };
          newItem.id = `no-cat-${String(index)}`;
          newItem.name = 'no-category';
          insightCategories.push(newItem);
        });

        const totalItem: InsightCategoryType = {
          name: 'total',
          id: 'total',
          currencyCode: '',
          currencyId: '0',
          difference: '',
          differenceFloat: 0,
        };

        const filteredCategories = insightCategories
          .filter((category: InsightCategoryType) => category.currencyCode === currentCode)
          .map((category: InsightCategoryType) => {
            totalItem.differenceFloat += category.differenceFloat;
            return category;
          })
          .sort((a, b) => ((a.differenceFloat > b.differenceFloat) ? 1 : -1));

        if (filteredCategories.length > 0) {
          totalItem.difference = totalItem.differenceFloat.toFixed(12);
          totalItem.currencyCode = filteredCategories[2].currencyCode;
          totalItem.currencyId = filteredCategories[2].currencyId;

          const days = dateDiffInDays(start, end);

          const perDayItem = { ...totalItem };
          perDayItem.name = 'perday';
          perDayItem.id = 'perday';
          perDayItem.differenceFloat = totalItem.differenceFloat / days;
          perDayItem.difference = perDayItem.differenceFloat.toFixed(12);

          filteredCategories.push(totalItem);
          filteredCategories.push(perDayItem);
        }

        dispatch.categories.setInsightCategories({ insightCategories: filteredCategories });
      }
    },
  }),
});
