import { init, RematchDispatch, RematchRootState } from '@rematch/core';
import persistPlugin, { getPersistor } from '@rematch/persist';
import loadingPlugin, { ExtraModelsFromLoading } from '@rematch/loading';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { models, RootModel } from '../models';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  blacklist: [],
};

type FullModel = ExtraModelsFromLoading<RootModel, { type: 'full' }>

export const store = init<RootModel, FullModel>({
  models,
  plugins: [persistPlugin(persistConfig), loadingPlugin({ type: 'full' })],
});

export const persistor = getPersistor();
export type Store = typeof store
export type Persistor = typeof persistor
export type RootDispatch = RematchDispatch<RootModel>
export type RootState = RematchRootState<RootModel, FullModel>
