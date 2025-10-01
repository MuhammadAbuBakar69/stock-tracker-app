// Server-side Better Auth actions removed during migration to Firebase.
// Use the client-side Firebase helpers in `lib/firebase/client.ts` for
// sign-in, sign-up, and sign-out flows.

export const signUpWithEmail = async () => {
  throw new Error('signUpWithEmail server action removed; use Firebase client methods');
}

export const signInWithEmail = async () => {
  throw new Error('signInWithEmail server action removed; use Firebase client methods');
}

export const signOut = async () => {
  throw new Error('signOut server action removed; use Firebase client methods');
}
