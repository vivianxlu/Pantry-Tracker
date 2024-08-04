// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCyadEBsiO2cxbwaMBstv2bbSoMscH7fTE",
  authDomain: "pantry-tracker-250x.firebaseapp.com",
  projectId: "pantry-tracker-250x",
  storageBucket: "pantry-tracker-250x.appspot.com",
  messagingSenderId: "694253819666",
  appId: "1:694253819666:web:6b5f40685e5bb9e27805cb",
  measurementId: "G-H82WR3KRT5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export {firestore}