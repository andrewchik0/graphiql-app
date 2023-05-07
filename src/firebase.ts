import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { AuthErrorCodes } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

export const mapErrors = (code: string) => {
  switch (code) {
    case AuthErrorCodes.CREDENTIAL_ALREADY_IN_USE:
      return 'This credential is already associated with a different user account.';
    case AuthErrorCodes.EMAIL_EXISTS:
      return 'The email address is already in use.';
    case AuthErrorCodes.INTERNAL_ERROR:
    case AuthErrorCodes.INVALID_AUTH_EVENT:
      return 'An internal AuthError has occurred.';
    case AuthErrorCodes.TIMEOUT:
      return 'The operation has timed out.';
    case AuthErrorCodes.TOKEN_EXPIRED:
      return "The user's credential is no longer valid. The user must sign in again.";
    case AuthErrorCodes.TOO_MANY_ATTEMPTS_TRY_LATER:
      return 'We have blocked all requests from this device due to unusual activity. Try again later.';
    case AuthErrorCodes.USER_DISABLED:
      return 'The user account has been disabled by an administrator.';
    case AuthErrorCodes.USER_DELETED:
    case AuthErrorCodes.INVALID_PASSWORD:
      return 'Invalid E-mail or password.';
    default:
      return code;
  }
};

const app = initializeApp(firebaseConfig);
getAnalytics(app);
