import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyA-7_XCWbXordnhI81sN6r2DJRE-IcBtCs",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "trust-paw.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "trust-paw",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "trust-paw.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "1066417077609",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:1066417077609:web:b4982e6cd34080dc8851f8",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-JYBPBBKB2L"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
export const auth = getAuth(app);

// Configure Google Auth Provider
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

export default app;
