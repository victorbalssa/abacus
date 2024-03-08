import React, {
  useEffect,
  useState,
  useRef,
} from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/es/integration/react';
import {
  AppState,
  LogBox,
  Image,
  Alert,
  AppStateStatus,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as Device from 'expo-device';
import * as Updates from 'expo-updates';
import { useFonts, loadAsync } from 'expo-font';

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
import { AText, ABlurView } from './components/UI/ALibrary';
import ErrorWidget from "./components/UI/ErrorWidget";

const cacheFonts = (fonts) => fonts.map((font) => loadAsync(font));

export default function App() {
  LogBox.ignoreAllLogs(true);
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);

  const [fontsLoaded] = useFonts({
    /* eslint-disable global-require */
    Montserrat: require('./fonts/Montserrat-Regular.ttf'),
    Montserrat_Light: require('./fonts/Montserrat-Light.ttf'),
    Montserrat_Bold: require('./fonts/Montserrat-Bold.ttf'),
    /* eslint-enable global-require */
  });

  const cache = async () => {
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

  const _handleAppStateChange = (nextAppState: AppStateStatus) => {
    appState.current = nextAppState;
    setAppStateVisible(appState.current);
  };

  useEffect(() => {
    (async () => {
      await Promise.all([cache(), onCheckOTA()]);
    })();
    const subscription = AppState.addEventListener('change', _handleAppStateChange);
    return () => {
      subscription.remove();
    };
  }, []);

  /* eslint-disable-next-line @typescript-eslint/no-var-requires,global-require */
  const abacusIcon = require('./images/icon-abacus-splash.png');

  return (
    <Provider store={store}>
      <PersistGate
        loading={<Loading />}
        persistor={persistor}
      >
        <StatusBar />
        {fontsLoaded && (
          <>
            <Routes />
            <ErrorWidget />
            {appStateVisible !== 'active' && (
            <ABlurView
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
                justifyContent: 'center',
                alignItems: 'center',
              }}
              intensity={60}
            >
              <Image
                style={{
                  width: 100,
                  height: 100,
                }}
                source={abacusIcon}
              />
              <AText>Abacus</AText>
            </ABlurView>
            )}
          </>
        )}
      </PersistGate>
    </Provider>
  );
}
