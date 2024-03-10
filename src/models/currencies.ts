import { createModel } from '@rematch/core';
import { RootModel } from './index';

export interface CurrencyType {
  id: string
  type: string
  attributes: {
    enabled: boolean
    default: boolean
    name: string
    code: string
    symbol: string
    decimalPlaces: number
    createdAt: string
    updatedAt: string
  }
}

type CurrencyStateType = {
  currencies: CurrencyType[]
  currentCode: string
}

const INITIAL_STATE = {
  currencies: [],
  currentCode: '',
} as CurrencyStateType;

export default createModel<RootModel>()({

  state: INITIAL_STATE,

  reducers: {
    setCurrencies(state, payload): CurrencyStateType {
      const {
        currencies = state.currencies,
        currentCode = state.currentCode,
      } = payload;

      return {
        ...state,
        currencies,
        currentCode,
      };
    },

    setCurrentCode(state, code: string): CurrencyStateType {
      return {
        ...state,
        currentCode: code,
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
          currentCode = null,
        },
      } = rootState;

      const { data: currencies } = await dispatch.configuration.apiFetch({ url: '/api/v1/currencies' }) as { data: CurrencyType[] };

      const defaultCurrency = currencies.filter((c: CurrencyType) => c.attributes.default === true).pop();
      const defaultCode = defaultCurrency ? defaultCurrency.attributes.code : '';

      dispatch.currencies.setCurrencies({
        currencies: currencies.filter((c: CurrencyType) => c.attributes.enabled === true),
        currentCode: currentCode || defaultCode,
      });
    },
  }),
});
