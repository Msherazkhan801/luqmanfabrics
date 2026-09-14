import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy
} from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { Analytics, getAnalytics, isSupported } from "firebase/analytics";
import { Product, Order, StoreSettings, OrderStatus } from "./types";

// Official Luqman Fabrics Firebase configuration
export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyAEYfjM9wPLoABq_9lPmoJLHePlXUWFgcE",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "luqman-fabrics.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "luqman-fabrics",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "luqman-fabrics.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "363299998275",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:363299998275:web:a0db6bffeaf809c85422f6",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-DZC95CJZTR"
};

// Initialize Firebase App safely (singleton pattern for Next.js)
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Cloud Firestore & Storage
export const db = getFirestore(app);
export const storage = getStorage(app);

// Initialize Firebase Analytics safely (client-only check for SSR)
export let analytics: Analytics | null = null;
if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  }).catch(() => {});
}

// -------------------------------------------------------------
// FIRESTORE CLOUD DATABASE HELPERS & SANITIZER
// -------------------------------------------------------------

/**
 * Recursively sanitizes objects by converting `undefined` to `null` or removing `undefined` keys.
 * Firestore throws "Unsupported field value: undefined" if any field is undefined.
 */
export function cleanFirestoreData<T>(obj: T): T {
  if (obj === undefined) {
    return null as any;
  }
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  if (Array.isArray(obj)) {
    return obj.map((item) => cleanFirestoreData(item)) as any;
  }
  const cleaned: Record<string, any> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined) {
      cleaned[key] = cleanFirestoreData(value);
    }
  }
  return cleaned as T;
}

// Save or sync an order to Firestore 'orders' collection
export async function syncOrderToFirestore(order: Order): Promise<boolean> {
  try {
    const cleanedOrder = cleanFirestoreData(order);
    const orderDocRef = doc(db, "orders", order.id);
    await setDoc(orderDocRef, cleanedOrder, { merge: true });
    console.log("✅ Order synced to Firestore:", order.id, order.orderNumber);
    return true;
  } catch (error) {
    console.error("❌ Firestore: Error saving order to database:", error);
    return false;
  }
}

// Delete an order from Firestore 'orders' collection
export async function deleteOrderFromFirestore(orderId: string): Promise<boolean> {
  try {
    const orderDocRef = doc(db, "orders", orderId);
    await deleteDoc(orderDocRef);
    console.log("✅ Order deleted from Firestore:", orderId);
    return true;
  } catch (error) {
    console.error("❌ Firestore: Error deleting order from database:", error);
    return false;
  }
}

// Update order status in Firestore
export async function updateOrderStatusInFirestore(orderId: string, status: OrderStatus): Promise<boolean> {
  try {
    const orderDocRef = doc(db, "orders", orderId);
    await updateDoc(orderDocRef, {
      status,
      updatedAt: new Date().toISOString()
    });
    console.log("✅ Order status updated in Firestore:", orderId, status);
    return true;
  } catch (error) {
    console.error("❌ Firestore: Error updating order status:", error);
    return false;
  }
}

// Save or update product in Firestore 'products' collection
export async function syncProductToFirestore(product: Product): Promise<boolean> {
  try {
    const cleanedProduct = cleanFirestoreData(product);
    const productDocRef = doc(db, "products", product.id);
    await setDoc(productDocRef, cleanedProduct, { merge: true });
    console.log("✅ Product saved to Firestore:", product.id, product.name);
    return true;
  } catch (error) {
    console.error("❌ Firestore: Error saving product:", error);
    return false;
  }
}

// Delete product from Firestore
export async function deleteProductFromFirestore(productId: string): Promise<boolean> {
  try {
    const productDocRef = doc(db, "products", productId);
    await deleteDoc(productDocRef);
    console.log("✅ Product deleted from Firestore:", productId);
    return true;
  } catch (error) {
    console.error("❌ Firestore: Error deleting product:", error);
    return false;
  }
}

// Save store settings to Firestore 'settings/storeConfig'
export async function syncSettingsToFirestore(settings: StoreSettings): Promise<boolean> {
  try {
    const cleanedSettings = cleanFirestoreData(settings);
    const settingsDocRef = doc(db, "settings", "storeConfig");
    await setDoc(settingsDocRef, cleanedSettings, { merge: true });
    console.log("✅ Settings saved to Firestore");
    return true;
  } catch (error) {
    console.error("❌ Firestore: Error saving store settings:", error);
    return false;
  }
}
