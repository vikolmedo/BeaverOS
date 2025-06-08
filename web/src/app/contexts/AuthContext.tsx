// web/src/app/contexts/AuthContext.tsx
// This file defines a React context to manage Firebase authentication state.
// It allows any component within the application to access the authenticated user
// and authentication functions (signIn, signOut, etc.).
// It also now exports the initialized Firebase Auth and Firestore instances.

"use client"; // Marks this file as a client component in Next.js

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { initializeApp, FirebaseApp, getApps, getApp } from "firebase/app";
import {
  getAuth,
  User,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  Auth,
} from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth"; // Import createUserWithEmailAndPassword

// Define Firebase environment variables
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Global variables for Firebase app, auth, and db instances
let app: FirebaseApp | undefined;
let authInstance: Auth | undefined;
let dbInstance: Firestore | undefined;

// Initialize Firebase only once, robustly check for existing app
if (typeof window !== "undefined") {
  // Ensure this runs only on the client-side
  if (!getApps().length) {
    // Only initialize if no app exists
    try {
      app = initializeApp(firebaseConfig);
      authInstance = getAuth(app);
      dbInstance = getFirestore(app);
      console.log("Firebase initialized successfully in AuthContext.");
    } catch (error: any) {
      console.error("Firebase initialization error in AuthContext:", error);
    }
  } else {
    // If app already exists, get its instances
    app = getApp();
    authInstance = getAuth(app);
    dbInstance = getFirestore(app);
    console.log(
      "Firebase already initialized, retrieved existing app instances."
    );
  }
}

// Export the initialized auth and db instances directly
export const auth = authInstance;
export const db = dbInstance;

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  registerUser: (email: string, password: string) => Promise<void>; // Added registerUser to type
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth) {
      console.error(
        "Firebase Auth is not available. Check AuthContext initialization."
      );
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
      if (user) {
        console.log("AuthContext: Auth State Changed - User is:", user.uid);
      } else {
        console.log("AuthContext: Auth State Changed - No user is signed in.");
      }
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    if (!auth) throw new Error("Firebase Auth is not initialized.");
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signOut = async () => {
    if (!auth) throw new Error("Firebase Auth is not initialized.");
    await firebaseSignOut(auth);
  };

  const registerUser = async (email: string, password: string) => {
    // Implemented registerUser
    if (!auth) throw new Error("Firebase Auth is not initialized.");
    await createUserWithEmailAndPassword(auth, email, password);
  };

  const value = {
    currentUser,
    loading,
    signIn,
    signOut,
    registerUser, // Provided registerUser in the context value
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
