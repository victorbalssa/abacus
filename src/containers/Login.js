import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';

class Login extends Component {
    static propTypes = {
        Layout: PropTypes.func.isRequired,
        member: PropTypes.shape({}).isRequired,
        onFormSubmit: PropTypes.func.isRequired,
    };

    state = {
        error: null,
        success: null,
    };

    componentDidMount () {
        const { isConnected } = this.props;

        isConnected()
            .then(() => Actions.tabbar())
            .catch(() => {})
        ;
    }

    onFormSubmit = (data) => {
        const { onFormSubmit } = this.props;

        return onFormSubmit(data)
            .then(() => this.setState({
                success: 'global.ok',
                error: null,
            }))
            .catch((err) => {
                this.setState({ error: err });
                throw err;
            });
    };

    render = () => {
        const { member, loading, Layout } = this.props;
        const { error, success } = this.state;

        return (
            <Layout
                error={error}
                member={member}
                loading={loading}
                success={success}
                onFormSubmit={this.onFormSubmit}
            />
        );
    };
}

const mapStateToProps = state => ({
    member: state.member || {},
    loading: state.loading.models.member,
});

const mapDispatchToProps = dispatch => ({
    onFormSubmit: dispatch.member.login,
    isConnected: dispatch.member.isConnected,
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);
