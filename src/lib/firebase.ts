import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAbszwlaVEbOejXJm6fMPP84xwL7JnfDqk",
  authDomain: "veritas-646ca.firebaseapp.com",
  projectId: "veritas-646ca",
  storageBucket: "veritas-646ca.firebasestorage.app",
  messagingSenderId: "284704791078",
  appId: "1:284704791078:web:37c8f0a177e6bc0341a4e7",
  measurementId: "G-07VGJT5YGJ"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
