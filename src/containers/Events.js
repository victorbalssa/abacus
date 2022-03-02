import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Toast } from 'native-base';
import { Actions } from 'react-native-router-flux';
import i18n from '../translations/i18n';

class Events extends Component {
    static propTypes = {
        Layout: PropTypes.func.isRequired,
        events: PropTypes.arrayOf(PropTypes.shape()).isRequired,
        match: PropTypes.shape({ params: PropTypes.shape({}) }),
        loading: PropTypes.bool.isRequired,
        fetchEvents: PropTypes.func.isRequired,
    };

    static defaultProps = {
        match: null,
    };

    state = {
        card: {
            valid: false,
        },
    };

    componentDidMount = () => {
        const { match, fetchEvents } = this.props;

        if (!match) {
            fetchEvents();
        }
    };

    onCardChange = (form) => {
        let card = {
            valid: form.valid,
            numbers: form.values.number,
            expiry: form.values.expiry,
            cvc: form.values.cvc,
        };

        this.setState({ card });
    };

    buyTicket = (eventId) => {
        const { buyTicket } = this.props;
        const { card } = this.state;

        return buyTicket({ eventId, card })
            .then((msg) => {
                console.log(msg.data);
                Toast.show({
                    text: i18n.t('global.ok'),
                    position: 'top',
                    type: msg.data === 'OK' ? 'success' : 'warning',
                    onClose: () => { msg.data === 'OK' && this.fetchData() && Actions.jump('tickets'); },
                });
            })
            .catch(err => {
                if (err.message) {
                    return Toast.show({
                        text: err.message,
                        position: 'top',
                    });
                }

                if (err.response.data) {
                    return Toast.show({
                        text: err.response.data && err.response.data.message ? i18n.t(err.response.data.message) : i18n.t('errors.default'),
                        position: 'top',
                    });
                }

                return Toast.show({
                    text: i18n.t('errors.default'),
                    position: 'top',
                });
            });
    };

    render = () => {
        const { card } = this.state;
        const { Layout, events, match, loading, member, fetchEvents } = this.props;
        const id = (match && match.params && match.params.id) ? match.params.id : null;

        return (
            <Layout
                eventId={id}
                loading={loading}
                events={events}
                member={member}
                reFetch={() => fetchEvents()}
                onCardChange={this.onCardChange}
                card={this.state.card}
                buyDisabled={!card.valid}
                buyTicket={this.buyTicket}
            />
        );
    };
}

const mapStateToProps = state => ({
    events: state.events.events || {},
    loading: state.loading.models.events,
    member: state.member || {},
});

const mapDispatchToProps = dispatch => ({
    fetchEvents: dispatch.events.getEvents,
    buyTicket: dispatch.events.buyTicket,
});

export default connect(mapStateToProps, mapDispatchToProps)(Events);
