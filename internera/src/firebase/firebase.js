// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyC39p6x8gxbk5_FTXqx6ChdVORbqTGy3PM",
    authDomain: "internera-c4685.firebaseapp.com",
    projectId: "internera-c4685",
    storageBucket: "internera-c4685.firebasestorage.app",
    messagingSenderId: "66767654016",
    appId: "1:66767654016:web:c61051efa1664716acaa65"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
export { auth, provider };