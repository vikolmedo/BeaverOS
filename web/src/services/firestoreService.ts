// web/src/services/firestoreService.ts
// This service handles all interactions with Firebase Firestore for product management.
// It relies on AuthContext for Firebase authentication and database instances.

// Import the initialized Firebase Auth and Firestore instances from AuthContext
import { auth, db } from '../app/contexts/AuthContext';
import {
  signInAnonymously,
  signInWithCustomToken,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut, // Alias signOut to firebaseSignOut
  Auth // Import Auth type
} from 'firebase/auth';
import {
  collection,
  query,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  QuerySnapshot,
  DocumentData
} from 'firebase/firestore';
import { AdminProduct } from '../app/data/admin-products';

// Declare global Canvas variables (provided by the Canvas environment)
declare const __app_id: string | undefined;
declare const __initial_auth_token: string | undefined;

// currentUserId will be managed by AuthContext and exposed via getAuthenticatedUserId
let currentUserIdInternal: string | null = null; // Internal state for user ID in this service

// Promise to signal when auth is ready (derived from AuthContext's internal state)
let authReadyResolveInternal: ((value: string) => void) | null = null;
const authReadyPromiseInternal = new Promise<string>(resolve => { authReadyResolveInternal = resolve; });

// Listen to auth state changes from the AuthContext's auth instance
// This runs only if 'auth' is successfully initialized and imported from AuthContext.
if (auth) {
  // Explicitly assert 'auth' as Auth directly in the onAuthStateChanged call
  onAuthStateChanged(auth as Auth, async (user) => {
    if (user) {
      currentUserIdInternal = user.uid;
      authReadyResolveInternal?.(user.uid);
      console.log("FirestoreService: Auth State Changed - User signed in with UID:", user.uid);
    } else {
      currentUserIdInternal = null;
      console.log("FirestoreService: Auth State Changed - No user is signed in.");

      // Attempt anonymous/custom token sign-in if in Canvas dev environment
      if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
        try {
          const userCredential = await signInWithCustomToken(auth as Auth, __initial_auth_token);
          currentUserIdInternal = userCredential.user.uid;
          authReadyResolveInternal?.(currentUserIdInternal);
          console.log("FirestoreService: Signed in with custom token. UID:", currentUserIdInternal);
        } catch (error) {
          console.error("FirestoreService: Error signing in with custom token:", error);
          // Fallback to anonymous if custom token fails
          try {
            const userCredential = await signInAnonymously(auth as Auth);
            currentUserIdInternal = userCredential.user.uid;
            authReadyResolveInternal?.(currentUserIdInternal);
            console.log("FirestoreService: Signed in anonymously as fallback. UID:", currentUserIdInternal);
          } catch (anonError) {
            console.error("FirestoreService: Error signing in anonymously as fallback:", anonError);
            currentUserIdInternal = `anonymous-error-${crypto.randomUUID().substring(0,8)}`;
            authReadyResolveInternal?.(currentUserIdInternal);
          }
        }
      } else {
        // Always try anonymous if no custom token or not in Canvas, or if custom token failed
        try {
          const userCredential = await signInAnonymously(auth as Auth);
          currentUserIdInternal = userCredential.user.uid;
          authReadyResolveInternal?.(currentUserIdInternal);
          console.log("FirestoreService: Signed in anonymously. UID:", currentUserIdInternal);
        } catch (error) {
          console.error("FirestoreService: Error signing in anonymously:", error);
          currentUserIdInternal = `anonymous-error-${crypto.randomUUID().substring(0,8)}`;
          authReadyResolveInternal?.(currentUserIdInternal);
        }
      }
    }
  });
} else {
    console.warn("FirestoreService: Firebase Auth instance (from AuthContext) is NOT available. Firestore operations might fail.");
    currentUserIdInternal = `anonymous-no-auth-instance-${crypto.randomUUID().substring(0,8)}`;
    authReadyResolveInternal?.(currentUserIdInternal); // Resolve even if auth is not available
}

/**
 * Registers a new user with email and password.
 * @param email - The user's email.
 * @param password - The user's password.
 * @returns The user credential.
 */
