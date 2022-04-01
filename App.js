import React from 'react';
import Root from './src/native/index';
import { store, persistor } from './src/store';

export default function App() {
  return <Root store={store} persistor={persistor} />;
}
