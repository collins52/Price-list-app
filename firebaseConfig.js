// firebaseConfig.js

// Your web app's Firebase configuration
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

// Initialize services
const db = firebase.firestore();
const storage = firebase.storage();

// Enable offline persistence
firebase.firestore().enablePersistence()
  .then(() => {
    console.log("Offline persistence enabled");

    // Expose db and storage after persistence is ready
    window.db = db;
    window.storage = storage;

    // Notify other scripts
    document.dispatchEvent(new Event("firebase-ready"));
  })
  .catch((err) => {
    if (err.code === 'failed-precondition') {
      console.warn('Multiple tabs open — persistence only works in one tab.');
    } else if (err.code === 'unimplemented') {
      console.warn('Persistence not supported in this browser.');
    } else {
      console.warn("Persistence error:", err);
    }
  });
