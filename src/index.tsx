import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/es/integration/react';
import { Alert, LogBox } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as Device from 'expo-device';
import * as Updates from 'expo-updates';
import { loadAsync } from 'expo-font';

import {
  AntDesign,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from '@expo/vector-icons';

import { store, persistor } from './store';
import Routes from './routes';
import Loading from './components/UI/Loading';
import translate from './i18n/locale';

export default function App() {
  LogBox.ignoreAllLogs(true);

  const cache = async () => {
    const cacheFonts = (fonts: { [p: string]: string }[]) => fonts.map((font) => loadAsync(font));
    const fontAssets = cacheFonts([
      AntDesign.font,
      Ionicons.font,
      MaterialCommunityIcons.font,
      MaterialIcons.font,
    ]);

    await Promise.all([fontAssets]);
  };

  const onOTAUpdate = async () => {
    try {
      await Updates.fetchUpdateAsync();
      await Updates.reloadAsync();
    } catch (e) {
      // console.error(e);
    }
  };

  const showOTAAlert = () => Alert.alert(
    translate('layout_new_update_header'),
    translate('layout_new_update_body_text'),
    [
      {
        text: translate('layout_new_update_update_button'),
        onPress: () => onOTAUpdate(),
      },
      {
        text: translate('cancel'),
      },
    ],
  );

  const onCheckOTA = async () => {
    try {
      if (Device.isDevice && !__DEV__) {
        const update = await Updates.checkForUpdateAsync();

        if (update.isAvailable) {
          showOTAAlert();
        }
      }
    } catch (e) {
      // console.error(e);
    }
  };

  useEffect(() => {
    (async () => {
      await Promise.all([cache(), onCheckOTA()]);
    })();
  }, []);

  return (
    <Provider store={store}>
      <PersistGate
        loading={<Loading />}
        persistor={persistor}
      >
        <StatusBar />
        <Routes />
      </PersistGate>
    </Provider>
  );
}
