import { collection, doc, getDocs, updateDoc, query, orderBy } from "firebase/firestore";
import { db } from "./firebase.jsx";

export async function listAdminOrders() {
  const q = query(collection(db, "adminOrders"), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function updateOrderStatus(order, nextStatus) {
  await updateDoc(doc(db, "adminOrders", order.id), { status: nextStatus });
  if (order.uid) {
    await updateDoc(doc(db, "users", order.uid, "orders", order.id), { status: nextStatus });
  }
}