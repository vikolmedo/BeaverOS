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
import { initializeApp, FirebaseApp } from "firebase/app";
import {
  getAuth,
  User,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  Auth,
} from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";

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

// Initialize Firebase only once
if (typeof window !== "undefined" && !app) {
  try {
    app = initializeApp(firebaseConfig);
    authInstance = getAuth(app);
    dbInstance = getFirestore(app);
    console.log("Firebase initialized successfully in AuthContext.");
  } catch (error: any) {
    // Handle the "already-exists" error gracefully during hot-reloads
    // In development, this can fire multiple times, but we only care about the first init.
    if (!error.code || error.code !== "app/duplicate-app") {
      console.error("Firebase initialization error in AuthContext:", error);
    }
    // If it's a duplicate-app error, it means it's already initialized, so we can ignore.
    // For other errors, ensure instances are cleared.
    if (error.code && error.code !== "app/duplicate-app") {
      app = undefined;
      authInstance = undefined;
      dbInstance = undefined;
    }
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

  const value = {
    currentUser,
    loading,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
