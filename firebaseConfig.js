// firebaseConfig.js
const firebaseConfig = {
  apiKey: "AIzaSyCiQODTxR3ctKqeK2ZsHHPdoO-DiFB3HEY",
  authDomain: "price-list-app-8a733.firebaseapp.com",
  databaseURL: "https://price-list-app-8a733-default-rtdb.firebaseio.com",
  projectId: "price-list-app-8a733",
  storageBucket: "price-list-app-8a733.appspot.com",
  messagingSenderId: "999741806912",
  appId: "1:999741806912:web:168b9980324ba451c082a5",
  measurementId: "G-EJ0330PSPV"
};

// Firebase v8 style
firebase.initializeApp(firebaseConfig);

// Enable offline persistence
firebase.firestore().enablePersistence()
  .then(() => console.log("Offline persistence enabled"))
  .catch((err) => {
    if (err.code === 'failed-precondition') {
      console.warn('Multiple tabs open. Persistence can only be enabled in one tab.');
    } else if (err.code === 'unimplemented') {
      console.warn('Persistence is not supported in this browser.');
    }
  });

const db = firebase.firestore();
const storage = firebase.storage();

window.db = db;
window.storage = storage;
