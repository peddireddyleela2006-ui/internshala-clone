// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

import {
  getAuth,
  GoogleAuthProvider,
} from "firebase/auth";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC39p6x8gxbk5_FTXqx6ChdVORbqTGy3PM",
  authDomain: "internera-c4685.firebaseapp.com",
  projectId: "internera-c4685",
  storageBucket: "internera-c4685.firebasestorage.app",
  messagingSenderId: "66767654016",
  appId: "1:66767654016:web:c61051efa1664716acaa65",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Authentication
const auth = getAuth(app);

// Providers
const provider = new GoogleAuthProvider();

// Export
export { auth, provider };