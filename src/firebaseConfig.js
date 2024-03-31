// src/firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDU2Fkq6JfBaPiVMvF5tBBvbVBb5MDT7O4",
    authDomain: "codingdoctor-cb726.firebaseapp.com",
    projectId: "codingdoctor-cb726",
    storageBucket: "codingdoctor-cb726.appspot.com",
    messagingSenderId: "286721122694",
    appId: "1:286721122694:web:94a9b61dbbb8997dc04c07"
  };
// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore and Auth
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
