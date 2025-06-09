// web/src/services/firestoreService.ts
import { initializeApp, FirebaseApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  signInAnonymously,
  signInWithCustomToken,
  User,
  Auth
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  collection,
  query,
  serverTimestamp,
  QuerySnapshot,
  DocumentSnapshot,
  Firestore
} from 'firebase/firestore';
import { FirebaseError } from 'firebase/app';

// Corrected relative paths to data interfaces
import { AdminProduct } from '../../app/data/admin-products';
import { Customer } from '../../app/data/customers';

declare const __app_id: string;
declare const __firebase_config: string;
declare const __initial_auth_token: string | undefined;

let app: FirebaseApp;
let db: Firestore;
let auth: Auth;

const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-canvas-app';
const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {};

try {
  if (getApps().length === 0) {
    app = initializeApp(firebaseConfig);
    console.log('FirestoreService: Initialized new Firebase app.');
  } else {
    app = getApp();
    console.log('FirestoreService: Retrieved existing Firebase app instance.');
  }

  db = getFirestore(app);
  auth = getAuth(app);
  console.log('FirestoreService: Initial import check - auth: initialized db: initialized');
} catch (error) {
  console.error('FirestoreService: Error during Firebase initialization:', error);
  db = null as any;
  auth = null as any;
}

const getUserId = () => {
  if (auth && auth.currentUser) {
    return auth.currentUser.uid;
  }
  console.warn("FirestoreService: Auth is not ready or user is not logged in. Using random UUID for userId.");
  return crypto.randomUUID();
};

const getCollectionPath = (collectionName: string) => {
  const userId = getUserId();
  const path = `artifacts/${appId}/users/${userId}/${collectionName}`;
  console.log(`DEBUG: Final constructed Firestore collectionPath for ${collectionName}: "${path}" (Length: ${path.split('/').length} segments)`);
  return path;
};

// --- Product Management Functions ---

export const addProductToFirestore = async (newProductData: Omit<AdminProduct, 'id' | 'createdAt' | 'lastUpdated'>) => {
  if (!db) {
    console.error("Firestore DB is not initialized.");
    throw new Error("Firestore DB is not initialized.");
  }
  const collectionPath = getCollectionPath('products');
  console.log(`DEBUG: Passing to collection() for addProductToFirestore: "${collectionPath}" (Length: ${collectionPath.split('/').length} segments)`);
  try {
    const docRef = await addDoc(collection(db, collectionPath), {
      ...newProductData,
      createdAt: serverTimestamp(),
      lastUpdated: serverTimestamp(),
    });
    console.log("Product added to Firestore:", newProductData.name);
    return docRef.id;
  } catch (e: any) {
    console.error("Error adding product: ", e);
    throw e;
  }
};

export const updateProductInFirestore = async (updatedProduct: AdminProduct) => {
  if (!db) {
    console.error("Firestore DB is not initialized.");
    throw new Error("Firestore DB is not initialized.");
  }
  if (!updatedProduct.id) {
    console.error("Product ID is required for update.");
    throw new Error("Product ID is required for update.");
  }
  const collectionPath = getCollectionPath('products');
  console.log(`DEBUG: Passing to doc() for updateProductInFirestore: Collection Path "${collectionPath}" (Length: ${collectionPath.split('/').length} segments), Document ID "${updatedProduct.id}"`);

  const { id, ...dataToUpdate } = updatedProduct;

  try {
    const productRef = doc(db, collectionPath, id);
    await updateDoc(productRef, {
      ...dataToUpdate,
      lastUpdated: serverTimestamp(),
    });
    console.log("Product updated in Firestore:", updatedProduct.name);
  } catch (e: any) {
    console.error("Error updating product: ", e);
    throw e;
  }
};

export const deleteProductFromFirestore = async (productId: string) => {
  if (!db) {
    console.error("Firestore DB is not initialized.");
    throw new Error("Firestore DB is not initialized.");
  }
  const collectionPath = getCollectionPath('products');
  try {
    await deleteDoc(doc(db, collectionPath, productId));
    console.log("Product deleted from Firestore:", productId);
  } catch (e: any) {
    console.error("Error deleting product: ", e);
    throw e;
  }
};

