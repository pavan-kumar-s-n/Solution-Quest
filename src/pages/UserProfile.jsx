import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { QuestionContext } from '../context/QuestionContext';

const UserProfile = () => {
  const { user } = useAuth();
  const { questions } = useContext(QuestionContext);

  if (!user) return <p style={{
    textAlign: 'center',
    padding: '2rem',
    color: '#6b7280',
    fontStyle: 'italic'
  }}>Please login to see your profile.</p>;

  const userQuestions = questions.filter(q => q.author === user.username);
  const userAnswers = questions.flatMap(q =>
    q.answers?.filter(ans => ans.author === user.username).map(ans => ({
      ...ans,
      questionTitle: q.title,
      questionId: q.id
    }))
  );

  return (
    <div style={{
      maxWidth: '900px',
      margin: '0 auto',
      padding: '2rem',
      backgroundColor: '#f8fafc',
      color: '#1e293b',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      marginLeft: '170px',
      minHeight: '100vh'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1.5rem',
        marginBottom: '2.5rem',
        padding: '1.5rem',
        background: 'white',
        borderRadius: '12px',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
        borderLeft: '4px solid #6366f1'
      }}>
        <img
          src={`https://ui-avatars.com/api/?name=${user.username}&background=6366f1&color=fff`}
          alt="User Avatar"
          style={{ 
            width: '90px', 
            height: '90px', 
            borderRadius: '50%',
            boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
            border: '3px solid #e0e7ff'
          }}
        />
        <div>
          <h1 style={{ 
            margin: 0,
            fontSize: '1.8rem',
            color: '#1e293b',
            fontWeight: '700',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <span style={{
              display: 'inline-flex',
              background: '#e0e7ff',
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#6366f1'
            }}>👤</span>
            {user.username}
          </h1>
          <p style={{ 
            margin: '0.5rem 0', 
            fontSize: '0.95rem', 
            color: '#64748b',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <span style={{ color: '#94a3b8' }}>🗓</span>
            Member since: {new Date(user.createdAt || Date.now()).toLocaleDateString()}
          </p>
          <div style={{ 
            display: 'flex', 
            gap: '1.5rem', 
            marginTop: '1rem'
          }}>
            <span style={{
              background: '#f0fdf4',
              padding: '0.5rem 1rem',
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: '#15803d',
              fontWeight: '600'
            }}>📝 {userQuestions.length} Questions</span>
            <span style={{
              background: '#eff6ff',
              padding: '0.5rem 1rem',
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: '#1d4ed8',
              fontWeight: '600'
            }}>💬 {userAnswers.length} Answers</span>
          </div>
        </div>
      </div>

      <section style={{ 
        marginBottom: '2.5rem',
        background: 'white',
        borderRadius: '12px',
        padding: '1.5rem',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)'
      }}>
        <h2 style={{
          fontSize: '1.5rem',
          color: '#1e293b',
          margin: '0 0 1.5rem',
          paddingBottom: '0.75rem',
          borderBottom: '2px solid #f1f5f9',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem'
        }}>
          <span style={{
            background: '#fee2e2',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#dc2626'
          }}>📌</span>
          Your Questions
        </h2>
        {userQuestions.length === 0 ? (
          <p style={{
            textAlign: 'center',
            padding: '2rem',
            color: '#94a3b8',
            fontStyle: 'italic',
            background: '#f8fafc',
            borderRadius: '8px'
          }}>You haven't posted any questions yet.</p>
        ) : (
          <ul style={{ 
            paddingLeft: 0, 
            listStyle: 'none',
            display: 'grid',
            gap: '1rem'
          }}>
            {userQuestions.map(q => (
              <li key={q.id} style={{
                background: '#fff',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                padding: '1.25rem',
                transition: 'all 0.2s ease',
                ':hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                  borderColor: '#c7d2fe'
                }
              }}>
                <Link 
                  to={`/question/${q.id}`} 
                  style={{ 
                    textDecoration: 'none', 
                    color: '#4338ca',
                    fontWeight: '600',
                    fontSize: '1.1rem',
                    display: 'block',
                    marginBottom: '0.5rem'
                  }}
                >
                  {q.title}
                </Link>
                <div style={{
                  display: 'flex',
                  gap: '1rem',
                  fontSize: '0.9rem',
                  color: '#64748b'
                }}>
                  <span>🗨 {q.answers?.length || 0} answers</span>
                  <span>⭐ {q.votes || 0} votes</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section style={{
        background: 'white',
        borderRadius: '12px',
        padding: '1.5rem',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)'
      }}>
        <h2 style={{
          fontSize: '1.5rem',
          color: '#1e293b',
          margin: '0 0 1.5rem',
          paddingBottom: '0.75rem',
          borderBottom: '2px solid #f1f5f9',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem'
        }}>
          <span style={{
            background: '#dbeafe',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#2563eb'
          }}>💬</span>
          Your Answers
        </h2>
        {userAnswers.length === 0 ? (
          <p style={{
            textAlign: 'center',
            padding: '2rem',
            color: '#94a3b8',
            fontStyle: 'italic',
            background: '#f8fafc',
            borderRadius: '8px'
          }}>You haven't answered any questions yet.</p>
        ) : (
          <ul style={{ 
            paddingLeft: 0, 
            listStyle: 'none',
            display: 'grid',
            gap: '1.5rem'
          }}>
            {userAnswers.map((a, idx) => (
              <li key={idx} style={{
                background: '#fff',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                padding: '1.5rem',
                transition: 'all 0.2s ease',
                ':hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                  borderColor: '#c7d2fe'
                }
              }}>
                <p style={{ 
                  marginBottom: '1rem',
                  fontSize: '0.95rem'
                }}>
                  In: <Link 
                    to={`/question/${a.questionId}`} 
                    style={{ 
                      color: '#4338ca', 
                      textDecoration: 'none',
                      fontWeight: '600'
                    }}
                  >
                    {a.questionTitle}
                  </Link>
                </p>
                <blockquote style={{
                  margin: 0,
                  padding: '1rem',
                  background: '#f8fafc',
                  borderRadius: '6px',
                  borderLeft: '4px solid #818cf8',
                  color: '#334155',
                  fontStyle: 'normal',
                  fontSize: '1rem'
                }}>
                  {a.text}
                </blockquote>
                <div style={{
                  display: 'flex',
                  gap: '1rem',
                  marginTop: '1rem',
                  fontSize: '0.9rem',
                  color: '#64748b'
                }}>
                  <span>👍 {a.votes || 0} upvotes</span>
                  <span>🗓 {new Date(a.createdAt || Date.now()).toLocaleDateString()}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};

export default UserProfile;