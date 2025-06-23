// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  
  authDomain: "mern-network-f1cea.firebaseapp.com",
  projectId: "mern-network-f1cea",
  storageBucket: "mern-network-f1cea.firebasestorage.app",
  messagingSenderId: "852527319708",
  appId: "1:852527319708:web:9e500a2410f2a1e87fbb59",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
