import "firebase/auth";

import * as FirebaseCore from "expo-firebase-core";

import firebase from "firebase";

if (!firebase.apps.length) {
  try {
    firebase.initializeApp(FirebaseCore.DEFAULT_APP_OPTIONS);
    // firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION);
  } catch (error) {
    //console.log(error);
  }
}
const firebaseInstance = firebase;

export default firebaseInstance;