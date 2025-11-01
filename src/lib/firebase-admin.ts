import admin from "firebase-admin";

// Initialize Firebase Admin only if all required credentials are available
if (!admin.apps.length) {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  
  // Only initialize if project_id is present (required for Firebase Admin)
  if (projectId && typeof projectId === 'string' && projectId.trim() !== '') {
    try {
      const serviceAccount = {
        type: process.env.FIREBASE_TYPE,
        project_id: projectId,
        private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
        private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
        client_email: process.env.FIREBASE_CLIENT_EMAIL,
        client_id: process.env.FIREBASE_CLIENT_ID,
        auth_uri: process.env.FIREBASE_AUTH_URI,
        token_uri: process.env.FIREBASE_TOKEN_URI,
        auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
        client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
      };

      // Validate that required fields are present
      if (serviceAccount.project_id && serviceAccount.private_key && serviceAccount.client_email) {
        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
        });
      }
    } catch (error) {
      console.warn('Firebase Admin initialization skipped:', error instanceof Error ? error.message : 'Unknown error');
    }
  }
}

// Export db and auth, but they may be null if initialization failed
// Use a dummy firestore instance during build if not initialized to avoid type errors
let dbInstance: admin.firestore.Firestore | null = null;
let authInstance: admin.auth.Auth | null = null;

if (admin.apps.length > 0) {
  dbInstance = admin.firestore();
  authInstance = admin.auth();
}

export const db = dbInstance;
export const auth = authInstance;
