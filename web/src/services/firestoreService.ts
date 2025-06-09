// web/src/services/firestoreService.ts
import {
  Auth,
  User
} from 'firebase/auth';
import {
  Firestore,
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
} from 'firebase/firestore';
import { FirebaseError } from 'firebase/app';

// Corrected relative paths to data interfaces
import { AdminProduct } from '../app/data/admin-products';
import { Customer } from '../app/data/customers';

// Access APP_ID via process.env for client-side usage
// This is now consistent with Next.js environment variable handling
const appId = process.env.NEXT_PUBLIC_APP_ID || 'default-canvas-app';

// Helper to construct collection paths (now takes userId as a mandatory argument)
const getCollectionPath = (userId: string, collectionName: string) => {
  const path = `artifacts/${appId}/users/${userId}/${collectionName}`;
  console.log(`DEBUG: Final constructed Firestore collectionPath for ${collectionName}: "${path}" (Length: ${path.split('/').length} segments)`);
  return path;
};

// --- Product Management Functions ---

export const addProductToFirestore = async (
  db: Firestore,
  userId: string,
  newProductData: Omit<AdminProduct, 'id' | 'createdAt' | 'lastUpdated'>
) => {
  if (!db) {
    console.error("Firestore DB is not provided.");
    throw new Error("Firestore DB is not provided.");
  }
  const collectionPath = getCollectionPath(userId, 'products');
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

export const updateProductInFirestore = async (
  db: Firestore,
  userId: string,
  updatedProduct: AdminProduct
) => {
  if (!db) {
    console.error("Firestore DB is not provided.");
    throw new Error("Firestore DB is not provided.");
  }
  if (!updatedProduct.id) {
    console.error("Product ID is required for update.");
    throw new Error("Product ID is required for update.");
  }
  const collectionPath = getCollectionPath(userId, 'products');
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

export const deleteProductFromFirestore = async (
  db: Firestore,
  userId: string,
  productId: string
) => {
  if (!db) {
    console.error("Firestore DB is not provided.");
    throw new Error("Firestore DB is not provided.");
  }
  const collectionPath = getCollectionPath(userId, 'products');
  try {
    await deleteDoc(doc(db, collectionPath, productId));
    console.log("Product deleted from Firestore:", productId);
  } catch (e: any) {
    console.error("Error deleting product: ", e);
    throw e;
  }
};

export const subscribeToProducts = (
  db: Firestore,
  userId: string,
  callback: (products: AdminProduct[]) => void
) => {
  if (!db) {
    console.error("Firestore DB is not provided. Cannot subscribe to products.");
    return () => {};
  }
  const collectionPath = getCollectionPath(userId, 'products');
  const q = query(collection(db, collectionPath));

  console.log(`DEBUG: Passing to collection() for subscribeToProducts: "${collectionPath}" (Length: ${collectionPath.split('/').length} segments)`);

  const unsubscribe = onSnapshot(q, (querySnapshot: QuerySnapshot) => {
    const products: AdminProduct[] = [];
    querySnapshot.forEach((doc: DocumentSnapshot) => {
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

export const addCustomerToFirestore = async (
  db: Firestore,
  userId: string,
  newCustomerData: Omit<Customer, 'id' | 'createdAt' | 'lastUpdated'>
) => {
  if (!db) {
    console.error("Firestore DB is not provided.");
    throw new Error("Firestore DB is not provided.");
  }
  const collectionPath = getCollectionPath(userId, 'customers');
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

export const updateCustomerInFirestore = async (
  db: Firestore,
  userId: string,
  updatedCustomer: Customer
) => {
  if (!db) {
    console.error("Firestore DB is not provided.");
    throw new Error("Firestore DB is not provided.");
  }
  if (!updatedCustomer.id) {
    console.error("Customer ID is required for update.");
    throw new Error("Customer ID is required for update.");
  }
  const collectionPath = getCollectionPath(userId, 'customers');
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

export const deleteCustomerFromFirestore = async (
  db: Firestore,
  userId: string,
  customerId: string
) => {
  if (!db) {
    console.error("Firestore DB is not provided.");
    throw new Error("Firestore DB is not provided.");
  }
  const collectionPath = getCollectionPath(userId, 'customers');
  try {
    await deleteDoc(doc(db, collectionPath, customerId));
    console.log("Customer deleted from Firestore:", customerId);
  } catch (e: any) {
    console.error("Error deleting customer: ", e);
    throw e;
  }
};

export const subscribeToCustomers = (
  db: Firestore,
  userId: string,
  callback: (customers: Customer[]) => void
) => {
  if (!db) {
    console.error("Firestore DB is not provided. Cannot subscribe to customers.");
    return () => {};
  }
  const collectionPath = getCollectionPath(userId, 'customers');
  const q = query(collection(db, collectionPath));

  console.log(`DEBUG: Passing to collection() for subscribeToCustomers: "${collectionPath}" (Length: ${collectionPath.split('/').length} segments)`);

  const unsubscribe = onSnapshot(q, (querySnapshot: QuerySnapshot) => {
    const customers: Customer[] = [];
    querySnapshot.forEach((doc: DocumentSnapshot) => {
      customers.push({ ...(doc.data() as Customer), id: doc.id });
    });
    console.log('Real-time customers update from Firestore:', customers);
    callback(customers);
  }, (error: FirebaseError) => {
    console.error("Error listening to customers:", error);
  });

  return unsubscribe;
};