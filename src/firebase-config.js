// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID,
  measurementId: import.meta.env.VITE_MEASUREMENT_ID,
};
// const firebaseConfig = {
//   apiKey: "AIzaSyDqRjgFbA9-hUqa4X7_dbaChBdYStQIYQI",
//   authDomain: "mitrakita-aae5a.firebaseapp.com",
//   projectId: "mitrakita-aae5a",
//   storageBucket: "mitrakita-aae5a.firebasestorage.app",
//   messagingSenderId: "655032681185",
//   appId: "1:655032681185:web:8dfd8a92323e01381ceda0",
//   measurementId: "G-8K5CE0CL5J",
// };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);

export default db;
export { auth };
export { app, analytics };
