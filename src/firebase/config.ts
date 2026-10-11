import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getAuth, type Auth } from 'firebase/auth';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

let firebaseApp: FirebaseApp | null = null;
let firestoreDb: Firestore | null = null;
let firebaseAuth: Auth | null = null;

// Firebase default configuration fallback if applet config is pending or offline
const fallbackFirebaseConfig = {
  apiKey: "AIzaSyFakeKeyForLocalPreviewMode12345",
  authDomain: "messmitra-dev.firebaseapp.com",
  projectId: "messmitra-ideathon-2026",
  storageBucket: "messmitra-dev.appspot.com",
  messagingSenderId: "38967215168",
  appId: "1:38967215168:web:5562263f5d5b4017",
};

try {
  if (getApps().length === 0) {
    firebaseApp = initializeApp(fallbackFirebaseConfig);
  } else {
    firebaseApp = getApps()[0];
  }
  firestoreDb = getFirestore(firebaseApp);
  firebaseAuth = getAuth(firebaseApp);
} catch (err) {
  console.warn("Firebase client initialized with offline mode:", err);
}

export const app = firebaseApp;
export const db = firestoreDb;
export const auth = firebaseAuth;

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const currentAuth = firebaseAuth?.currentUser;
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: currentAuth?.uid,
      email: currentAuth?.email,
      emailVerified: currentAuth?.emailVerified,
      isAnonymous: currentAuth?.isAnonymous,
      tenantId: currentAuth?.tenantId,
      providerInfo: currentAuth?.providerData?.map((provider) => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}
