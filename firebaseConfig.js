// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Firestore and Storage
const db = firebase.firestore();
const storage = firebase.storage();

// Export for use in other scripts
window.db = db;
window.storage = storage;

db.enablePersistence()
  .catch(function(err) {
    if (err.code == 'failed-precondition') {
      console.warn("Multiple tabs open, persistence can only be enabled in one tab at a time.");
    } else if (err.code == 'unimplemented') {
      console.warn("Persistence is not available in this browser.");
    }
  });
  
