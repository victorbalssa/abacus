import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';

class Member extends Component {
    static propTypes = {
        Layout: PropTypes.func.isRequired,
        memberLogout: PropTypes.func.isRequired,
        fetchMember: PropTypes.func.isRequired,
        member: PropTypes.shape({}).isRequired,
    };

    state = {
        error: null,
        success: null,
    };

    componentDidMount = () => this.fetchData();

    fetchData = (data) => {
        const { fetchMember } = this.props;

        return fetchMember(data)
            .then(() => this.setState({
                error: null,
            })).catch(err => this.setState({
                error: err,
            }));
    };

    logout = () => {
        const { memberLogout } = this.props;

        return memberLogout()
            .then(() => Actions.welcome())
            .catch(err => this.setState({
                error: err,
            }));
    };

    handleValidateTicket = (data) => {
        let userId = data.split(' ')[0];
        let ticketId = data.split(' ')[1];

        const { validateTicket } = this.props;

        return validateTicket({ userId, ticketId })
            .then((msg) => {
                alert(msg);
                this.setState({
                    error: null,
                });
            })
            .catch(err => {
                alert('Erreur serveur');
                console.log(err);
            });
    };

    render = () => {
        const { Layout, member, ticket, loading, switchLanguage } = this.props;
        const { error, success } = this.state;

        return (
            <Layout
                error={error}
                success={success}
                handleValidateTicket={this.handleValidateTicket.bind(this)}
                loading={loading}
                member={member}
                ticket={ticket}
                logout={this.logout.bind(this)}
                reFetch={() => this.fetchData()}
                switchLanguage={switchLanguage}
            />
        );
    };
}

const mapStateToProps = state => ({
    member: state.member || {},
    loading: state.loading.models.member,
});

const mapDispatchToProps = dispatch => ({
    memberLogout: dispatch.member.logout,
    fetchMember: dispatch.member.getMemberData,
    validateTicket: dispatch.member.validateTicket,
    switchLanguage: dispatch.member.switchLanguage,
});

export default connect(mapStateToProps, mapDispatchToProps)(Member);
