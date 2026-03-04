import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebase';

const AuthContext = createContext(null);

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      setLoading(false);
    });
    return unsub;
  }, []);

  async function saveUserProfile(user) {
    const ref = doc(db, 'users', user.uid);
    await setDoc(ref, {
      displayName: user.displayName,
      email:       user.email,
      photoURL:    user.photoURL,
      updatedAt:   serverTimestamp(),
    }, { merge: true });
  }

  async function signInWithGoogle() {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    await saveUserProfile(result.user);
    return result.user;
  }

  async function signInWithFacebook() {
    const provider = new FacebookAuthProvider();
    const result = await signInWithPopup(auth, provider);
    await saveUserProfile(result.user);
    return result.user;
  }

  async function signOut() {
    await firebaseSignOut(auth);
  }

  return (
    <AuthContext.Provider value={{ currentUser, loading, signInWithGoogle, signInWithFacebook, signOut }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
