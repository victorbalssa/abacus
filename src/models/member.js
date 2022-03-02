import { Firebase, FirebaseRef } from '../lib/firebase';
import i18n from '../translations/i18n';
import * as Localization from 'expo-localization';

export default {

    state: {
        locale: Localization.locale.includes('fr') ? 'fr' : 'en',
    },

    reducers: {
        setUserLogin (state, payload) {
            const { uid, email, emailVerified } = payload;

            return {
                ...state,
                uid,
                email,
                emailVerified,
            };
        },

        setUserDetails (state, payload) {
            const {
                firstName, lastName, signedUp, role, tickets,
            } = payload;
            let ticketsArray = [];
            if (tickets && typeof tickets === 'object') {
                Object.keys(tickets).map(item => {
                    ticketsArray.push(tickets[item]);
                });
            }

            return {
                ...state,
                firstName,
                lastName,
                signedUp,
                role,
                tickets: ticketsArray,
            };
        },

        resetUser () {
            return {
                locale: Localization.locale.includes('fr') ? 'fr' : 'en',
            };
        },

        switchUserLanguage (state) {
            i18n.locale = state.locale === 'en' ? 'fr' : 'en';
            return {
                ...state,
                locale: (state.locale === 'en') ? 'fr' : 'en',
            };
        },
    },

    effects: dispatch => ({

        /**
         * Sign Up
         *
         * @param {object} formData - data from form
         * @return {Promise}
         */
        signUp (formData) {
            const {
                email, password, password2, firstName, lastName,
            } = formData;

            return new Promise(async (resolve, reject) => {
                if (!firstName) return reject({ code: 'missingFirstName' });
                if (!lastName) return reject({ code: 'missingLastName' });
                if (!email) return reject({ code: 'missingEmail' });
                if (!password) return reject({ code: 'missingPassword' });
                if (!password2) return reject({ code: 'missingPassword' });
                if (password !== password2) return reject({ code: 'passwordsDontMatch' });

                return Firebase.auth().createUserWithEmailAndPassword(email, password)
                    .then((res) => {
                        if (res && res.user.uid) {
                            FirebaseRef.child(`users/${res.user.uid}`).set({
                                firstName,
                                lastName,
                                signedUp: Firebase.database.ServerValue.TIMESTAMP,
                                lastLoggedIn: Firebase.database.ServerValue.TIMESTAMP,
                            }).then(resolve);
                        }
                    }).catch(reject);
            }).catch((err) => { throw 'errors.' + err.code; });
        },

        /**
         * Listen for realtime updates on the current user
         */
        listenForMemberProfileUpdates () {
            const UID = (
                FirebaseRef
                && Firebase
                && Firebase.auth()
                && Firebase.auth().currentUser
                && Firebase.auth().currentUser.uid
            ) ? Firebase.auth().currentUser.uid : null;

            if (!UID) return false;

            const ref = FirebaseRef.child(`users/${UID}`);

            return ref.on('value', (snapshot) => {
                const userData = snapshot.val() || [];

                this.setUserDetails(userData);
            });
        },

        /**
         * Get the current Member's Details
         *
         * @returns {Promise}
         */
        getMemberData () {
            if (Firebase === null) return new Promise(resolve => resolve);

            return new Promise((resolve, reject) => {

                const UID = Firebase.auth().currentUser.uid;
                if (!UID) return reject({ code: 'memberNotAuthd' });

                Firebase.auth().onAuthStateChanged((loggedIn) => {
                    if (loggedIn) {
                        this.listenForMemberProfileUpdates(dispatch);
                        return resolve();
                    }

                    return new Promise(() => resolve);
                });
            }).catch((err) => { throw 'errors.' + err.code; });
        },

        /**
         * Login to Firebase with Email/Password
         *
         * @param {object} formData - data from form
         * @return {Promise}
         */
        login (formData) {
            const { email, password } = formData;

            return new Promise(async (resolve, reject) => {
                if (!email || email.length === 0) return reject({ code: 'missingEmail' });
                if (!password || password.length === 0) return reject({ code: 'missingPassword' });

                return Firebase.auth().setPersistence(Firebase.auth.Auth.Persistence.LOCAL)
                    .then(() => Firebase.auth().signInWithEmailAndPassword(email, password)
                        .then(async (res) => {
                            const userDetails = res && res.user ? res.user : null;

                            this.setUserLogin(userDetails);

                            if (userDetails.uid) {
                                await FirebaseRef.child(`users/${userDetails.uid}`).update({
                                    lastLoggedIn: Firebase.database.ServerValue.TIMESTAMP,
                                });

                                if (userDetails.emailVerified === false) {
                                    Firebase.auth().currentUser.sendEmailVerification()
                                        .catch(() => console.log('Verification email failed to send'));
                                }

                                this.listenForMemberProfileUpdates(dispatch);
                            }

                            return resolve();
                        }).catch(reject));
            }).catch((err) => { throw 'errors.' + err.code; });
        },

        /**
         * Reset Password
         *
         * @param {object} formData - data from form
         * @return {Promise}
         */
        resetPassword (formData) {
            const { email } = formData;

            return new Promise(async (resolve, reject) => {
                if (!email) return reject({ code: 'missingEmail' });

                return Firebase.auth().sendPasswordResetEmail(email)
                    .then(() => {
                        this.resetUser();
                        resolve();
                    }).catch(reject);
            }).catch((err) => { throw 'errors.' + err.code; });
        },

        /**
         * Update Profile
         *
         * @param {object} formData - data from form
         * @return {Promise}
         */
        updateProfile (formData) {
            const {
                email, password, password2, firstName, lastName, changeEmail, changePassword,
            } = formData;

            return new Promise(async (resolve, reject) => {
                const UID = Firebase.auth().currentUser.uid;
                if (!UID) return reject({ code: 'memberNotAuthd' });

                // Validation rules
                if (!firstName) return reject({ code: 'missingFirstName' });
                if (!lastName) return reject({ code: 'missingLastName' });
                if (changeEmail) {
                    if (!email) return reject({ code: 'missingEmail' });
                }
                if (changePassword) {
                    if (!password) return reject({ code: 'missingPassword' });
                    if (!password2) return reject({ code: 'missingPassword' });
                    if (password !== password2) return reject({ code: 'passwordsDontMatch' });
                }

                // Go to Firebase
                return FirebaseRef.child(`users/${UID}`).update({ firstName, lastName })
                    .then(async () => {
                        // Update Email address
                        if (changeEmail) {
                            await Firebase.auth().currentUser.updateEmail(email).catch(reject);
                        }

                        // Change the Password
                        if (changePassword) {
                            await Firebase.auth().currentUser.updatePassword(password).catch(reject);
                        }

                        return resolve();
                    }).catch(reject);
            }).catch((err) => { throw 'errors.' + err.code; });
        },

        /**
         * Logout
         *
         * @returns {Promise}
         */
        logout () {
            return new Promise((resolve, reject) => Firebase.auth().signOut()
                .then(() => {
                    this.resetUser();
                    resolve();
                }).catch(reject)).catch((err) => { throw 'errors.' + err.code; });
        },

        /**
         * Check if member is connected
         *
         * @returns {Promise}
         */
        isConnected () {
            // Ensure token is up to date
            return new Promise((resolve, reject) => {

                if (Firebase === null) return reject();

                Firebase.auth().onAuthStateChanged((user) => {
                    if (user !== null) {
                        this.setUserLogin(user);
                        return resolve();
                    }

                    return reject();
                });
            });
        },

        /**
         * send push token
         *
         * @returns {Promise}
         */
        sendPushToken (token) {
            return new Promise(async (resolve, reject) => {
                // Are they a user?
                const UID = Firebase.auth().currentUser ? Firebase.auth().currentUser.uid : null;
                if (!UID) return reject({ code: 'errors.memberNotAuthd' });

                FirebaseRef.child(`users/${UID}`).update({ pushToken: token })
                    .then(resolve)
                    .catch(reject);
            });
        },

        /**
         * send push token
         *
         * @returns {Promise}
         */
        switchLanguage () {
            dispatch.member.switchUserLanguage(dispatch);
        },

        /**
         * Validate Ticket
         *
         * @return {Promise}
         */
        validateTicket ({ userId, ticketId }) {
            if (Firebase === null || !Firebase.auth().currentUser) return new Promise(resolve => resolve(false));
            const validateTicket = Firebase.functions().httpsCallable('validateTicket');

            return new Promise((resolve, reject) =>
                validateTicket({ userId, scanId: ticketId })
                    .then(v => {
                        console.log(v.data.errorData);
                        resolve(v.data ? v.data.text : '');
                    })
                    .catch(err => {
                        console.log(err);
                        reject({});
                    }),
            );
        },
    }),
};
