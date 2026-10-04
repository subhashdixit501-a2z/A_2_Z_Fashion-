import { addDoc, collection, onSnapshot, orderBy, query, serverTimestamp, updateDoc, doc } from 'firebase/firestore';
import { defaultDb } from '../firebase';

export type OrderStatus = 'Placed' | 'Confirmed' | 'Packed' | 'Shipped' | 'Delivered' | 'Cancelled';

export interface OrderItem {
  productId: string;
  name: string;
  imageUrl: string;
  price: number;
  quantity: number;
  size?: string;
  color?: string;
}

export interface CustomerOrder {
  id: string;
  customerName: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  items: OrderItem[];
  total: number;
  paymentMethod: 'COD';
  status: OrderStatus;
  createdAt?: any;
}

const ORDERS = 'orders';

export async function createCODOrder(input: Omit<CustomerOrder, 'id' | 'status' | 'createdAt'>) {
  const ref = await addDoc(collection(defaultDb, ORDERS), {
    ...input,
    paymentMethod: 'COD',
    status: 'Placed',
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export function subscribeToOrders(onUpdate: (orders: CustomerOrder[]) => void, onError?: (e: unknown) => void) {
  const q = query(collection(defaultDb, ORDERS), orderBy('createdAt', 'desc'));
  return onSnapshot(q, snap => {
    onUpdate(snap.docs.map(d => ({ id: d.id, ...(d.data() as Omit<CustomerOrder, 'id'>) })));
  }, onError);
}

export async function updateOrderStatus(orderId: string, status: OrderStatus) {
  await updateDoc(doc(defaultDb, ORDERS, orderId), { status, updatedAt: serverTimestamp() });
}