export const subscribeToProducts = (callback: (products: AdminProduct[]) => void) => {
  if (!db) {
    console.error("Firestore DB is not initialized. Cannot subscribe to products.");
    return () => {};
  }
  const collectionPath = getCollectionPath('products');
  const q = query(collection(db, collectionPath));

  console.log(`DEBUG: Passing to collection() for subscribeToProducts: "${collectionPath}" (Length: ${collectionPath.split('/').length} segments)`);

  const unsubscribe = onSnapshot(q, (querySnapshot: QuerySnapshot) => {
    const products: AdminProduct[] = [];
    querySnapshot.forEach((doc: DocumentSnapshot) => {
      // CORRECTED: Place doc.id after spread to ensure it's the final 'id'
      products.push({ ...(doc.data() as AdminProduct), id: doc.id });
    });
    console.log('Real-time products update from Firestore:', products);
    callback(products);
  }, (error: FirebaseError) => {
    console.error("Error listening to products:", error);
  });

  return unsubscribe;
};

// --- Customer Management Functions ---

export const addCustomerToFirestore = async (newCustomerData: Omit<Customer, 'id' | 'createdAt' | 'lastUpdated'>) => {
  if (!db) {
    console.error("Firestore DB is not initialized.");
    throw new Error("Firestore DB is not initialized.");
  }
  const collectionPath = getCollectionPath('customers');
  console.log(`DEBUG: Passing to collection() for addCustomerToFirestore: "${collectionPath}" (Length: ${collectionPath.split('/').length} segments)`);
  try {
    const docRef = await addDoc(collection(db, collectionPath), {
      ...newCustomerData,
      createdAt: serverTimestamp(),
      lastUpdated: serverTimestamp(),
    });
    console.log("Customer added to Firestore:", newCustomerData.firstName);
    return docRef.id;
  } catch (e: any) {
    console.error("Error adding customer: ", e);
    throw e;
  }
};

export const updateCustomerInFirestore = async (updatedCustomer: Customer) => {
  if (!db) {
    console.error("Firestore DB is not initialized.");
    throw new Error("Firestore DB is not initialized.");
  }
  if (!updatedCustomer.id) {
    console.error("Customer ID is required for update.");
    throw new Error("Customer ID is required for update.");
  }
  const collectionPath = getCollectionPath('customers');
  console.log(`DEBUG: Passing to doc() for updateCustomerInFirestore: Collection Path "${collectionPath}" (Length: ${collectionPath.split('/').length} segments), Document ID "${updatedCustomer.id}"`);

  const { id, ...dataToUpdate } = updatedCustomer;

  try {
    const customerRef = doc(db, collectionPath, id);
    await updateDoc(customerRef, {
      ...dataToUpdate,
      lastUpdated: serverTimestamp(),
    });
    console.log("Customer updated in Firestore:", updatedCustomer.firstName);
  } catch (e: any) {
    console.error("Error saving customer: ", e);
    throw e;
  }
};

export const deleteCustomerFromFirestore = async (customerId: string) => {
  if (!db) {
    console.error("Firestore DB is not initialized.");
    throw new Error("Firestore DB is not initialized.");
  }
  const collectionPath = getCollectionPath('customers');
  try {
    await deleteDoc(doc(db, collectionPath, customerId));
    console.log("Customer deleted from Firestore:", customerId);
  } catch (e: any) {
    console.error("Error deleting customer: ", e);
    throw e;
  }
};

export const subscribeToCustomers = (callback: (customers: Customer[]) => void) => {
  if (!db) {
    console.error("Firestore DB is not initialized. Cannot subscribe to customers.");
    return () => {};
  }
  const collectionPath = getCollectionPath('customers');
  const q = query(collection(db, collectionPath));

  console.log(`DEBUG: Passing to collection() for subscribeToCustomers: "${collectionPath}" (Length: ${collectionPath.split('/').length} segments)`);

  const unsubscribe = onSnapshot(q, (querySnapshot: QuerySnapshot) => {
    const customers: Customer[] = [];
    querySnapshot.forEach((doc: DocumentSnapshot) => {
      // CORRECTED: Place doc.id after spread to ensure it's the final 'id'
      customers.push({ ...(doc.data() as Customer), id: doc.id });
    });
    console.log('Real-time customers update from Firestore:', customers);
    callback(customers);
  }, (error: FirebaseError) => {
    console.error("Error listening to customers:", error);
  });

  return unsubscribe;
};