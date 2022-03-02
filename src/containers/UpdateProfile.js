import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

class UpdateProfile extends Component {
    static propTypes = {
        Layout: PropTypes.func.isRequired,
        member: PropTypes.shape({}).isRequired,
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
                success: 'profile.updated',
                error: null,
            })).catch(err => this.setState({
                success: null,
                error: err,
            }));
    };

    render = () => {
        const { member, Layout, loading } = this.props;
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
    onFormSubmit: dispatch.member.updateProfile,
});

export default connect(mapStateToProps, mapDispatchToProps)(UpdateProfile);
