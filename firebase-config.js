// Paste your Firebase project's Web App configuration below.
// Firebase web config is designed to be used in browser apps; protect data with Firestore Rules.
window.FIREBASE_CONFIG = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Set this after deploying the passkeys Cloud Function.
window.PASSKEY_API_BASE = "https://us-central1-YOUR_PROJECT_ID.cloudfunctions.net/passkeys";
