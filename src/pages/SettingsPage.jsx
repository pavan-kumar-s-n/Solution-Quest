import React, { useEffect, useState } from "react";
import { FaLock, FaSignInAlt, FaUserPlus, FaSun, FaMoon } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";



const SettingsPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showPasswordModal, setShowPasswordModal] = useState(false);
const [newPassword, setNewPassword] = useState("");
const [confirmPassword, setConfirmPassword] = useState("");


  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("theme") === "dark");
  const [notificationsEnabled, setNotificationsEnabled] = useState(() => {
    return localStorage.getItem("notifications") !== "false";
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem("notifications", notificationsEnabled);
  }, [notificationsEnabled]);

  if (!user) {
    return (
      <div className="auth-required-message">
        <div className="auth-required-content">
          <FaLock className="auth-icon" />
          <h2>Authentication Required</h2>
          <p>Please sign in to access your account settings and preferences.</p>
          
          <div className="auth-actions">
            <button 
              className="auth-btn login-btn"
              onClick={() => navigate('/login')}
            >
              <FaSignInAlt className="btn-icon" />
              <span>Login to Your Account</span>
            </button>
            
            <span className="auth-divider">or</span>
            
            <button 
              className="auth-btn signup-btn"
              onClick={() => navigate('/signup')}
            >
              <FaUserPlus className="btn-icon" />
              <span>Create New Account</span>
            </button>
          </div>
          
          <p className="auth-note">
            By signing in, you'll be able to customize your profile, 
            notification preferences, and privacy settings.
          </p>
        </div>

        <style jsx>{`
          .auth-required-message {
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 60vh;
            padding: 2rem;
            text-align: center;
          }
          
          .auth-required-content {
            max-width: 500px;
            padding: 2rem;
            border-radius: 12px;
            background-color: #fff;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          }
          
          .auth-icon {
            font-size: 2.5rem;
            color: #6366f1;
            margin-bottom: 1rem;
          }
          
          h2 {
            color: #1f2937;
            margin-bottom: 0.75rem;
            font-size: 1.5rem;
          }
          
          p {
            color: #4b5563;
            margin-bottom: 1.5rem;
            line-height: 1.5;
          }
          
          .auth-actions {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 1rem;
            margin-bottom: 1.5rem;
            flex-wrap: wrap;
          }
          
          .auth-btn {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.75rem 1.5rem;
            border-radius: 8px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s ease;
            border: none;
          }
          
          .login-btn {
            background-color: #6366f1;
            color: white;
          }
          
          .login-btn:hover {
            background-color: #4f46e5;
            transform: translateY(-1px);
          }
          
          .signup-btn {
            background-color: #f3f4f6;
            color: #1f2937;
            border: 1px solid #e5e7eb;
          }
          
          .signup-btn:hover {
            background-color: #e5e7eb;
          }
          
          .auth-divider {
            color: #9ca3af;
            font-size: 0.875rem;
          }
          
          .auth-note {
            font-size: 0.875rem;
            color: #6b7280;
            margin-top: 1rem;
          }
          
          .btn-icon {
            font-size: 0.9rem;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="settings-container">
      <div className="settings-box">
        <h1 className="settings-title">Settings</h1>

        <div className="user-info">
          <p><strong>Username:</strong> {user.username}</p>
          <p><strong>Email:</strong> {user.email}</p>
        </div>

        <div className="settings-item">
          <span>Dark Mode</span>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`btn ${darkMode ? "light-btn" : "dark-btn"}`}
          >
            {darkMode ? (
              <>
                <FaSun style={{ marginRight: '8px' }} />
                Light Mode
              </>
            ) : (
              <>
                <FaMoon style={{ marginRight: '8px' }} />
                Dark Mode
              </>
            )}
          </button>
        </div>

        <div className="settings-item">
          <span>Notifications</span>
          <button
            onClick={() => setNotificationsEnabled(!notificationsEnabled)}
            className="btn toggle-btn"
          >
            {notificationsEnabled ? "Enabled" : "Disabled"}
          </button>
        </div>

        <div className="settings-item">
          <span>Profile</span>
          <button
            onClick={() => navigate(`/profile/${user.username}`)}
            className="btn profile-btn"
          >
            View Profile
          </button>
        </div>

        <div className="settings-item">
          <span>Password</span>
        <button
  onClick={() => setShowPasswordModal(true)}
  className="btn password-btn"
>
  Change Password
</button>
        </div>

        <div className="settings-item">
          <span>Logout</span>
          <button onClick={logout} className="btn logout-btn">
            Logout
          </button>
        </div>

        {showPasswordModal && (
  <div className="modal-overlay">
    <div className="modal-content">
      <h2>Change Password</h2>
      <input
        type="password"
        placeholder="New Password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />
      <input
        type="password"
        placeholder="Confirm Password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />
      <div className="modal-actions">
        <button
          onClick={async () => {
            if (newPassword.length < 6) {
              alert("Password must be at least 6 characters.");
              return;
            }
            if (newPassword !== confirmPassword) {
              alert("Passwords do not match.");
              return;
            }
            try {
              await updatePasswordForCurrentUser(newPassword);
              setShowPasswordModal(false);
              setNewPassword("");
              setConfirmPassword("");
            } catch (err) {
              console.error(err);
              alert("Failed to update password.");
            }
          }}
          className="modal-btn confirm-btn"
        >
          Update
        </button>
        <button
          onClick={() => setShowPasswordModal(false)}
          className="modal-btn cancel-btn"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
)}
      </div>

      <style jsx>{`
        :root {
          --bg-primary: #ffffff;
          --bg-secondary: #f8f9fa;
          --text-primary: #212529;
          --text-secondary: #495057;
        }

        .dark {
          --bg-primary: #121212;
          --bg-secondary: #1e1e1e;
          --text-primary: #f8f9fa;
          --text-secondary: #adb5bd;
        }

        html.dark {
          background-color: var(--bg-primary);
          color: var(--text-primary);
        }

        .settings-container {
          padding: 2rem;
          background: var(--bg-primary);
          transition: all 0.3s ease;
          margin: 40px 40px;
          margin: 40px;
        }

        .settings-box {
          max-width: 600px;
          margin: auto;
          background: var(--bg-primary);
          padding: 2rem;
          border-radius: 12px;
          box-shadow: 0 8px 20px rgba(0,0,0,0.05);
          transition: all 0.3s ease;
          color: var(--text-primary);
        }

        .settings-title {
          font-size: 2rem;
          font-weight: bold;
          margin-bottom: 1.5rem;
          text-align: center;
        }

        .user-info {
          margin-bottom: 2rem;
          font-size: 0.95rem;
          line-height: 1.6;
        }

        .settings-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.25rem;
        }

        .btn {
          padding: 0.5rem 1rem;
          border: none;
          border-radius: 6px;
          font-size: 0.95rem;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
        }

        .dark-btn {
          background-color: #333;
          color: white;
        }

        .light-btn {
          background-color: #f1c40f;
          color: black;
        }

        .toggle-btn {
          background-color: #6366f1;
          color: white;
        }

        .profile-btn {
          background-color: #3498db;
          color: white;
        }

        .logout-btn {
          background-color: #e74c3c;
          color: white;
        }

        .password-btn {
          background-color: #9b59b6;
          color: white;
        }

        .modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: var(--bg-primary);
  color: var(--text-primary);
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 8px 20px rgba(0,0,0,0.2);
  width: 100%;
  max-width: 400px;
  text-align: center;
  animation: fadeIn 0.3s ease-in-out;
}

.modal-content h2 {
  margin-bottom: 1rem;
  font-size: 1.5rem;
}

.modal-content input {
  width: 100%;
  padding: 0.75rem;
  margin-bottom: 1rem;
  border-radius: 6px;
  border: 1px solid #ccc;
  background-color: var(--bg-secondary);
  color: var(--text-primary);
}

.modal-actions {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
}

.modal-btn {
  flex: 1;
  padding: 0.75rem;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
}

.confirm-btn {
  background-color: #10b981;
  color: white;
}

.cancel-btn {
  background-color: #ef4444;
  color: white;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}


        @media (max-width: 500px) {
          .settings-item {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.5rem;
          }

          .settings-title {
            font-size: 1.6rem;
          }

          .btn {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default SettingsPage;