import { createModel } from '@rematch/core';
import { RootModel } from './index';

export type CurrencyType = {
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

export type CurrencyStateType = {
  currencies: CurrencyType[],
}

const INITIAL_STATE = {
  currencies: [],
} as CurrencyStateType;

export default createModel<RootModel>()({

  state: INITIAL_STATE,

  reducers: {
    setCurrencies(state, payload): CurrencyStateType {
      const {
        currencies = state.currencies,
      } = payload;

      return {
        ...state,
        currencies,
      };
    },

    resetConfiguration() {
      return INITIAL_STATE;
    },
  },

  effects: (dispatch) => ({
    /**
     * Get currencies list
     *
     * @returns {Promise}
     */
    async getCurrencies(): Promise<void> {
      const { data: currencies } = await dispatch.configuration.apiFetch({ url: '/api/v1/currencies' });

      dispatch.currencies.setCurrencies({ currencies });
    },
  }),
});
