import { Models } from '@rematch/core';
import accounts from './accounts';
import bills from './bills';
import budgets from './budgets';
import categories from './categories';
import configuration from './configuration';
import currencies from './currencies';
import firefly from './firefly';
import transactions from './transactions';
import piggyBanks from './piggyBanks';

export interface RootModel extends Models<RootModel> {
  accounts: typeof accounts
  bills: typeof bills
  piggyBanks : typeof piggyBanks
  budgets: typeof budgets
  categories: typeof categories
  configuration: typeof configuration
  currencies: typeof currencies
  firefly: typeof firefly
  transactions: typeof transactions
}

export const models: RootModel = {
  accounts,
  bills,
  piggyBanks,
  budgets,
  categories,
  configuration,
  currencies,
  firefly,
  transactions,
};
