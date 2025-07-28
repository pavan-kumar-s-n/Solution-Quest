import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase";

function ProfilePage() {
  const { id } = useParams();
  const [userData, setUserData] = useState(null);
  const [userQuestions, setUserQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userRef = doc(db, "users", id);
        const snapshot = await getDoc(userRef);
        if (snapshot.exists()) {
          setUserData(snapshot.data());
        } else {
          setUserData(null);
        }
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };

    const fetchUserQuestions = async () => {
      try {
        const q = query(collection(db, "questions"), where("authorId", "==", id));
        const snapshot = await getDocs(q);
        const questions = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setUserQuestions(questions);
      } catch (err) {
        console.error("Error fetching questions:", err);
      }
    };

    const fetchUserAnswers = async () => {
      try {
        const q = query(collection(db, "answers"), where("authorId", "==", id));
        const snapshot = await getDocs(q);
        const answers = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setUserAnswers(answers);
      } catch (err) {
        console.error("Error fetching answers:", err);
      }
    };

    const loadData = async () => {
      await fetchUser();
      await fetchUserQuestions();
      await fetchUserAnswers();
      setLoading(false);
    };

    loadData();
  }, [id]);

  if (loading) return <div className="loading">Loading user...</div>;
  if (!userData) return <div className="error">User not found.</div>;

  return (
    <div className="profile-page">
      <div className="profile-header">
        <div className="profile-avatar">
          {userData.username ? userData.username.charAt(0).toUpperCase() : "A"}
        </div>
        <div>
          <h1 className="profile-username">
            <span className="profile-icon">👤</span>
            {userData.username || "Anonymous"}'s Profile
          </h1>
          <p className="profile-email">
            <span>✉️</span>
            {userData.email}
          </p>
          <div className="profile-stats">
            <span className="stat-item blue">📝 {userQuestions.length} Questions</span>
            <span className="stat-item green">💬 {userAnswers.length} Answers</span>
            <span className="stat-item purple">⭐ {userData.points || 0} Points</span>
          </div>
        </div>
      </div>

      <div className="section">
        <h2 className="section-title">
          <span className="section-icon red">📌</span>
          User's Questions
        </h2>
        {userQuestions.length === 0 ? (
          <p className="empty">No questions posted yet.</p>
        ) : (
          <div className="card-list">
            {userQuestions.map(question => (
              <div key={question.id} className="card">
                <Link to={`/question/${question.id}`} className="card-link">
                  {question.title}
                </Link>
                <p className="card-date">
                  <span>🗓</span>
                  Posted on: {question.createdAt?.toDate
                    ? new Date(question.createdAt.toDate()).toLocaleDateString()
                    : "Unknown"}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="section">
        <h2 className="section-title">
          <span className="section-icon green">💡</span>
          User's Answers
        </h2>
        {userAnswers.length === 0 ? (
          <p className="empty">No answers posted yet.</p>
        ) : (
          <div className="card-list">
            {userAnswers.map(answer => (
              <div key={answer.id} className="card">
                <p className="card-content">{answer.content}</p>
                <p className="card-date">
                  <span>🗓</span>
                  Posted on: {answer.createdAt?.toDate
                    ? new Date(answer.createdAt.toDate()).toLocaleDateString()
                    : "Unknown"}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
        <style jsx>{`
        .profile-page {
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem;
  background-color: #f8fafc;
  color: #1e293b;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  min-height: 100vh;
}

.loading, .error {
  text-align: center;
  padding: 3rem;
  font-style: italic;
}

.loading {
  color: #6b7280;
}

.error {
  color: #dc2626;
}

.profile-header {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 2.5rem;
  padding: 1.5rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  border-left: 4px solid #6366f1;
}

.profile-avatar {
  width: 90px;
  height: 90px;
  border-radius: 50%;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  font-weight: bold;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
  border: 3px solid #e0e7ff;
}

.profile-username {
  margin: 0;
  font-size: 1.8rem;
  color: #1e293b;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.profile-icon {
  display: inline-flex;
  background: #e0e7ff;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  align-items: center;
  justify-content: center;
  color: #6366f1;
}

.profile-email {
  margin: 0.5rem 0;
  font-size: 0.95rem;
  color: #64748b;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.profile-stats {
  display: flex;
  gap: 1.5rem;
  margin-top: 1rem;
}

.stat-item {
  padding: 0.5rem 1rem;
  border-radius: 20px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
}

.stat-item.blue {
  background: #eff6ff;
  color: #1d4ed8;
}

.stat-item.green {
  background: #f0fdf4;
  color: #15803d;
}

.stat-item.purple {
  background: #f5f3ff;
  color: #7c3aed;
}

.section {
  margin-bottom: 2.5rem;
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.section-title {
  font-size: 1.5rem;
  color: #1e293b;
  margin: 0 0 1.5rem;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid #f1f5f9;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.section-icon {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.section-icon.red {
  background: #fee2e2;
  color: #dc2626;
}

.section-icon.green {
  background: #d1fae5;
  color: #059669;
}

.empty {
  text-align: center;
  padding: 2rem;
  color: #94a3b8;
  font-style: italic;
  background: #f8fafc;
  border-radius: 8px;
}

.card-list {
  display: grid;
  gap: 1rem;
}

.card {
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 1.25rem;
}

.card-link {
  text-decoration: none;
  color: #4338ca;
  font-weight: 600;
  font-size: 1.1rem;
  display: block;
  margin-bottom: 0.5rem;
}

.card-date {
  margin: 0;
  color: #64748b;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.card-content {
  margin-bottom: 0.5rem;
  color: #334155;
  font-weight: 500;
}
`}</style>
    </div>
  );
}

export default ProfilePage;
