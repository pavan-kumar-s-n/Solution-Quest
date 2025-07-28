import React, { useEffect, useState } from "react";
import { db } from "../firebase"; // adjust based on your file structure
import { collection, query, where, orderBy, onSnapshot } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";

const NotificationsPage = () => {
  const { currentUser } = useAuth();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (!currentUser) return;

    const q = query(
      collection(db, "notifications"),
      where("userId", "==", currentUser.uid),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetched = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setNotifications(fetched);
    });

    return () => unsubscribe();
  }, [currentUser]);

  return (
    <div className="notifications-page">
      <h2>🔔 Your Notifications</h2>
      {notifications.length === 0 ? (
        <p>No new notifications.</p>
      ) : (
        <ul>
          {notifications.map((n) => (
            <li key={n.id} className="notification-card">
              <p>{n.message}</p>
              <small>{new Date(n.createdAt?.toDate()).toLocaleString()}</small>
            </li>
          ))}
        </ul>
      )}

      <styles>{`
      .notifications-page {
  padding: 1rem;
}

.notification-card {
  background: #f9f9f9;
  border-radius: 8px;
  padding: 0.8rem;
  margin-bottom: 0.5rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

      `}</styles>
    </div>
  );
};

export default NotificationsPage;
