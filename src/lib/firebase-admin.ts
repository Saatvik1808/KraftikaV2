
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// IMPORTANT: Path to your service account key file
// Download this from your Firebase Project Settings -> Service accounts
const serviceAccount = require('./kraftika-scents-firebase-adminsdk-fbsvc-d9615f23ce.json');

if (!getApps().length) {
  initializeApp({
    credential: cert(serviceAccount)
  });
}

const db = getFirestore();

export { db };
