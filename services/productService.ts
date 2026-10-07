import {
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";

import { getFirestore } from "firebase/firestore";
import { app } from "../firebase";
import { Product } from "../types";

const db = getFirestore(app);
const productsCollection = collection(db, "products");

export function subscribeToProducts(
  onProducts: (products: Product[]) => void,
  onError?: (error: Error) => void
) {
  const q = query(productsCollection, orderBy("createdAt", "desc"));

  return onSnapshot(
    q,
    (snapshot) => {
      const products = snapshot.docs.map((item) => ({
        id: item.id,
        ...item.data(),
      })) as Product[];

      onProducts(products);
    },
    (error) => {
      console.error("Firestore products error:", error);
      onError?.(error);
    }
  );
}

export async function getProducts(): Promise<Product[]> {
  const snapshot = await getDocs(productsCollection);

  return snapshot.docs.map((item) => ({
    id: item.id,
    ...item.data(),
  })) as Product[];
}

export async function createProduct(
  product: Omit<Product, "id">
): Promise<string> {
  const docRef = await addDoc(productsCollection, {
    ...product,
    createdAt: serverTimestamp(),
  });

  return docRef.id;
}

// पुराने code के लिए भी compatible रहेगा
export const addProduct = createProduct;

export async function updateProduct(
  productId: string,
  data: Partial<Product>
): Promise<void> {
  const productRef = doc(db, "products", productId);

  await updateDoc(productRef, data);
}

export async function deleteProduct(productId: string): Promise<void> {
  const productRef = doc(db, "products", productId);

  await deleteDoc(productRef);
}
