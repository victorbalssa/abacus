import { init } from '@rematch/core';
import createPersistPlugin, { getPersistor } from '@rematch/persist';
import createLoadingPlugin from '@rematch/loading';
import AsyncStorage from '@react-native-async-storage/async-storage';
import models from '../models/index';

const persistPlugin = createPersistPlugin({
  key: 'root',
  storage: AsyncStorage,
  blacklist: [],
});

const loadingPlugin = createLoadingPlugin({});

export const store = init({
  models,
  plugins: [persistPlugin, loadingPlugin],
});

export const persistor = getPersistor();
