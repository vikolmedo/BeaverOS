// web/src/services/firestoreService.ts
// This service handles all interactions with Firebase Firestore for product management.
// It relies on AuthContext for Firebase authentication and database instances.

// Import the initialized Firebase Auth and Firestore instances from AuthContext
import { auth, db } from '../app/contexts/AuthContext';
import {
  signInAnonymously, // Keep for explicit anonymous sign-in if needed later
  signInWithCustomToken, // Keep for explicit custom token sign-in if needed later
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


// --- NEW DEBUG LOGS FOR INITIAL IMPORT STATE ---
console.log("FirestoreService: Initial import check - auth:", auth ? "initialized" : "undefined", "db:", db ? "initialized" : "undefined");
// --- END NEW DEBUG LOGS ---

// Listen to auth state changes from the AuthContext's auth instance
// This runs only if 'auth' is successfully initialized and imported from AuthContext.
if (auth) {
  onAuthStateChanged(auth as Auth, async (user) => {
    if (user) {
      currentUserIdInternal = user.uid;
      authReadyResolveInternal?.(user.uid);
      console.log("FirestoreService: Auth State Changed - User signed in with UID:", user.uid);
    } else {
      currentUserIdInternal = null;
      console.log("FirestoreService: Auth State Changed - No user is signed in.");
      // IMPORTANT: Removed automatic anonymous/custom token sign-in here.
      // Firebase operations requiring a user will now explicitly wait for authentication.
      // The `authReadyPromiseInternal` will resolve with null or a temporary ID
      // if no user is found after the AuthContext listener finishes.
      authReadyResolveInternal?.(currentUserIdInternal || `no-user-${crypto.randomUUID().substring(0,8)}`); // Resolve to allow operations to proceed, but indicate no real user.
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
    await authReadyPromiseInternal; // Ensure auth is ready
    if (!auth) throw new Error("Firebase Auth not initialized after waiting.");
  }
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
    await authReadyPromiseInternal; // Ensure auth is ready
    if (!auth) throw new Error("Firebase Auth not initialized after waiting.");
  }
  return await signInWithEmailAndPassword(auth as Auth, email, password);
};

/**
 * Signs out the current user.
 */
export const signOutUser = async () => {
  if (!auth) {
    await authReadyPromiseInternal; // Ensure auth is ready
    if (!auth) throw new Error("Firebase Auth not initialized after waiting.");
  }
  await firebaseSignOut(auth as Auth); // Use aliased signOut function
  currentUserIdInternal = null; // Clear internal user ID on sign out
};

/**
 * Get the currently authenticated user ID.
 * This function will ensure the authentication state is settled before returning the UID.
 * @returns A promise that resolves with the user's UID or null if not authenticated.
 */
export const getAuthenticatedUserId = async (): Promise<string | null> => {
    await authReadyPromiseInternal; // Wait for the internal auth state to be determined
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
  if (!db) {
    throw new Error("Firestore DB is not available. Please ensure Firebase config is complete and correct in AuthContext.");
  }
  return db;
};

const getProductsCollectionPath = async (userIdParam: string) => {
    let appId = (typeof __app_id !== 'undefined' && __app_id) ? __app_id : 'default-canvas-app';
    let userId = userIdParam;

    appId = appId.replace(/\//g, '_').replace(/\./g, '-');
    userId = userId.replace(/\//g, '_').replace(/\./g, '-');

    console.log(`DEBUG: Sanitized components - appId: "${appId}", userId: "${userId}"`);
    const collectionPath = `artifacts/${appId}/users/${userId}/products`;
    console.log(`DEBUG: Final constructed Firestore collectionPath: "${collectionPath}" (Length: ${collectionPath.split('/').length} segments)`);

    return collectionPath;
};

/**
 * Subscribes to real-time updates of products for the current authenticated user.
 * @param callback - A callback function that receives the updated list of products.
 * @returns An unsubscribe function to stop listening to updates.
 */
export const subscribeToProducts = async (callback: (products: AdminProduct[]) => void): Promise<() => void> => {
  const userId = await getAuthenticatedUserId(); // Wait for user ID to be determined
  if (!userId || userId.startsWith('no-user-') || userId.startsWith('anonymous-no-auth-instance-')) {
    console.warn("subscribeToProducts: User not genuinely authenticated or temporary ID. Returning empty array and no persistent subscription.");
    callback([]); // Return empty data for unauthenticated or temporary users
    return () => {}; // Return a no-op unsubscribe function
  }

  const dbInstance = await getDb();
  const collectionPath = await getProductsCollectionPath(userId);

  console.log(`DEBUG: Passing to collection() for subscribeToProducts: "${collectionPath}" (Length: ${collectionPath.split('/').length} segments)`);

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
        icon: data.icon,
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

  return unsubscribe;
};

/**
 * Adds a new product for the current authenticated user.
 * @param newProduct - The product data to add (without id, createdAt, lastUpdated).
 */
export const addProductToFirestore = async (newProduct: Omit<AdminProduct, 'id' | 'createdAt' | 'lastUpdated'>) => {
  const userId = await getAuthenticatedUserId();
  if (!userId || userId.startsWith('no-user-') || userId.startsWith('anonymous-no-auth-instance-')) {
    throw new Error("User not authenticated to add product.");
  }
  const dbInstance = await getDb();

  const collectionPath = await getProductsCollectionPath(userId);
  console.log(`DEBUG: Passing to collection() for addProductToFirestore: "${collectionPath}" (Length: ${collectionPath.split('/').length} segments)`);

  const now = new Date().toISOString().split('T')[0];
  const productData = {
      ...newProduct,
      icon: newProduct.icon,
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
  if (!userId || userId.startsWith('no-user-') || userId.startsWith('anonymous-no-auth-instance-')) {
    throw new Error("User not authenticated to update product.");
  }
  const dbInstance = await getDb();

  const collectionPath = await getProductsCollectionPath(userId);
  console.log(`DEBUG: Passing to doc() for updateProductInFirestore: Collection Path "${collectionPath}" (Length: ${collectionPath.split('/').length} segments), Document ID "${updatedProduct.id}"`);

  const productRef = doc(dbInstance, collectionPath, updatedProduct.id);
  const now = new Date().toISOString().split('T')[0];
  const productData = {
      ...updatedProduct,
      icon: updatedProduct.icon,
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
  if (!userId || userId.startsWith('no-user-') || userId.startsWith('anonymous-no-auth-instance-')) {
    throw new Error("User not authenticated to delete product.");
  }
  const dbInstance = await getDb();

  const collectionPath = await getProductsCollectionPath(userId);
  console.log(`DEBUG: Passing to doc() for deleteProductFromFirestore: Collection Path "${collectionPath}" (Length: ${collectionPath.split('/').length} segments), Document ID "${productId}"`);

  const productRef = doc(dbInstance, collectionPath, productId);
  await deleteDoc(productRef);
  console.log("Product deleted from Firestore:", productId);
};
