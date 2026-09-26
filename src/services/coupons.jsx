import { collection, doc, getDocs, getDoc, setDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "./firebase.jsx";

const COLLECTION = "coupons";

export async function listCoupons() {
  const snap = await getDocs(collection(db, COLLECTION));
  return snap.docs.map((d) => ({ code: d.id, ...d.data() }));
}

export async function getCoupon(code) {
  const id = code.trim().toUpperCase();
  if (!id) return null;
  const snap = await getDoc(doc(db, COLLECTION, id));
  if (!snap.exists()) return null;
  return { code: snap.id, ...snap.data() };
}

export async function addCoupon(code, data) {
  const id = code.trim().toUpperCase();
  await setDoc(doc(db, COLLECTION, id), { ...data, active: true });
  return id;
}

export async function updateCoupon(code, data) {
  await updateDoc(doc(db, COLLECTION, code), data);
}

export async function deleteCoupon(code) {
  await deleteDoc(doc(db, COLLECTION, code));
}