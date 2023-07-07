// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { GoogleAuthProvider, getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: `${process.env.REACT_APP_FIREBASE_API_KEY}`,
  authDomain: "fir-tutorial-27792.firebaseapp.com",
  projectId: "fir-tutorial-27792",
  storageBucket: "fir-tutorial-27792.appspot.com",
  messagingSenderId: "450109287482",
  appId: "1:450109287482:web:9de5280e8a6d8f5fa55903",
  measurementId: "G-DXRVB8KMSK",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const database = getFirestore(app);
