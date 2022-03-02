import React from 'react';
import * as Font from 'expo-font';
import PropTypes from 'prop-types';
import { Asset } from 'expo-asset';
import { Provider } from 'react-redux';
import { Router } from 'react-native-router-flux';
import { PersistGate } from 'redux-persist/es/integration/react';
import { LogBox, Image } from 'react-native';
import { Root } from 'native-base';
import AnimatedSplash from 'react-native-animated-splash-screen';

import theme from '../constants/colors';
import Routes from './routes/index';
import H2TLoading from './components/UI/H2TLoading';
import i18n from '../translations/i18n';

const cacheImages = (images) => {
    return images.map(image => {
        if (typeof image === 'string') {
            return Image.prefetch(image);
        } else {
            return Asset.fromModule(image)
                .downloadAsync();
        }
    });
};

export default class App extends React.Component {
    static propTypes = {
        store: PropTypes.shape({}).isRequired,
        persistor: PropTypes.shape({}).isRequired,
    };

    state = {
        loading: true,
    };

    componentDidMount() {
        i18n.locale = this.props.store.getState().member.locale === 'fr' ? 'fr' : 'en';
        this.loadAssets();
    }

    async loadAssets() {
        await cacheImages([
            require('../images/Events/blueBackgroung.png'),
            require('../images/Events/event.png'),
            require('../images/Tickets/no-tickets.png'),
            require('../images/Events/account.jpg'),
            require('../images/Events/signIn.jpg'),
        ]);
        await Font.loadAsync({
            Montserrat: require('../images/Montserrat-Regular.ttf'),
            Montserrat_Bold: require('../images/Montserrat-Bold.ttf'),
        });
        this.setState({ loading: false });
    };

    render() {
        const {
            store,
            persistor
        } = this.props;
        LogBox.ignoreAllLogs(true);

        return (
            <AnimatedSplash
                translucent={true}
                isLoaded={!this.state.loading}
                logoImage={require('../images/ic_launcher_h2t.png')}
                backgroundColor={theme.backgroundColor}
                logoHeight={185}
                logoWidth={185}
            >
                <Root>
                    <Provider store={store}>
                        <PersistGate
                            loading={<H2TLoading/>}
                            persistor={persistor}
                        >
                            {this.state.loading === false &&
                                <Router>
                                    {Routes}
                                </Router>
                            }
                        </PersistGate>
                    </Provider>
                </Root>
            </AnimatedSplash>
        );
    }
}
