// web/src/services/firestoreService.ts
// Servicio para interactuar con Firebase Firestore para la gestión de productos.

import {
  doc,
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  getFirestore,
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { AdminProduct } from '../app/data/admin-products'; // Importar la interfaz actualizada

// Definición de las variables de entorno para Firebase
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Inicializar Firebase (solo una vez)
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Función para obtener la colección de productos de un usuario específico
const getProductsCollection = async () => {
  const user = auth.currentUser;
  if (!user) {
    console.error("No authenticated user found.");
    throw new Error("Authentication required to access products.");
  }
  // Ruta de la colección: /artifacts/{appId}/users/{userId}/products
  const appId = firebaseConfig.appId;
  const userId = user.uid;
  return collection(db, `artifacts/<span class="math-inline">\{appId\}/users/</span>{userId}/products`);
};

// Obtener todos los productos
export const getProducts = async (): Promise<AdminProduct[]> => {
  try {
    const productsCollection = await getProductsCollection();
    const q = query(productsCollection);
    const querySnapshot = await getDocs(q);
    const products: AdminProduct[] = [];
    querySnapshot.forEach((doc) => {
      products.push({ id: doc.id, ...doc.data() } as AdminProduct);
    });
    return products;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

// Añadir un nuevo producto
export const addProduct = async (product: Omit<AdminProduct, 'id' | 'createdAt' | 'lastUpdated'>): Promise<string> => {
  try {
    const productsCollection = await getProductsCollection();
    const newProductRef = await addDoc(productsCollection, {
      ...product,
      createdAt: new Date().toISOString(), // Añadir fecha de creación
      lastUpdated: new Date().toISOString(), // Añadir fecha de última actualización
    });
    return newProductRef.id;
  } catch (error) {
    console.error('Error adding product:', error);
    throw error;
  }
};

// Actualizar un producto existente
export const updateProduct = async (product: AdminProduct): Promise<void> => {
  try {
    const productsCollection = await getProductsCollection();
    const productRef = doc(productsCollection, product.id);
    await updateDoc(productRef, {
      ...product,
      lastUpdated: new Date().toISOString(), // Actualizar fecha de última actualización
    });
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
};

// Eliminar un producto
export const deleteProduct = async (productId: string): Promise<void> => {
  try {
    const productsCollection = await getProductsCollection();
    const productRef = doc(productsCollection, productId);
    await deleteDoc(productRef);
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};

// Autenticación de usuario
export const signIn = async (email: string, password: string) => {
  // Esta función ya está en src/services/authService.ts si lo creamos por separado,
  // o en la página de inicio de sesión. Por simplicidad aquí solo se muestra el mock.
  console.log(`Attempting to sign in user: ${email}`);
  // Aquí iría la lógica real de signInWithEmailAndPassword de Firebase Auth
  // Por ahora, solo es un placeholder ya que ya tenemos LoginPage con Firebase Auth
};
