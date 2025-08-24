
// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
// IMPORTANT: Do not remove or modify this object, it is fetched from the server.
const firebaseConfig = {
  "projectId": "kraftika-scents",
  "appId": "1:185008785004:web:46c12991e51a8cb8fa7a49",
  "storageBucket": "kraftika-scents.firebasestorage.app",
  "apiKey": "AIzaSyC5fUKR-lXoNxA3Z8SjpPOaYIGcQ7pDa4k",
  "authDomain": "kraftika-scents.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "185008785004"
};


// Initialize Firebase
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
