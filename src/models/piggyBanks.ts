import { createModel } from '@rematch/core';
import { RootModel } from './index';

/*
 * Piggy bank model created following the API documentation from the Firefly III docs.
 * Currently this is a subset of all available properties. Additional properties may be added as needed.
 * {@link https://api-docs.firefly-iii.org/#/piggy_banks/listPiggyBank|Piggy Bank API}
 */
export type PiggyBank = {
  id: string, type: string, attributes: {
    createdAt: string,
    updatedAt: string,
    accountId: string,
    accountName: string,
    name: string,
    currencyId: string,
    currencyCode: string,
    currencySymbol: string,
    targetAmount: number,
    percentage: number,
    currentAmount: number,
    leftToSave: number,
    savePerMonth: number,
    active: boolean,
  }
}

type PiggyBankState = {
  piggyBanks: PiggyBank[]
}

const INITIAL_STATE: PiggyBankState = { piggyBanks: [] };

export default createModel<RootModel>()({
  state: INITIAL_STATE,
  reducers: {
    setPiggyBanks(state, payload): PiggyBankState {
      return { ...state, piggyBanks: payload.piggyBanks };
    },

    resetState() {
      return INITIAL_STATE;
    },
  },

  effects: (dispatch) => ({
    async getPiggyBanks(_: void): Promise<void> {
      const { data: piggyBanks } = await dispatch.configuration.apiFetch({ url: '/api/v1/piggy-banks' }) as {
        data: PiggyBank[]
      };
      dispatch.piggyBanks.setPiggyBanks({ piggyBanks });
    },
  }),
});
