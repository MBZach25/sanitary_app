// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, setPersistence, browserLocalPersistence, browserSessionPersistence, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Platform } from 'react-native';
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
// Initialize Auth
const auth = getAuth(app);

// Set Persistence Based on Platform
if (Platform.OS === 'web') {
  // For Web, use browserLocalPersistence or browserSessionPersistence
  setPersistence(auth, browserLocalPersistence)
    .then(() => {
      // Persistence set successfully for the Web
    })
    .catch((error) => {
      console.error('Error setting persistence for Web:', error);
    });
} else if (Platform.OS === 'android' || Platform.OS === 'ios') {
  // For React Native, use AsyncStorage for persistence
  initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
}

export { auth };