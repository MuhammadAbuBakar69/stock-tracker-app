"use client";

import { initializeApp, getApps, type FirebaseOptions } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut as firebaseSignOut, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? '',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? '',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? '',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ?? '',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? '',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ?? '',
};

function ensureInitialized() {
  if (!getApps().length) {
    // Basic runtime validation to help surface misconfigured env vars quickly.
    const missing = Object.entries(firebaseConfig).filter(([, v]) => !v).map(([k]) => k);
    if (missing.length) {
      console.warn('Firebase initialization: missing NEXT_PUBLIC_FIREBASE_* env vars:', missing);
    }

    try {
      initializeApp(firebaseConfig);
      console.info('Firebase initialized (client)');
    } catch (err) {
      console.error('Firebase initialization failed', err);
      throw err;
    }
  }
}

export async function signInWithGoogle() {
  ensureInitialized();
  const auth = getAuth();
  const provider = new GoogleAuthProvider();
  const db = getFirestore();
  const result = await signInWithPopup(auth, provider);
  try {
    const user = result.user;
    await setDoc(doc(db, 'users', user.uid), {
      id: user.uid,
      email: user.email,
      name: user.displayName,
      provider: 'google'
    }, { merge: true });
  } catch {
    // ignore write errors from client-side instrumentation
  }
  return result.user;
}

export async function signInWithEmail(email: string, password: string) {
  ensureInitialized();
  const auth = getAuth();
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return result.user;
  } catch (err) {
    console.error('signInWithEmail error', err);
    throw err;
  }
}

export async function signUpWithEmailFirebase(email: string, password: string, fullName?: string) {
  ensureInitialized();
  const auth = getAuth();
  const db = getFirestore();
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    const user = result.user;
    if (fullName) {
      try {
        await setDoc(doc(db, 'users', user.uid), {
          id: user.uid,
          email: user.email,
          name: fullName,
          provider: 'email'
        }, { merge: true });
      } catch {
        // ignore write errors from client-side instrumentation
      }
    }
    return user;
  } catch (err) {
    console.error('signUpWithEmailFirebase error', err);
    throw err;
  }
}

export async function signOutFirebase() {
  ensureInitialized();
  const auth = getAuth();
  return firebaseSignOut(auth);
}

export function onAuthChange(callback: (user: { id: string; name?: string | null; email?: string | null; photoURL?: string | null } | null) => void) {
  ensureInitialized();
  const auth = getAuth();
  return onAuthStateChanged(auth, (u) => {
    if (!u) return callback(null);
    callback({ id: u.uid, name: u.displayName, email: u.email, photoURL: u.photoURL });
  });
}

/**
 * Wait for Firebase auth state to become non-null.
 * Resolves with the user object or null if timeout.
 */
export function waitForAuth(timeoutMs = 10000): Promise<{ id: string; name?: string | null; email?: string | null; photoURL?: string | null } | null> {
  ensureInitialized();
  const auth = getAuth();
  return new Promise((resolve) => {
    let resolved = false;
    const unsub = onAuthStateChanged(auth, (u) => {
      if (u && !resolved) {
        resolved = true;
        unsub();
        resolve({ id: u.uid, name: u.displayName, email: u.email, photoURL: u.photoURL });
      }
    });
    // Fallback: resolve null after timeout
    setTimeout(() => {
      if (!resolved) {
        resolved = true;
        try { unsub(); } catch {}
        resolve(null);
      }
    }, timeoutMs);
  });
}
