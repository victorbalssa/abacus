import { createModel } from '@rematch/core';
import { RootModel } from './index';

export type InsightCategoryResponseType = {
  name: string,
  id: string,
  currencyCode: string,
  currencyId: string,
  difference: string,
  differenceFloat: number,
}
export type InsightCategoryType = {
  name: string,
  id: string,
  currencyCode: string,
  currencyId: string,
  income: number,
  expense: number,
  difference: number,
}

export type CategoriesStateType = {
  insightCategories: InsightCategoryType[],
  total: InsightCategoryType,
  perDay: InsightCategoryType,
}

const INITIAL_STATE = {
  insightCategories: [],
  total: {
    name: 'total',
    id: 'total',
    currencyCode: '',
    currencyId: '0',
    income: 0,
    expense: 0,
    difference: 0,
  },
  perDay: {
    name: 'perday',
    id: 'perday',
    currencyCode: '',
    currencyId: '0',
    income: 0,
    expense: 0,
    difference: 0,
  },
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
    setTotal(state, payload): CategoriesStateType {
      const {
        total = state.total,
      } = payload;

      return {
        ...state,
        total,
      };
    },
    setPerDay(state, payload): CategoriesStateType {
      const {
        perDay = state.perDay,
      } = payload;

      return {
        ...state,
        perDay,
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
        const { data: insightCategoriesExpenses } = await dispatch.configuration.apiFetch({ url: `/api/v1/insight/expense/category?start=${start}&end=${end}` }) as { data: InsightCategoryResponseType[]};
        const { data: noCategoriesExpenses } = await dispatch.configuration.apiFetch({ url: `/api/v1/insight/expense/no-category?start=${start}&end=${end}` }) as { data: InsightCategoryResponseType[]};
        const { data: insightCategoriesIncome } = await dispatch.configuration.apiFetch({ url: `/api/v1/insight/income/category?start=${start}&end=${end}` }) as { data: InsightCategoryResponseType[]};
        const { data: noCategoriesIncome } = await dispatch.configuration.apiFetch({ url: `/api/v1/insight/income/no-category?start=${start}&end=${end}` }) as { data: InsightCategoryResponseType[]};

        [...noCategoriesExpenses, ...noCategoriesIncome].forEach((item: InsightCategoryResponseType) => {
          const newItem: InsightCategoryResponseType = { ...item };
          newItem.id = 'no-cat';
          newItem.name = 'no-category';
          if (item.differenceFloat > 0) {
            insightCategoriesIncome.push(newItem);
          } else {
            insightCategoriesExpenses.push(newItem);
          }
        });

        const categories = [...insightCategoriesExpenses, ...insightCategoriesIncome].reduce((map: Map<string, InsightCategoryType>, category: InsightCategoryResponseType) => {
          if (!map.has(category.id)) {
            map.set(category.id, {
              ...category,
              income: category.differenceFloat > 0 ? category.differenceFloat : 0,
              expense: category.differenceFloat < 0 ? category.differenceFloat : 0,
              difference: category.differenceFloat,
            });
            return map;
          }

          const existingItem = map.get(category.id);
          if (category.differenceFloat > 0) {
            existingItem.income += category.differenceFloat;
          } else {
            existingItem.expense += category.differenceFloat;
          }
          existingItem.difference += category.differenceFloat;
          return map;
        }, new Map<string, InsightCategoryType>());

        const total: InsightCategoryType = {
          name: 'total',
          id: 'total',
          currencyCode: '',
          currencyId: '0',
          income: 0,
          expense: 0,
          difference: 0,
        };

        const filteredCategories = Array.from(categories.values())
          .filter((category: InsightCategoryType) => category.currencyCode === currentCode)
          .map((category: InsightCategoryType) => {
            total.income += category.income;
            total.expense += category.expense;
            total.difference += category.difference;
            return category;
          })
          .sort((a, b) => ((Math.abs(a.difference) < Math.abs(b.difference)) ? 1 : -1));

        dispatch.categories.setTotal({ total });

        if (filteredCategories.length > 0) {
          total.currencyCode = filteredCategories[2].currencyCode;
          total.currencyId = filteredCategories[2].currencyId;

          const days = dateDiffInDays(start, end);

          const perDay = { ...total };
          perDay.name = 'perday';
          perDay.id = 'perday';
          perDay.income = total.income / days;
          perDay.expense = total.expense / days;
          perDay.difference = total.difference / days;

          dispatch.categories.setPerDay({ perDay });
        }

        dispatch.categories.setInsightCategories({ insightCategories: filteredCategories });
      }
    },
  }),
});
