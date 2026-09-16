import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router";
import { collection, query, orderBy, getDocs } from "firebase/firestore";
import { db } from "../services/firebase.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import OrderCard from "../components/OrderCard.jsx";
import PageState from "../components/PageState.jsx";
import EmptyState from "../components/EmptyState.jsx";

export default function Orders() {
  const { user } = useAuth();
  const location = useLocation();
  const [status, setStatus] = useState("loading");
  const [orders, setOrders] = useState([]);

  const confirmedOrderId = location.state?.confirmedOrderId;

  function load() {
    if (!user) return;
    setStatus("loading");
    const ordersQuery = query(collection(db, "users", user.uid, "orders"), orderBy("createdAt", "desc"));
    getDocs(ordersQuery)
      .then((snapshot) => {
        setOrders(snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() })));
        setStatus("ready");
      })
      .catch(() => setStatus("error"));
  }

  useEffect(() => {
    setOrders([]);
    load();
  }, [user]);

  return (
    <div>
      <h1 className="page-heading mb-4">Your orders</h1>

      {confirmedOrderId && (
        <div className="alert alert-success" role="status">
          Order placed! Confirmation ID: {confirmedOrderId}
        </div>
      )}

      {status === "loading" && <PageState status="loading" message="Loading your orders..." />}
      {status === "error" && <PageState status="error" message="Couldn't load your orders." onRetry={load} />}
      {status === "ready" && orders.length === 0 && (
        <div className="text-center py-5">
          <p className="text-muted mb-4">No orders yet.</p>
          <Link to="/products" className="btn btn-primary">Shop products</Link>
        </div>
      )}
           {status === "ready" && orders.length === 0 && (
  <EmptyState
    icon="box"
    title="No orders yet"
    message="Once you place a demo order, it'll show up here with full item and delivery details."
    actionLabel="Shop products"
    actionTo="/products"
  />
)}
    </div>
  );
}