import React from 'react';
import * as Font from 'expo-font';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/es/integration/react';
import { LogBox } from 'react-native';
import { extendTheme, NativeBaseProvider } from 'native-base';
import { StatusBar } from 'expo-status-bar';
import AnimatedSplash from 'react-native-animated-splash-screen';
import { LinearGradient } from 'expo-linear-gradient';

import colors from '../constants/colors';
import Routes from './routes/index';
import Loading from './components/UI/Loading';

const config = {
  dependencies: {
    'linear-gradient': LinearGradient,
  },
};

const theme = extendTheme({
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
      },
    },
  },
});

export default class App extends React.Component {
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
      Montserrat: require('../images/Montserrat-Regular.ttf'),
      Montserrat_Light: require('../images/Montserrat-Light.ttf'),
      Montserrat_Bold: require('../images/Montserrat-Bold.ttf'),
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
          <StatusBar barStyle="light-content" />
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

App.propTypes = {
  store: PropTypes.shape({}).isRequired,
  persistor: PropTypes.shape({}).isRequired,
};
