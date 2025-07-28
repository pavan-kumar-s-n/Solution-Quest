import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";

function CommunityPage() {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      const snapshot = await getDocs(collection(db, "users"));
      const usersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setUsers(usersData);
    };

    fetchUsers();
  }, []);

  return (
    <div className="community-container">
      <h1 className="title">Community Members</h1>
      <div className="user-grid">
        {users.map(user => (
          <div key={user.id} className="user-card" onClick={() => navigate(`/profile/${user.id}`)}>
            <h3>{user.username || "Anonymous"}</h3>
            <p>Email: {user.email}</p>
            <p>Answers Posted: {user.answersPosted || 0}</p>
            <p>Points: {user.points || 0}</p>
          </div>
        ))}
      </div>

      <style jsx>{`
        .community-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem;
          min-height: 100vh;
          background-color: #f8fafc;
        }

        .title {
          font-size: 2.5rem;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 2rem;
          text-align: center;
          position: relative;
          padding-bottom: 1rem;
        }

        .title::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 100px;
          height: 4px;
          background: linear-gradient(90deg, #3b82f6, #8b5cf6);
          border-radius: 2px;
        }

        .user-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 1.5rem;
          padding: 1rem;
        }

        .user-card {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          transition: all 0.3s ease;
          cursor: pointer;
          border: 1px solid #e2e8f0;
        }

        .user-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
          border-color: #c7d2fe;
        }

        .user-card h3 {
          font-size: 1.25rem;
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 1rem;
          padding-bottom: 0.5rem;
          border-bottom: 2px solid #e2e8f0;
        }

        .user-card p {
          font-size: 0.95rem;
          color: #475569;
          margin: 0.5rem 0;
          line-height: 1.5;
        }

        .user-card p:last-child {
          color: #3b82f6;
          font-weight: 600;
          margin-top: 1rem;
          font-size: 1rem;
        }

        @media (max-width: 768px) {
          .user-grid {
            grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
          }
          
          .community-container {
            padding: 1.5rem;
          }
          
          .title {
            font-size: 2rem;
          }
        }

        @media (max-width: 480px) {
          .user-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}

export default CommunityPage;