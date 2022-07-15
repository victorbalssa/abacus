import React from 'react';
import * as Font from 'expo-font';

import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/es/integration/react';
import { LogBox } from 'react-native';
import { extendTheme, NativeBaseProvider } from 'native-base';
import { StatusBar } from 'expo-status-bar';
import AnimatedSplash from 'react-native-animated-splash-screen';
import { LinearGradient } from 'expo-linear-gradient';
import { Store, Persistor } from '../store';

import colors from '../constants/colors';
import Routes from './routes/index';
import Loading from './components/UI/Loading';

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
    Input: {
      baseStyle: {
        borderRadius: 15,
        height: 10,
      },
    },
  },
});

type AppPropsType = {
  store: Store,
  persistor: Persistor,
};

type AppStateType = {
  loading: boolean,
};

export default class App extends React.Component<AppPropsType, AppStateType> {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
    };
  }

  async componentDidMount() {
    await this.loadAssets();
  }

  async loadAssets() {
    await Font.loadAsync({
      Montserrat: require('../fonts/Montserrat-Regular.ttf'),
      Montserrat_Light: require('../fonts/Montserrat-Light.ttf'),
      Montserrat_Bold: require('../fonts/Montserrat-Bold.ttf'),
    });
    this.setState({ loading: false });
  }

  render() {
    const {
      store,
      persistor,
    } = this.props;
    const { loading } = this.state;
    LogBox.ignoreAllLogs(true);

    return (
      <AnimatedSplash
        translucent
        isLoaded={!loading}
        logoImage={require('../images/icon-abacus-splash.png')}
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
              {loading === false && Routes}
            </PersistGate>
          </Provider>
        </NativeBaseProvider>
      </AnimatedSplash>
    );
  }
}
