import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

class ForgotPassword extends Component {
    static propTypes = {
        Layout: PropTypes.func.isRequired,
        member: PropTypes.shape({}).isRequired,
        loading: PropTypes.bool.isRequired,
        onFormSubmit: PropTypes.func.isRequired,
    };

    state = {
        error: null,
        success: null,
    };

    onFormSubmit = (data) => {
        const { onFormSubmit } = this.props;

        return onFormSubmit(data)
            .then(() => this.setState({
                success: 'profile.emailLink',
                error: null,
            })).catch((err) => {
                console.log(err);
                this.setState({
                    success: null,
                    error: err,
                });
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
    onFormSubmit: dispatch.member.resetPassword,
});

export default connect(mapStateToProps, mapDispatchToProps)(ForgotPassword);
