import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, getDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase.jsx";

const COLLECTION = "customProducts";

export async function listManagedProducts() {
  const snapshot = await getDocs(collection(db, COLLECTION));
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function getManagedProduct(id) {
  const ref = doc(db, COLLECTION, id);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() };
}

export async function addManagedProduct(data) {
  const ref = await addDoc(collection(db, COLLECTION), {
    ...data,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateManagedProduct(id, data) {
  await updateDoc(doc(db, COLLECTION, id), data);
}

export async function deleteManagedProduct(id) {
  await deleteDoc(doc(db, COLLECTION, id));
}