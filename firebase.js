// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';


// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDc513jvf1NQV9izBmHZNacc3jHoO0YfPk",
    authDomain: "finance-tracker-app-fa0d5.firebaseapp.com",
    projectId: "finance-tracker-app-fa0d5",
    storageBucket: "finance-tracker-app-fa0d5.appspot.com",
    messagingSenderId: "60713721510",
    appId: "1:60713721510:web:15a685b74673dc862c1e67",
    measurementId: "G-F80JMTYNHC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { db, auth, provider, doc, setDoc, getDoc };
