import { Models } from '@rematch/core';
import firefly from './firefly';
import configuration from './configuration';

export interface RootModel extends Models<RootModel> {
  firefly: typeof firefly
  configuration: typeof configuration
}

export const models: RootModel = {
  firefly,
  configuration,
};
