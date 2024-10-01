// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAt-fZjdT4L_qBhIFgfgjjSiofPTY30kkg",
  authDomain: "business-directory-ab998.firebaseapp.com",
  projectId: "business-directory-ab998",
  storageBucket: "business-directory-ab998.appspot.com",
  messagingSenderId: "935885634529",
  appId: "1:935885634529:web:6b3c431c28fd4c9fd730a0",
  measurementId: "G-8S5GEWDV83"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);