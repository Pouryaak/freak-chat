import firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyCcmvc9tfhIpce2I0icpX6tolPvoAQBauA",
  authDomain: "freak-chat-ccf05.firebaseapp.com",
  projectId: "freak-chat-ccf05",
  storageBucket: "freak-chat-ccf05.appspot.com",
  messagingSenderId: "155299335252",
  appId: "1:155299335252:web:41fce91314ea0e82c8b1c1",
};

const app = !firebase.apps.length
  ? firebase.initializeApp(firebaseConfig)
  : firebase.app();

const db = app.firestore();
const auth = app.auth();
const provider = new firebase.auth.GoogleAuthProvider();

export { db, auth, provider };
