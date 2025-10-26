// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {

  apiKey: "AIzaSyDf7OC3HdcfGpzKjmO7ZXLBWOv3hQ2q4EQ",

  authDomain: "fir-authapp-89819.firebaseapp.com",

  projectId: "fir-authapp-89819",

  storageBucket: "fir-authapp-89819.firebasestorage.app",

  messagingSenderId: "305045164479",

  appId: "1:305045164479:web:5e761184e9bebd4b0a110a"

};



// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);