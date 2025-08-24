
// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
// IMPORTANT: Do not remove or modify this object, it is fetched from the server.
const firebaseConfig = {
  apiKey: "AIzaSyC5fUKR-lXoNxA3Z8SjpPOaYIGcQ7pDa4k",
  authDomain: "kraftika-scents.firebaseapp.com",
  projectId: "kraftika-scents",
  storageBucket: "kraftika-scents.appspot.com",
  messagingSenderId: "185008785004",
  appId: "1:185008785004:web:46c12991e51a8cb8fa7a49"
};


// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

// Explicitly pass the storage bucket URL to getStorage
const storage = getStorage(app, firebaseConfig.storageBucket);


export { app, auth, db, storage };
