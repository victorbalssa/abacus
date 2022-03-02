import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import firebaseConfig from '../constants/firebase';

const {
  apiKey, authDomain, databaseURL, projectId,
} = firebaseConfig;

let firebaseInitialized = false;

if (apiKey && authDomain && databaseURL && projectId) {
    firebase.initializeApp({
    apiKey, authDomain, databaseURL, projectId
  });

  firebaseInitialized = true;
}

export const FirebaseRef = firebaseInitialized ? firebase.database().ref() : null;
export const Firebase = firebaseInitialized ? firebase : null;
