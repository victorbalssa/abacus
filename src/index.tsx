import React, { useEffect, useState, FC } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/es/integration/react';
import { LogBox } from 'react-native';
import {
  AlertDialog,
  Button,
  extendTheme,
  NativeBaseProvider,
} from 'native-base';
import { StatusBar } from 'expo-status-bar';
import AnimatedSplash from 'react-native-animated-splash-screen';
import { LinearGradient } from 'expo-linear-gradient';
import * as Updates from 'expo-updates';
import { useFonts } from 'expo-font';

import { store, persistor } from './store';
import colors from './constants/colors';
import Routes from './routes';
import Loading from './components/UI/Loading';
import ErrorWidget from "./components/UI/ErrorWidget";

const config = {
  dependencies: {
    'linear-gradient': LinearGradient,
  },
};

const theme = extendTheme({
  colors: {
    primary: {
      50: colors.brandStyleSecond,
      100: colors.brandStyleSecond,
      200: colors.brandStyleSecond,
      300: colors.brandStyleSecond,
      400: colors.brandStyleSecond,
      500: colors.brandStyle,
      600: colors.brandStyle,
      700: colors.brandStyle,
      800: colors.brandStyle,
      900: colors.brandStyle,
    },
    chart0: {
      600: colors.brandStyle0,
    },
    chart1: {
      600: colors.brandStyle1,
    },
    chart2: {
      600: colors.brandStyle2,
    },
    chart3: {
      600: colors.brandStyle3,
    },
    chart4: {
      600: colors.brandStyle4,
    },
  },
  fontConfig: {
    Montserrat: {
      100: {
        normal: 'Montserrat_Light',
      },
      200: {
        normal: 'Montserrat_Light',
      },
      300: {
        normal: 'Montserrat',
      },
      400: {
        normal: 'Montserrat',
      },
      500: {
        normal: 'Montserrat_Bold',
      },
      600: {
        normal: 'Montserrat_Bold',
      },
    },
  },
  fonts: {
    heading: 'Montserrat',
    body: 'Montserrat',
    mono: 'Montserrat',
  },
  components: {
    Alert: {
      baseStyle: {
        m: '3',
        shadow: 2,
      },
    },
    Heading: {
      baseStyle: {
        fontFamily: 'Montserrat_Bold',
      },
    },
    IconButton: {
      baseStyle: {
        borderRadius: 15,
        _icon: {
          size: 'xl',
        },
        _pressed: {
          style: {
            transform: [{
              scale: 0.95,
            }],
            opacity: 0.95,
          },
        },
      },
    },
    Input: {
      baseStyle: {
        borderRadius: 15,
        height: 10,
      },
    },
  },
});

const App: FC = () => {
  LogBox.ignoreAllLogs(true);

  const OTARef = React.createRef();
  const [OTAOpen, setOTAOpen] = useState(false);
  const [fontsLoaded] = useFonts({
    Montserrat: require('./fonts/Montserrat-Regular.ttf'),
    Montserrat_Light: require('./fonts/Montserrat-Light.ttf'),
    Montserrat_Bold: require('./fonts/Montserrat-Bold.ttf'),
  });

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

  useEffect(() => {
    (async () => {
      await onCheckOTA();
    })();
  }, []);

  return (
    <AnimatedSplash
      translucent
      isLoaded={fontsLoaded}
      logoImage={require('./images/icon-abacus-splash.png')}
      backgroundColor={colors.backgroundColor}
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
            {fontsLoaded && Routes}
          </PersistGate>
        </Provider>

        <AlertDialog leastDestructiveRef={OTARef} isOpen={OTAOpen} onClose={() => setOTAOpen(false)}>
          <AlertDialog.Content>
            <AlertDialog.CloseButton />
            <AlertDialog.Header>New Update Available</AlertDialog.Header>
            <AlertDialog.Body>
              You can always update later in Settings tab.
            </AlertDialog.Body>
            <AlertDialog.Footer>
              <Button.Group>
                <Button variant="unstyled" colorScheme="coolGray" onPress={() => setOTAOpen(false)} ref={OTARef}>
                  Cancel
                </Button>
                <Button colorScheme="primary" onPress={onOTAUpdate}>
                  Update now
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
