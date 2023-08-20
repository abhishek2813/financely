// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyA9KO48Tigxl1HN07wxLvYU-lsXA5Pukm8",
    authDomain: "finance-tracker-dbaad.firebaseapp.com",
    projectId: "finance-tracker-dbaad",
    storageBucket: "finance-tracker-dbaad.appspot.com",
    messagingSenderId: "145728740555",
    appId: "1:145728740555:web:c9cc2b80025f3ddd56cf4e",
    measurementId: "G-FXJKRYFFXT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const db = getFirestore(app)
const auth = getAuth(app)
const provider = new GoogleAuthProvider();
export { db, auth, provider };