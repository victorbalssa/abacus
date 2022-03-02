import { Firebase, FirebaseRef } from '../lib/firebase';
import initState from '../store/events';
import axios from 'axios';
import config from '../constants/config';

export default {

    state: {
        events: initState.events,
    },

    reducers: {
        replaceEvents (state, payload) {
            let events = [];
            if (payload && typeof payload === 'object') {
                Object.keys(payload).map(item => {
                    events.push(payload[item]);
                });
            }
            events.sort((a, b) => (a.id > b.id) ? 1 : ((b.id > a.id) ? -1 : 0));

            return { ...state, events };
        },
    },

    effects: (styleProp, cleanedProps) => ({

        /**
         * Get Events
         *
         * @return {Promise}
         */
        getEvents () {
            if (Firebase === null) return new Promise(resolve => resolve(false));

            return new Promise((resolve, reject) => FirebaseRef.child('events').orderByChild('hour').once('value')
                .then(snapshot => {
                    const data = snapshot.val() || [];
                    this.replaceEvents(data);
                    return resolve();
                }).catch((c) => reject(c))).catch((err) => { throw err.message; });
        },

        /**
         * Buy Ticket
         *
         * @return {Promise}
         */
        buyTicket ({ eventId, card }) {
            if (Firebase === null) return new Promise(resolve => resolve(false));

            return new Promise((resolve, reject) => {
                if (!Firebase.auth().currentUser) return reject({ code: 'errors.needToBeLoggedIn' });

                Firebase.auth().currentUser.getIdToken().then(idToken => {
                    axios.post(config.serverURL + '/api/buyTicket',
                        {
                            eventId,
                            numbers: card.numbers,
                            expiry: card.expiry,
                            cvc: card.cvc,
                        }, {
                            headers: {
                                'token': idToken,
                            },
                        })
                        .then(resolve)
                        .catch(reject);
                }).catch(reject);
            });
        },
    }),
};
