import { initializeApp } from 'firebase/app';
import { getAuth, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import firebaseConfig from '../firebase-applet-config.json';

import { logger } from './lib/logger';

let db: any;
let auth: any;
let storage: any;

try {
  const app = initializeApp(firebaseConfig);
  db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
  
  // Enable Firestore offline persistence
  if (typeof window !== 'undefined' && db) {
    enableIndexedDbPersistence(db).catch((err) => {
      if (err?.code === 'failed-precondition') {
        // Multiple tabs open, persistence can only be enabled in one tab at a time.
        logger.warn("Firestore persistence failed-precondition (multiple tabs open)");
      } else if (err?.code === 'unimplemented') {
        // The current browser does not support all of the features required to enable persistence
        logger.warn("Firestore persistence unimplemented in this browser");
      }
    });
  }

  auth = getAuth(app);
  storage = getStorage(app);
  
  // Define explicit persistence to prevent session loss in iframes
  if (auth) {
    setPersistence(auth, browserLocalPersistence).catch((err) => {
      if (err) {
        logger.warn("Firebase auth persistence notice:", err);
      }
    });
  }
} catch (error) {
  logger.error("Firebase initialization failed", error);
}

export { db, auth, storage };
