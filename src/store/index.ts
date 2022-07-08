import { init, RematchDispatch, RematchRootState } from '@rematch/core';
import createPersistPlugin, { getPersistor } from '@rematch/persist';
import createLoadingPlugin, { ExtraModelsFromLoading } from '@rematch/loading';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { models, RootModel } from '../models';

const persistPlugin = createPersistPlugin({
  key: 'root',
  storage: AsyncStorage,
  blacklist: [],
});

type FullModel = ExtraModelsFromLoading<RootModel>

const loadingPlugin = createLoadingPlugin({});

export const store = init({
  models,
  plugins: [persistPlugin, loadingPlugin],
});

export const persistor = getPersistor();
export type Store = typeof store
export type Persistor = typeof persistor
export type Dispatch = RematchDispatch<RootModel>
export type RootState = RematchRootState<RootModel, FullModel>