export const registerUser = async (email: string, password: string) => {
  if (!auth) {
    await authReadyPromiseInternal; // Ensure auth is ready before attempting operation
    if (!auth) throw new Error("Firebase Auth not initialized after waiting.");
  }
  // Ensure auth is treated as Auth for this call
  return await createUserWithEmailAndPassword(auth as Auth, email, password);
};

/**
 * Signs in a user with email and password.
 * @param email - The user's email.
 * @param password - The user's password.
 * @returns The user credential.
 */
export const signInUser = async (email: string, password: string) => {
  if (!auth) {
    await authReadyPromiseInternal; // Ensure auth is ready before attempting operation
    if (!auth) throw new Error("Firebase Auth not initialized after waiting.");
  }
  // Ensure auth is treated as Auth for this call
  return await signInWithEmailAndPassword(auth as Auth, email, password);
};

/**
 * Signs out the current user.
 */
export const signOutUser = async () => {
  if (!auth) {
    await authReadyPromiseInternal; // Ensure auth is ready before attempting operation
    if (!auth) throw new Error("Firebase Auth not initialized after waiting.");
  }
  // Ensure auth is treated as Auth for this call
  await firebaseSignOut(auth as Auth); // Use aliased signOut function
  currentUserIdInternal = null; // Clear internal user ID on sign out
};

/**
 * Get the currently authenticated user ID.
 * @returns A promise that resolves with the user's UID or null if not authenticated.
 */
export const getAuthenticatedUserId = async (): Promise<string | null> => {
    await authReadyPromiseInternal; // Ensure internal currentUserId is resolved
    return currentUserIdInternal;
};


/**
 * Get the current Firebase Auth instance.
 * @returns The Firebase Auth instance.
 */
export const getFirebaseAuth = () => {
  if (!auth) throw new Error("Firebase Auth not initialized.");
  return auth;
};

const getDb = async () => {
  // Db instance is now imported directly from AuthContext.
  if (!db) {
    throw new Error("Firestore DB is not available. Please ensure Firebase config is complete and correct in AuthContext.");
  }
  return db;
};

const getProductsCollectionPath = async (userIdParam: string) => {
    // Use a more robust default for appId, perhaps ensuring it's never empty
    let appId = (typeof __app_id !== 'undefined' && __app_id) ? __app_id : 'default-canvas-app';
    let userId = userIdParam;

    // Sanitize appId and userId to ensure they don't contain slashes or other invalid characters
    // Replace '/' with '_' and '.' with '-' for consistency.
    appId = appId.replace(/\//g, '_').replace(/\./g, '-');
    userId = userId.replace(/\//g, '_').replace(/\./g, '-');

    // --- NEW LOGGING FOR DEBUGGING PATH SEGMENTS (removed span tags) ---
    console.log(`DEBUG: Sanitized components - appId: "${appId}", userId: "${userId}"`);
    const collectionPath = `artifacts/${appId}/users/${userId}/products`;
    console.log(`DEBUG: Final constructed Firestore collectionPath: "${collectionPath}" (Length: ${collectionPath.split('/').length} segments)`);
    // --- END NEW LOGGING ---

    return collectionPath;
};

/**
 * Subscribes to real-time updates of products for the current authenticated user.
 * @param callback - A callback function that receives the updated list of products.
 * @returns An unsubscribe function to stop listening to updates.
 */
export const subscribeToProducts = async (callback: (products: AdminProduct[]) => void): Promise<() => void> => {
  const userId = await getAuthenticatedUserId();
  if (!userId) {
    console.warn("subscribeToProducts: User not authenticated. Returning empty array and no subscription.");
    callback([]);
    return () => {}; // Return a no-op unsubscribe function
  }
  const dbInstance = await getDb();
  const collectionPath = await getProductsCollectionPath(userId);

  // --- NEW LOGGING FOR DEBUGGING PATH SEGMENTS (removed span tags) ---
  console.log(`DEBUG: Passing to collection() for subscribeToProducts: "${collectionPath}" (Length: ${collectionPath.split('/').length} segments)`);
  // --- END NEW LOGGING ---

  const productsCollection = collection(dbInstance, collectionPath);
  const q = query(productsCollection);

  const unsubscribe = onSnapshot(q, (snapshot: QuerySnapshot<DocumentData>) => {
    const productsList: AdminProduct[] = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      productsList.push({
        id: doc.id,
        name: data.name,
        description: data.description,
        category: data.category,
        price: data.price,
        costPrice: data.costPrice,
        stock: data.stock,
        sku: data.sku,
        barcode: data.barcode,
        supplierId: data.supplierId,
        imageUrl: data.imageUrl,
        images: data.images || [],
        variants: data.variants || [],
        isActive: data.isActive,
        createdAt: data.createdAt,
        lastUpdated: data.lastUpdated
      });
    });
    console.log("Real-time products update from Firestore:", productsList);
    callback(productsList);
  }, (error) => {
    console.error("Error subscribing to products from Firestore:", error);
    callback([]); // Pass empty array on error
  });

  return unsubscribe; // Return the unsubscribe function
};

