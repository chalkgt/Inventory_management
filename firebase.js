// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCCLoY-TpRy1UFG3Trt80AeGSQ0_v0P7Vc",
  authDomain: "inventory-management-cb0e9.firebaseapp.com",
  projectId: "inventory-management-cb0e9",
  storageBucket: "inventory-management-cb0e9.appspot.com",
  messagingSenderId: "661288266559",
  appId: "1:661288266559:web:5a00be1bfa1b65a700018a",
  measurementId: "G-9SSCL2QW49"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const firestore = getFirestore(app);
export { firestore };
