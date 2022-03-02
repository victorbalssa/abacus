import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as Analytics from 'expo-firebase-analytics';

import registerForPushNotificationsAsync from '../lib/GetExpoPushToken';

class Home extends Component {
    static propTypes = {
        Layout: PropTypes.func.isRequired,
    };

    componentDidMount () {
        const { sendPToken } = this.props;

        registerForPushNotificationsAsync().then(token => {
            sendPToken(token).catch(e => console.log(e));
        }).catch(error => console.error(error));

        Analytics.logEvent('login', {
            contentType: 'HOME',
            itemId: 'home',
            method: 'email',
        }).catch(e => console.error(e));
    }

    state = {
        error: null,
    };

    render = () => {
        const { Layout, member } = this.props;
        const { error } = this.state;

        return (
            <Layout
                error={error}
                member={member}
            />
        );
    };
}

const mapStateToProps = state => ({
    member: state.member || {},
});

const mapDispatchToProps = dispatch => ({
    sendPToken: dispatch.member.sendPushToken,
});

export default connect(mapStateToProps, mapDispatchToProps)(Home);