/**
 * Adds a new product for the current authenticated user.
 * @param newProduct - The product data to add (without id, createdAt, lastUpdated).
 */
export const addProductToFirestore = async (newProduct: Omit<AdminProduct, 'id' | 'createdAt' | 'lastUpdated'>) => {
  const userId = await getAuthenticatedUserId();
  if (!userId) throw new Error("User not authenticated to add product.");
  const dbInstance = await getDb();

  const collectionPath = await getProductsCollectionPath(userId);
  // --- NEW LOGGING FOR DEBUGGING PATH SEGMENTS (removed span tags) ---
  console.log(`DEBUG: Passing to collection() for addProductToFirestore: "${collectionPath}" (Length: ${collectionPath.split('/').length} segments)`);
  // --- END NEW LOGGING ---

  const now = new Date().toISOString().split('T')[0]; // FormatYYYY-MM-DD
  const productData = {
      ...newProduct,
      createdAt: now,
      lastUpdated: now,
  };
  await addDoc(collection(dbInstance, collectionPath), productData);
  console.log("Product added to Firestore:", productData.name);
};

/**
 * Updates an existing product for the current authenticated user.
 * @param updatedProduct - The product data to update (must include id).
 */
export const updateProductInFirestore = async (updatedProduct: AdminProduct) => {
  const userId = await getAuthenticatedUserId();
  if (!userId) throw new Error("User not authenticated to update product.");
  const dbInstance = await getDb();

  const collectionPath = await getProductsCollectionPath(userId);
  // --- NEW LOGGING FOR DEBUGGING PATH SEGMENTS (removed span tags) ---
  console.log(`DEBUG: Passing to doc() for updateProductInFirestore: Collection Path "${collectionPath}" (Length: ${collectionPath.split('/').length} segments), Document ID "${updatedProduct.id}"`);
  // --- END NEW LOGGING ---

  const productRef = doc(dbInstance, collectionPath, updatedProduct.id); // This takes a collection ref and a document ID
  const now = new Date().toISOString().split('T')[0]; // FormatYYYY-MM-DD
  const productData = {
      ...updatedProduct,
      lastUpdated: now,
  };
  await updateDoc(productRef, productData);
  console.log("Product updated in Firestore:", updatedProduct.name);
};

/**
 * Deletes a product for the current authenticated user.
 * @param productId - The ID of the product to delete.
 */
export const deleteProductFromFirestore = async (productId: string) => {
  const userId = await getAuthenticatedUserId();
  if (!userId) throw new Error("User not authenticated to delete product.");
  const dbInstance = await getDb();

  const collectionPath = await getProductsCollectionPath(userId);
  // --- NEW LOGGING FOR DEBUGGING PATH SEGMENTS (removed span tags) ---
  console.log(`DEBUG: Passing to doc() for deleteProductFromFirestore: Collection Path "${collectionPath}" (Length: ${collectionPath.split('/').length} segments), Document ID "${productId}"`);
  // --- END NEW LOGGING ---

  const productRef = doc(dbInstance, collectionPath, productId); // This takes a collection ref and a document ID
  await deleteDoc(productRef);
  console.log("Product deleted from Firestore:", productId);
};
