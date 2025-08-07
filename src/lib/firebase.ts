import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD_6-b9dZyiuwxxSV3nV1OnmP6fzq5nHxg",
  authDomain: "ziravoweb.firebaseapp.com",
  projectId: "ziravoweb",
  storageBucket: "ziravoweb.firebasestorage.app",
  messagingSenderId: "427271506002",
  appId: "1:427271506002:web:f8b471d8a4e10fb4acf78b",
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
