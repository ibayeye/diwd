// Import the functions you need from the SDKs you need
import { getApps, initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import dotenv from 'dotenv';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

dotenv.config();

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB6RwuBz7CTyAM1wT1vvM6B9kkEZwe8vro",
  authDomain: "diwd-web-monitoring.firebaseapp.com",
  databaseURL: "https://diwd-web-monitoring-default-rtdb.firebaseio.com",
  projectId: "diwd-web-monitoring",
  storageBucket: "diwd-web-monitoring.firebasestorage.app",
  messagingSenderId: "785538048849",
  appId: "1:785538048849:web:f364a46d54e85f9d60a970",
  measurementId: "G-EJYEFPQG49"
};

// Initialize Firebase
let firebaseApp;

if (!getApps().length) {
  firebaseApp = initializeApp(firebaseConfig);

  // Check if running in a browser environment
  if (typeof window !== 'undefined') {
    const { getPerformance } = require('firebase/performance');
    getPerformance(firebaseApp);
    console.log("Firebase Performance has been initialized!");
  }

  console.log("Firebase has been initialized!");
} else {
  console.log("Firebase app already initialized!");
  firebaseApp = getApps()[0];
}
const database = getDatabase(firebaseApp); 

export default database;
