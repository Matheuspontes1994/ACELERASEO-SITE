import { initializeApp } from 'firebase/app';
import { getAuth, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import firebaseConfig from '../firebase-applet-config.json';

import { logger } from './lib/logger';

let db: any;
let auth: any;
let storage: any;

try {
  const app = initializeApp(firebaseConfig);
  db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
  auth = getAuth(app);
  storage = getStorage(app);
  
  // Define explicit persistence to prevent session loss in iframes
  setPersistence(auth, browserLocalPersistence).catch((err) => {
    logger.error("Firebase persistence error", err);
  });
} catch (error) {
  logger.error("Firebase initialization failed", error);
}

export { db, auth, storage };
