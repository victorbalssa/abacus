import React, {
  useEffect,
  useState,
  useRef,
  FC,
} from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/es/integration/react';
import { AppState, LogBox, Image } from 'react-native';
import {
  AlertDialog,
  Button,
  extendTheme,
  NativeBaseProvider, Text, useColorModeValue,
} from 'native-base';
import { StatusBar } from 'expo-status-bar';
import AnimatedSplash from 'react-native-animated-splash-screen';
import { LinearGradient } from 'expo-linear-gradient';
import * as Updates from 'expo-updates';
import { useFonts, loadAsync } from 'expo-font';

import {
  AntDesign, Ionicons, Feather, MaterialCommunityIcons, MaterialIcons,
} from '@expo/vector-icons';

import { BlurView } from 'expo-blur';
import { store, persistor } from './store';
import themeConstants from './constants/theme';
import Routes from './routes';
import Loading from './components/UI/Loading';
import { translate } from './i18n/locale';

const config = {
  dependencies: {
    'linear-gradient': LinearGradient,
  },
};

const theme = extendTheme(themeConstants);

const cacheFonts = (fonts) => fonts.map((font) => loadAsync(font));

const App: FC = () => {
  LogBox.ignoreAllLogs(true);

  const backgroundColor = useColorModeValue('#ffffff', '#1f2937');
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);

  const OTARef = React.createRef();
  const [OTAOpen, setOTAOpen] = useState(false);
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
      Feather.font,
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
      console.error(e);
    }
  };

  const onCheckOTA = async () => {
    try {
      const update = await Updates.checkForUpdateAsync();
      if (update.isAvailable) {
        setOTAOpen(true);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const _handleAppStateChange = (nextAppState) => {
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
    <AnimatedSplash
      translucent
      isLoaded={fontsLoaded}
      logoImage={abacusIcon}
      backgroundColor={backgroundColor}
      logoHeight={145}
      logoWidth={145}
    >
      <NativeBaseProvider config={config} theme={theme}>
        <StatusBar style="dark" />
        <Provider store={store}>
          <PersistGate
            loading={<Loading />}
            persistor={persistor}
          >
            {fontsLoaded && (
              <>
                <Routes />
                {appStateVisible !== 'active' && (
                  <BlurView
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
                    tint="light"
                  >
                    <Image
                      style={{
                        width: 100,
                        height: 100,
                      }}
                      source={abacusIcon}
                    />
                    <Text>Abacus</Text>
                    <Text>{translate('privacy_screen')}</Text>
                  </BlurView>
                )}
              </>
            )}
          </PersistGate>
        </Provider>

        <AlertDialog leastDestructiveRef={OTARef} isOpen={OTAOpen} onClose={() => setOTAOpen(false)}>
          <AlertDialog.Content>
            <AlertDialog.CloseButton />
            <AlertDialog.Header>{translate('layout_new_update_header')}</AlertDialog.Header>
            <AlertDialog.Body>
              {translate('layout_new_update_body_text')}
            </AlertDialog.Body>
            <AlertDialog.Footer>
              <Button.Group>
                <Button variant="unstyled" colorScheme="coolGray" onPress={() => setOTAOpen(false)} ref={OTARef}>
                  {translate('layout_new_update_cancel_button')}
                </Button>
                <Button colorScheme="primary" onPress={onOTAUpdate}>
                  {translate('layout_new_update_update_button')}
                </Button>
              </Button.Group>
            </AlertDialog.Footer>
          </AlertDialog.Content>
        </AlertDialog>
      </NativeBaseProvider>
    </AnimatedSplash>
  );
};

export default App;
