import { Link, useNavigate } from 'react-router-dom';
import { 
  FaSearch, 
  FaUser, 
  FaSignOutAlt, 
  FaSignInAlt, 
  FaUserPlus, 
  FaPlus,
  FaTimes
} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect, useRef } from 'react';
import { QuestionContext } from '../context/QuestionContext';
import { useContext } from 'react';

const TopBar = ({ 
  setShowFloatingForm,
  searchTerm = "",  // Default value to prevent undefined
  setSearchTerm,
  setFilterTag
}) => {
  const { user, logout } = useAuth();
  const { questions } = useContext(QuestionContext);
  const navigate = useNavigate();
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const searchRef = useRef(null);

  // Get unique tags and questions for suggestions
  const allTags = Array.from(new Set(questions.flatMap(q => q.tags)));
  const allQuestions = questions.map(q => q.title);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (!searchTerm || searchTerm.trim() === '') {
      setSuggestions([]);
      return;
    }

    const searchLower = searchTerm.toLowerCase();
    
    const tagMatches = allTags.filter(tag => 
      tag.toLowerCase().includes(searchLower)
    ).slice(0, 3);
    
    const questionMatches = allQuestions.filter(title => 
      title.toLowerCase().includes(searchLower)
    ).slice(0, 5 - tagMatches.length);
    
    setSuggestions([
      ...tagMatches.map(tag => ({ type: 'tag', text: tag })),
      ...questionMatches.map(title => ({ type: 'question', text: title }))
    ]);
    
    setShowSuggestions(true);
  }, [searchTerm, questions]);

  const handleSuggestionClick = (suggestion) => {
    if (suggestion.type === 'tag') {
      setFilterTag(suggestion.text);
      setSearchTerm('');
    } else {
      setSearchTerm(suggestion.text);
    }
    setShowSuggestions(false);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setShowSuggestions(false);
  };

  return (
    <header className="topbar">
      <div className="topbar-left">
        <Link to="/" className="logo">
          <span>QnA</span>
        </Link>

        {user && (
          <div className="search-container" ref={searchRef}>
            <form onSubmit={handleSearchSubmit}>
            <div className="search-input-wrapper">
  <div className="search-input-container">
    <input
      type="text"
      placeholder="Search questions or tags..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      onFocus={() => searchTerm && setShowSuggestions(true)}
      className="search-input"
    />
    {!searchTerm ? (
      <FaSearch className="search-icon-inside" />
    ) : (
      <button
        type="button"
        className="clear-search"
        onClick={() => {
          setSearchTerm('');
          setFilterTag('');
        }}
      >
        <FaTimes />
      </button>
    )}
  </div>
</div>
              
              {showSuggestions && suggestions.length > 0 && (
                <div className="suggestions-dropdown">
                  {suggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      className="suggestion-item"
                      onClick={() => handleSuggestionClick(suggestion)}
                    >
                      <div className="suggestion-icon">
                        {suggestion.type === 'tag' ? (
                          <span className="tag-badge">Tag</span>
                        ) : (
                          <FaSearch />
                        )}
                      </div>
                      <div className="suggestion-text">
                        {suggestion.text}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </form>
          </div>
        )}
      </div>

      <div className="topbar-right">
        {user ? (
          <>
            <button 
              className="post-btn"
              onClick={() => setShowFloatingForm(true)}
            >
              <FaPlus className="btn-icon" />
              <span>Ask Question</span>
            </button>
            
            <div className="user-dropdown">
              <Link to={`/userProfile/${user.username}`} className="user-link">
                <FaUser className="user-icon" />
                <span className="username">{user.username}</span>
              </Link>
              
              <button onClick={logout} className="logout-btn">
                <FaSignOutAlt className="btn-icon" />
                <span>Logout</span>
              </button>
            </div>
          </>
        ) : (
          <div className="auth-buttons">
            <button 
              className="auth-btn login-btn"
              onClick={() => navigate('/login')}
            >
              <FaSignInAlt className="btn-icon" />
              <span>Login</span>
            </button>
            <button 
              className="auth-btn signup-btn"
              onClick={() => navigate('/signup')}
            >
              <FaUserPlus className="btn-icon" />
              <span>Signup</span>
            </button>
          </div>
        )}
      </div>

      <style>{`
        .topbar {
          position: sticky;
          top: 0;
          left: 0;
          width: 100%;
          height: auto;
          min-height: 60px;
          background-color: #ffffff;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.5rem 2rem;
          z-index: 1000;
          flex-wrap: wrap;
          gap: 1rem;
        }
        
        .topbar-left {
          display: flex;
          align-items: center;
          gap: 2rem;
          flex: 1;
          min-width: 300px;
        }
        
        .logo {
          font-size: 1.5rem;
          font-weight: bold;
          color: #059669;
          text-decoration: none;
          display: flex;
          align-items: center;
          white-space: nowrap;
        }
        
.search-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.search-input-container {
  position: relative;
  width: 100%;
}

.search-input {
  width: 100%;
  padding: 8px 36px 8px 12px; /* leave space for icon on the right */
  border: 1px solid #ccc;
  border-radius: 4px;
}

.clear-search {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  color: #888;
  padding: 0;
  transition: transform 0.2s ease, color 0.2s ease;
}

.clear-search:hover {
  transform: translateY(-50%) scale(1.1);
  color: #444; 
}

.search-icon-inside {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: #888;
  pointer-events: none;
}

.search-icon {
  font-size: 16px;
}
        .search-button:hover, .clear-search:hover {
          color: #059669;
        }
        
        .suggestions-dropdown {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background: white;
          border: 1px solid #E5E7EB;
          border-radius: 0 0 6px 6px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          z-index: 1000;
          max-height: 300px;
          overflow-y: auto;
        }
        
        .suggestion-item {
          display: flex;
          align-items: center;
          padding: 0.75rem 1rem;
          cursor: pointer;
          transition: background-color 0.2s ease;
        }
        
        .suggestion-item:hover {
          background-color: #f8f9fa;
        }
        
        .suggestion-icon {
          margin-right: 0.75rem;
          color: #6B7280;
          width: 20px;
          display: flex;
          justify-content: center;
        }
        
        .suggestion-text {
          flex: 1;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        
        .tag-badge {
          background-color: #E0F2FE;
          color: #0369A1;
          padding: 0.15rem 0.5rem;
          border-radius: 4px;
          font-size: 0.7rem;
          font-weight: 500;
        }
        
        .topbar-right {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          flex-wrap: wrap;
          justify-content: flex-end;
        }
        
        .post-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background-color: #059669;
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 6px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          white-space: nowrap;
        }
        
        .post-btn:hover {
          background-color: #047857;
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(5, 150, 105, 0.3);
        }
        
        .user-dropdown {
          display: flex;
          align-items: center;
          gap: 1rem;
          position: relative;
        }
        
        .user-link {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #4B5563;
          text-decoration: none;
          transition: all 0.2s ease;
          white-space: nowrap;
        }
        
        .user-link:hover {
          color: #047857;
        }
        
        .user-icon {
          font-size: 1rem;
        }
        
        .username {
          font-weight: 500;
        }
        
        .logout-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: none;
          border: none;
          color: #EF4444;
          cursor: pointer;
          padding: 0.5rem;
          border-radius: 4px;
          transition: all 0.2s ease;
          white-space: nowrap;
        }
        
        .logout-btn:hover {
          background-color: #FEE2E2;
        }
        
        .auth-buttons {
          display: flex;
          gap: 1rem;
        }
        
        .auth-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          border-radius: 6px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          border: 1px solid transparent;
          white-space: nowrap;
        }
        
        .login-btn {
          background: none;
          color: #4B5563;
          border-color: #E5E7EB;
        }
        
        .login-btn:hover {
          background-color: #F3F4F6;
        }
        
        .signup-btn {
          background-color: #059669;
          color: white;
        }
        
        .signup-btn:hover {
          background-color: #047857;
        }
        
        .btn-icon {
          font-size: 0.9rem;
        }
      `}</style>
    </header>
  );
};

export default TopBar;