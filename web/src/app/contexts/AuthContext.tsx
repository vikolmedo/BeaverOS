// web/src/app/contexts/AuthContext.tsx
"use client";

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
  signInAnonymously,
  signInWithCustomToken,
  signOut as firebaseSignOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  User,
  onAuthStateChanged,
  Auth,
} from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  db: Firestore | null;
  auth: Auth | null;
  signOut: () => Promise<void>;
  signInAnonymously: () => Promise<void>;
  signInUser: (email: string, password: string) => Promise<User>;
  registerUser: (email: string, password: string) => Promise<User>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [db, setDb] = useState<Firestore | null>(null);
  const [auth, setAuth] = useState<Auth | null>(null);

  // Directly access environment variables via process.env.
  // These are expected to be defined at build time via .env.local or similar Next.js env config.
  const APP_ID = process.env.NEXT_PUBLIC_APP_ID || "default-canvas-app";
  const FIREBASE_API_KEY = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  const FIREBASE_AUTH_DOMAIN = process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN;
  const FIREBASE_PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const FIREBASE_STORAGE_BUCKET =
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
  const FIREBASE_MESSAGING_SENDER_ID =
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID;
  const FIREBASE_APP_ID = process.env.NEXT_PUBLIC_FIREBASE_APP_ID; // This is Firebase's app ID
  const FIREBASE_MEASUREMENT_ID =
    process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID; // Optional
  const INITIAL_AUTH_TOKEN = process.env.NEXT_PUBLIC_INITIAL_AUTH_TOKEN; // Optional custom auth token

  // Construct Firebase config object
  const firebaseConfig = {
    apiKey: FIREBASE_API_KEY,
    authDomain: FIREBASE_AUTH_DOMAIN,
    projectId: FIREBASE_PROJECT_ID,
    storageBucket: FIREBASE_STORAGE_BUCKET,
    messagingSenderId: FIREBASE_MESSAGING_SENDER_ID,
    appId: FIREBASE_APP_ID,
    measurementId: FIREBASE_MEASUREMENT_ID,
  };

  // Check if critical Firebase config variables are available
  const isFirebaseConfigValid = !!(
    firebaseConfig.apiKey &&
    firebaseConfig.projectId &&
    firebaseConfig.appId
  );

  // Log gathered config for debugging
  useEffect(() => {
    console.log("DEBUG: AuthContext - APP_ID from process.env:", APP_ID);
    console.log(
      "DEBUG: AuthContext - Firebase Config from process.env:",
      firebaseConfig
    );
    console.log(
      "DEBUG: AuthContext - INITIAL_AUTH_TOKEN from process.env:",
      INITIAL_AUTH_TOKEN ? "DEFINED" : "UNDEFINED"
    );
    console.log(
      "DEBUG: AuthContext - isFirebaseConfigValid:",
      isFirebaseConfigValid
    );
  }, [
    APP_ID,
    JSON.stringify(firebaseConfig),
    INITIAL_AUTH_TOKEN,
    isFirebaseConfigValid,
  ]);

  // Firebase initialization logic
  useEffect(() => {
    // Only proceed if Firebase config is valid
    if (!isFirebaseConfigValid) {
      console.error(
        "ERROR: AuthContext - Missing one or more critical Firebase environment variables (NEXT_PUBLIC_FIREBASE_API_KEY, NEXT_PUBLIC_FIREBASE_PROJECT_ID, NEXT_PUBLIC_FIREBASE_APP_ID). Firebase will not initialize."
      );
      setLoading(false); // Stop loading, indicate error
      return;
    }

    let appInstance: FirebaseApp;

    if (getApps().length === 0) {
      try {
        appInstance = initializeApp(firebaseConfig);
        console.log("Firebase app initialized in AuthContext.");
      } catch (initError: any) {
        console.error(
          "ERROR: AuthContext - Firebase initializeApp failed:",
          initError.message,
          initError
        );
        setLoading(false);
        return;
      }
    } else {
      appInstance = getApp();
      console.log(
        "Firebase app already initialized, retrieving existing instance in AuthContext."
      );
    }

    const firebaseAuth = getAuth(appInstance);
    const firestoreDb = getFirestore(appInstance);

    setAuth(firebaseAuth);
    setDb(firestoreDb);

    const unsubscribe = onAuthStateChanged(firebaseAuth, async (user) => {
      if (user) {
        setCurrentUser(user);
        console.log("AuthContext: Auth State Changed - User is:", user.uid);
      } else {
        if (INITIAL_AUTH_TOKEN) {
          // Use the process.env token
          try {
            await signInWithCustomToken(firebaseAuth, INITIAL_AUTH_TOKEN);
            console.log("AuthContext: Signed in with custom token.");
          } catch (error) {
            console.error(
              "AuthContext: Error signing in with custom token:",
              error
            );
            try {
              await signInAnonymously(firebaseAuth);
              console.log(
                "AuthContext: Signed in anonymously after custom token failed."
              );
            } catch (anonError) {
              console.error(
                "AuthContext: Error signing in anonymously:",
                anonError
              );
            }
          }
        } else {
          try {
            await signInAnonymously(firebaseAuth);
            console.log(
              "AuthContext: Signed in anonymously (no custom token)."
            );
          } catch (anonError) {
            console.error(
              "AuthContext: Error signing in anonymously:",
              anonError
            );
          }
        }
        setCurrentUser(firebaseAuth.currentUser);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [isFirebaseConfigValid]); // Re-run only if config validity changes

  const signOutUser = async () => {
    if (auth) {
      await firebaseSignOut(auth);
      setCurrentUser(null);
    }
  };

  const signInAnonymouslyUser = async () => {
    if (auth) {
      await signInAnonymously(auth);
      setCurrentUser(auth.currentUser);
    }
  };

  const signInUser = async (email: string, password: string): Promise<User> => {
    if (!auth) throw new Error("Auth service not initialized.");
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      setCurrentUser(userCredential.user);
      return userCredential.user;
    } catch (error) {
      console.error("Error signing in with email/password:", error);
      throw error;
    }
  };

  const registerUser = async (
    email: string,
    password: string
  ): Promise<User> => {
    if (!auth) throw new Error("Auth service not initialized.");
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      setCurrentUser(userCredential.user);
      return userCredential.user;
    } catch (error) {
      console.error("Error registering user:", error);
      throw error;
    }
  };

  // Render a specific error message if config is clearly bad
  if (!isFirebaseConfigValid) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-beaverNeutral-light p-4 text-center">
        <h2 className="text-2xl font-bold text-error mb-4">
          Configuration Error: Firebase Environment Variables Missing
        </h2>
        <p className="text-gray-700 mb-2">
          Essential Firebase environment variables are not loaded.
        </p>
        <p className="text-gray-700 mb-2">
          Please ensure your `.env.local` file (in the root of your `web`
          directory) contains:
        </p>
        <pre className="bg-gray-100 p-4 rounded-md text-left text-sm font-mono whitespace-pre-wrap break-all my-4">
          NEXT_PUBLIC_FIREBASE_API_KEY=
          <span className="text-purple-600">your-api-key</span>
          <br />
          NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
          <span className="text-purple-600">your-auth-domain</span>
          <br />
          NEXT_PUBLIC_FIREBASE_PROJECT_ID=
          <span className="text-purple-600">your-project-id</span>
          <br />
          NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
          <span className="text-purple-600">your-storage-bucket</span>
          <br />
          NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
          <span className="text-purple-600">your-messaging-sender-id</span>
          <br />
          NEXT_PUBLIC_FIREBASE_APP_ID=
          <span className="text-purple-600">your-firebase-app-id</span>
          <br />
          {/* Optional: NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXX */}
          {/* Optional: NEXT_PUBLIC_INITIAL_AUTH_TOKEN=your-custom-token */}
        </pre>
        <p className="text-sm text-gray-500">
          Restart your development server after creating/updating the
          `.env.local` file.
        </p>
      </div>
    );
  }

  // Show a general loading message while authentication is in progress
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-beaverNeutral-light">
        Initializing authentication...
      </div>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        loading,
        db,
        auth,
        signOut: signOutUser,
        signInAnonymously: signInAnonymouslyUser,
        signInUser,
        registerUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
