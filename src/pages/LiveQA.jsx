// src/pages/LiveQA.jsx
import { useContext, useEffect, useRef, useState } from 'react';
import { LiveQAContext } from '../context/LiveQAContext';
import { useAuth } from '../context/AuthContext';
import { FaVideo, FaSignOutAlt, FaPaperPlane, FaPlus, FaUserFriends } from 'react-icons/fa';
import { BsStars } from 'react-icons/bs';

export default function LiveQA() {
  const { currentUser } = useAuth();
  const {
    liveSessions,
    activeSession,
    activeSessionData,
    messages,
    createSession,
    joinSession,
    leaveSession,
    sendMessage
  } = useContext(LiveQAContext);

  const [messageInput, setMessageInput] = useState('');
  const [newSessionTitle, setNewSessionTitle] = useState('');
  const messagesEndRef = useRef(null);

  const handleCreateSession = async () => {
    if (!currentUser) {
      alert("You must be logged in to create a session.");
      return;
    }

    if (newSessionTitle.trim()) {
      const sessionId = await createSession(newSessionTitle);
      await joinSession(sessionId);
      setNewSessionTitle('');
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (messageInput.trim() && activeSession && currentUser) {
      await sendMessage(messageInput);
      setMessageInput('');
    }
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <div className="liveqa-container">
      {!activeSession ? (
        <div className="session-browser">
          <div className="header-section">
            <h2><FaVideo className="header-icon" /> Live Q&A Sessions</h2>
            <p className="subtitle">Join existing discussions or start your own</p>
          </div>

          <div className="create-session">
            <div className="input-group">
              <input
                type="text"
                placeholder="What's your session about?"
                value={newSessionTitle}
                onChange={(e) => setNewSessionTitle(e.target.value)}
                className="session-input"
              />
              <button
                onClick={handleCreateSession}
                disabled={!newSessionTitle.trim()}
                className="create-btn"
              >
                <FaPlus className="btn-icon" /> Create Session
              </button>
            </div>
          </div>

          <div className="divider">
            <span>OR JOIN EXISTING</span>
          </div>

          <div className="session-list">
            {liveSessions.length === 0 ? (
              <div className="empty-state">
                <BsStars className="empty-icon" />
                <p>No active sessions yet</p>
                <p className="hint">Be the first to create one!</p>
              </div>
            ) : (
              liveSessions.map(session => (
                <div key={session.id} className="session-card">
                  <div className="card-content">
                    <h3>{session.title}</h3>
                    <div className="session-meta">
                      <span className="host-badge">Host: {session.hostName}</span>
                      <span className="participants">
                        <FaUserFriends /> {session.participants?.length || 0}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => joinSession(session.id)}
                    className="join-btn"
                  >
                    Join Session
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      ) : (
        <div className="active-session">
          <div className="session-header">
            <div className="session-info">
              <h2>{activeSessionData?.title || 'Live Session'}</h2>
              <h2 className="live-title">
                <span className="live-badge">LIVE</span></h2>
            </div>
            <div className="session-actions">
              <div className="participant-count">
                <FaUserFriends /> {activeSessionData?.participants?.length || 0}
              </div>
              <button
                onClick={() => leaveSession(activeSessionData)}
                className="leave-btn"
              >
                <FaSignOutAlt className="btn-icon" /> Leave
              </button>
            </div>
          </div>

          <div className="messages-container">
            {messages.length === 0 ? (
              <div className="empty-chat">
                <BsStars className="empty-icon" />
                <p>No messages yet</p>
                <p className="hint">Start the conversation!</p>
              </div>
            ) : (
              <>
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`message ${msg.senderId === currentUser?.uid ? 'own-message' : 'other-message'}`}
                  >
                    <div className="message-header">
                      <span className="sender-name">
                        {msg.senderId === currentUser?.uid ? 'You' : msg.senderName}
                      </span>
                      &nbsp;&nbsp;&nbsp;
                      <span className="message-time">
                        {new Date(msg.timestamp?.toDate()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <div className="message-content">
                      {msg.text}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          <form onSubmit={handleSendMessage} className="message-form">
            <div className="form-group">
              <input
                type="text"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                placeholder="Type your message..."
                className="message-input"
              />
              <button
                type="submit"
                className="send-btn"
                disabled={!messageInput.trim()}
              >
                <FaPaperPlane className="btn-icon" />
              </button>
            </div>
          </form>
        </div>
      )}

    
      <style>{`
  :root {
    --primary: #6366f1;
    --primary-light: #a5b4fc;
    --primary-dark: #4f46e5;
    --secondary: #f43f5e;
    --text: #1e293b;
    --text-light: #64748b;
    --bg: #f8fafc;
    --card-bg: #ffffff;
    --border: #e2e8f0;
    --shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    --radius-sm: 0.5rem;
    --radius-md: 0.75rem;
    --radius-lg: 1rem;
  }

  .liveqa-container {
    margin: 2rem auto;
    padding: 0 2rem; 
    max-width: 1600px; /* Changed from 900px to 1600px */
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  }
  
  /* Session Browser Styles */
  .session-browser {
    background: var(--bg);
    border-radius: var(--radius-lg);
    padding: 2rem;
    box-shadow: var(--shadow);
  }
  
  .header-section {
    margin-bottom: 2rem;
    text-align: center;
  }
  
  .header-section h2 {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    color: var(--primary-dark);
    margin-bottom: 0.5rem;
    font-size: 1.75rem;
  }
  
  .header-icon {
    color: var(--primary);
  }
  
  .subtitle {
    color: var(--text-light);
    font-size: 1rem;
    margin: 0;
  }
  
  .create-session {
    margin-bottom: 2rem;
  }
  
  .input-group {
    display: flex;
    gap: 1rem;
    align-items: center;
  }
  
  .session-input {
    flex: 1;
    padding: 1rem;
    border: 2px solid var(--border);
    border-radius: var(--radius-sm);
    font-size: 1rem;
    transition: all 0.2s ease;
  }
  
  .session-input:focus {
    outline: none;
    border-color: var(--primary-light);
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
  }
  
  .create-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: var(--primary);
    color: white;
    border: none;
    padding: 1rem 1.5rem;
    border-radius: var(--radius-sm);
    cursor: pointer;
    font-weight: 600;
    transition: all 0.2s ease;
  }
  
  .create-btn:hover {
    background: var(--primary-dark);
    transform: translateY(-1px);
  }
  
  .create-btn:disabled {
    background: var(--primary-light);
    cursor: not-allowed;
    transform: none;
  }
  
  .btn-icon {
    font-size: 0.9rem;
  }
  
  .divider {
    display: flex;
    align-items: center;
    margin: 2rem 0;
    color: var(--text-light);
    font-size: 0.875rem;
  }
  
  .divider::before,
  .divider::after {
    content: "";
    flex: 1;
    border-bottom: 1px solid var(--border);
  }
  
  .divider::before {
    margin-right: 1rem;
  }
  
  .divider::after {
    margin-left: 1rem;
  }
  
  .session-list {
    display: grid;
    gap: 1rem;
  }
  
  .empty-state {
    text-align: center;
    padding: 2rem;
    color: var(--text-light);
  }
  
  .empty-icon {
    font-size: 2rem;
    margin-bottom: 1rem;
    color: var(--primary-light);
  }
  
  .hint {
    font-size: 0.875rem;
    margin-top: 0.25rem;
  }
  
  .session-card {
    background: var(--card-bg);
    border-radius: var(--radius-md);
    padding: 1.75rem;
    box-shadow: var(--shadow);
    border: 1px solid var(--border);
    display: flex;
    justify-content: space-between;
    align-items: center;
    transition: all 0.2s ease;
  }
  
  .session-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  }
  
  .card-content {
    flex: 1;
  }
  
  .session-card h3 {
    margin: 0 0 0.5rem 0;
    color: var(--text);
    font-size: 1.25rem;
  }
  
  .session-meta {
    display: flex;
    gap: 1rem;
    font-size: 1rem; 
    color: var(--text-light);
  }
  
  .host-badge {
    background: #f0fdf4;
    color: #15803d;
    padding: 0.25rem 0.5rem;
    border-radius: 9999px;
    font-size: 0.75rem;
    font-weight: 500;
  }
  
  .participants {
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }
  
  .join-btn {
    background: var(--primary);
    color: white;
    border: none;
    padding: 0.75rem 1.25rem;
    border-radius: var(--radius-sm);
    cursor: pointer;
    font-weight: 500;
    transition: all 0.2s ease;
  }
  
  .join-btn:hover {
    background: var(--primary-dark);
    transform: translateY(-1px);
  }
  
  /* Active Session Styles */
  .active-session {
    display: flex;
    flex-direction: column;
    height: calc(100vh - 6rem);
    background: var(--card-bg);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow);
    overflow: hidden;
    width: 900px;
    margin-left: 250px;
  }
  
  .session-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.5rem;
    background: var(--primary);
    color: white;
  }
  
  .session-info h2 {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 600;
  }
  
  .session-topic {
    margin: 0.25rem 0 0 0;
    font-size: 0.875rem;
    opacity: 0.9;
  }
  
  .leave-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: rgba(255, 255, 255, 0.1);
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: var(--radius-sm);
    cursor: pointer;
    font-weight: 500;
    transition: all 0.2s ease;
  }
  
  .leave-btn:hover {
    background: rgba(255, 255, 255, 0.2);
  }
  
  .messages-container {
    flex: 1;
    padding: 1.5rem;
    overflow-y: auto;
    background: var(--bg);
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  
  .empty-chat {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    color: var(--text-light);
  }
  
  .message {
    max-width: 70%;
    padding: 0.75rem 1rem;
    border-radius: var(--radius-md);
    position: relative;
    animation: fadeIn 0.3s ease;
  }
  
  .other-message {
    background: var(--card-bg);
    align-self: flex-start;
    border-top-left-radius: 0;
  }
  
  .own-message {
    background: var(--primary);
    color: white;
    align-self: flex-end;
    border-top-right-radius: 0;
  }
  
  .message-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.25rem;
    font-size: 0.75rem;
  }
  
  .other-message .message-header {
    color: var(--text-light);
  }
  
  .own-message .message-header {
    color: rgba(255, 255, 255, 0.8);
  }
  
  .sender-name {
    font-weight: 600;
  }
  
  .message-time {
    opacity: 0.8;
  }
  
  .message-content {
    word-wrap: break-word;
  }
  
  .message-form {
    padding: 1rem;
    background: var(--card-bg);
    border-top: 1px solid var(--border);
  }
  
  .form-group {
    display: flex;
    gap: 0.5rem;
  }
  
  .message-input {
    flex: 1;
    padding: 1rem;
    border: 2px solid var(--border);
    border-radius: var(--radius-sm);
    font-size: 1rem;
    transition: all 0.2s ease;
  }
  
  .message-input:focus {
    outline: none;
    border-color: var(--primary-light);
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
  }
  
  .send-btn {
    background: var(--primary);
    color: white;
    border: none;
    width: 50px;
    height: 50px;
    border-radius: var(--radius-sm);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
  }
  
  .send-btn:hover {
    background: var(--primary-dark);
    transform: translateY(-1px);
  }
  
  .send-btn:disabled {
    background: var(--primary-light);
    cursor: not-allowed;
    transform: none;
  }
  
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  // @media (max-width: 768px) {
  //   .liveqa-container {
  //     margin: 1rem;
  //     padding: 0;
  //     max-width: 100%;
  //   }
    
    .session-browser, .active-session {
      border-radius: 0;
    }
    
    .message {
      max-width: 85%;
    }
  }

  .live-badge {
  background: var(--secondary);
  color: white;
  padding: 0.25rem 0.6rem;
  font-size: 0.75rem;
  font-weight: 600;
  border-radius: 9999px;
  animation: pulse 1.5s infinite;
  margin-right: 0.5rem;
}

@keyframes pulse {
  0% { box-shadow: 0 0 0 0 rgba(244, 63, 94, 0.7); }
  70% { box-shadow: 0 0 0 10px rgba(244, 63, 94, 0); }
  100% { box-shadow: 0 0 0 0 rgba(244, 63, 94, 0); }
}
  
`}</style>
    </div>
  );
}