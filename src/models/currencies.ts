import { createModel } from '@rematch/core';
import { RootModel } from './index';

export type CurrencyType = {
  attributes: {
    enabled: boolean,
    default: boolean,
    name: string,
    code: string,
    symbol: string,
    decimal_places: number,
    created_at: string,
    updated_at: string
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

export type CurrencyStateType = {
  currencies: CurrencyType[],
  current: CurrencyType,
}

const INITIAL_STATE = {
  currencies: [],
  current: null,
} as CurrencyStateType;

export default createModel<RootModel>()({

  state: INITIAL_STATE,

  reducers: {
    setCurrencies(state, payload): CurrencyStateType {
      const {
        currencies = state.currencies,
        current = state.current,
      } = payload;

      return {
        ...state,
        currencies,
        current,
      };
    },

    handleChangeCurrent(state, payload: string): CurrencyStateType {
      const { currencies } = state;
      const current = currencies.find((c) => c.id === payload);

      return {
        ...state,
        current,
      };
    },

    resetState() {
      return INITIAL_STATE;
    },
  },

  effects: (dispatch) => ({
    /**
     * Get currencies list
     *
     * @returns {Promise}
     */
    async getCurrencies(_: void, rootState): Promise<void> {
      const {
        currencies: {
          current,
        },
      } = rootState;

      const { data: currencies } = await dispatch.configuration.apiFetch({ url: '/api/v1/currencies' });

      dispatch.currencies.setCurrencies({
        currencies: currencies.filter((c: CurrencyType) => c.attributes.enabled === true),
        current: current || currencies.filter((c: CurrencyType) => c.attributes.default === true)[0] || null,
      });
    },

    /**
     * Effect change Current
     *
     * @returns {Promise}
     */
    async changeCurrent(id: string): Promise<void> {
      await dispatch.currencies.handleChangeCurrent(id);

      await Promise.all([
        dispatch.firefly.getNetWorth(),
        dispatch.accounts.getAccounts(),
        dispatch.categories.getInsightCategories(),
        dispatch.budgets.getInsightBudgets(),
      ]);
    },
  }),
});
