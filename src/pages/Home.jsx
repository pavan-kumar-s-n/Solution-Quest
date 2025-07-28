import React, { useContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { QuestionContext } from '../context/QuestionContext';
import HeroSection from '../Components/HeroSection';
import QuestionCard from '../Components/QuestionCard';
import FloatingPostForm from '../Components/FloatingPostForm';
import TopBar from '../Components/TopBar';

function Home() {
  const { user } = useAuth();
  const { questions, addQuestion, deleteQuestion, updateLeaderboard } = useContext(QuestionContext);
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const selectedTag = queryParams.get('tag');

  const [title, setTitle] = useState('');
  const [tags, setTags] = useState('');
  const [filterTag, setFilterTag] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  const [showFloatingForm, setShowFloatingForm] = useState(false);

  useEffect(() => {
    if (selectedTag) {
      setFilterTag(selectedTag);
    }
  }, [selectedTag]);

  const handlePostQuestion = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newQuestion = {
      title,
      author: user.username,
      tags: tags.split(',').map(tag => tag.trim()).filter(Boolean),
      answers: [],
      createdAt: Date.now()
    };
    await addQuestion(newQuestion);
    await updateLeaderboard(user.uid, 'question');
     const userRef = doc(db, "users", user.uid);
  await updateDoc(userRef, {
    questionsPosted: increment(1)
  });
    setTitle('');
    setTags('');
  };

  const handleEdit = (id) => {
    navigate(`/edit-question/${id}`);
  };

  const getFilteredQuestions = () => {
    let filtered = [...questions];

    if (filterTag) {
      filtered = filtered.filter(q => q.tags.includes(filterTag));
    }

    if (searchTerm.trim()) {
      filtered = filtered.filter(q =>
        q.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (sortBy === 'recent') {
      filtered.sort((a, b) => b.createdAt - a.createdAt);
    } else if (sortBy === 'answered') {
      filtered.sort((a, b) => b.answers.length - a.answers.length);
    }

    return filtered;
  };

  const allTags = Array.from(new Set(questions.flatMap(q => q.tags)));

  return (
    <div className="home-container">
      <TopBar 
        setShowFloatingForm={setShowFloatingForm}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        setFilterTag={setFilterTag}
      />

      {showFloatingForm && (
        <FloatingPostForm
          title={title}
          setTitle={setTitle}
          tags={tags}
          setTags={setTags}
          onSubmit={(e) => {
            handlePostQuestion(e);
            setShowFloatingForm(false);
          }}
          onClose={() => setShowFloatingForm(false)}
        />
      )}

      <div className="home-content">
        <main className="questions-main">
          <HeroSection />
       
          {user && (
            <section className="browse-questions">
              <div className="questions-header">
                <h2 className="section-title">All Questions</h2>
                <div className="questions-controls">
                  <div className="search-container">
                    <input
                      type="text"
                      placeholder="Search questions..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="search-input"
                    />
                  </div>
                  <div className="filter-container">
                    <select
                      value={filterTag}
                      onChange={(e) => setFilterTag(e.target.value)}
                      className="filter-select"
                    >
                      <option value="">All Tags</option>
                      {allTags.map((tag, idx) => (
                        <option key={idx} value={tag}>{tag}</option>
                      ))}
                    </select>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="sort-select"
                    >
                      <option value="recent">Most Recent</option>
                      <option value="answered">Most Answered</option>
                    </select>
                  </div>
                </div>
              </div>

              {getFilteredQuestions().length === 0 ? (
                <div className="no-questions">
                  <p>No questions found. Be the first to ask one!</p>
                  <button 
                    onClick={() => setShowFloatingForm(true)}
                    className="ask-question-btn"
                  >
                    Ask a Question
                  </button>
                </div>
              ) : (
                <div className="questions-grid">
                  {getFilteredQuestions().map((q) => (
                    <QuestionCard
                      key={q.id}
                      question={q}
                      user={user}
                      onEdit={handleEdit}
                      onDelete={deleteQuestion}
                    />
                  ))}
                </div>
              )}
            </section>
          )}
        </main>
      </div>

      <style>{`
        :root {
          --background-color: #f8fafc;
          --text-color: #1e293b;
          --primary-color: #6366f1;
          --primary-dark: #4f46e5;
          --primary-rgb: 99, 102, 241;
          --card-bg: #ffffff;
          --card-secondary-bg: #f1f5f9;
          --border-color: #e2e8f0;
          --input-bg: #ffffff;
          --text-secondary: #64748b;
        }

        .home-container {
          background-color: var(--background-color);
          color: var(--text-color);
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          margin-left: 250px;
          transition: margin 0.3s ease;
        }

        .sidebar.collapsed ~ .home-container {
          margin-left: 60px;
        }

        .home-content {
          display: flex;
          max-width: 1200px;
          margin: 0 auto;
          width: 100%;
          padding: 1.5rem;
        }

        .browse-questions {
          margin: 2rem 0;
          padding: 1.75rem;
          background: var(--card-bg);
          border-radius: 12px;
          box-shadow: 0 2px 12px rgba(99, 102, 241, 0.05);
          border: 1px solid var(--border-color);
        }

        .section-title {
          font-size: 1.5rem;
          font-weight: 600;
          color: var(--primary-color);
          margin: 0 0 1.5rem 0;
        }

        .search-container {
          position: relative;
          flex: 1;
          max-width: 500px;
        }

        .search-input {
          width: 100%;
          padding: 0.75rem 1rem 0.75rem 2.5rem;
          border-radius: 8px;
          border: 1px solid var(--border-color);
          background: var(--input-bg);
          color: var(--text-color);
          font-size: 1rem;
          transition: all 0.2s;
        }

        .search-input:focus {
          outline: none;
          border-color: var(--primary-color);
          box-shadow: 0 0 0 3px rgba(var(--primary-rgb), 0.1);
        }

        .search-icon {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          width: 1rem;
          height: 1rem;
          fill: #94a3b8;
        }

        .filter-container {
          display: flex;
          gap: 0.75rem;
        }

        .filter-select,
        .sort-select {
          padding: 0.75rem 1rem;
          border-radius: 8px;
          border: 1px solid var(--border-color);
          background: var(--input-bg);
          color: var(--text-color);
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .filter-select:focus,
        .sort-select:focus {
          outline: none;
          border-color: var(--primary-color);
        }

        .no-questions {
          text-align: center;
          padding: 3rem 1rem;
          background: var(--card-secondary-bg);
          border-radius: 8px;
          margin-top: 1rem;
          border: 1px dashed #cbd5e1;
        }

        .no-questions p {
          color: var(--text-secondary);
          margin-bottom: 1.5rem;
          font-size: 1.1rem;
        }

        .ask-question-btn {
          padding: 0.75rem 1.5rem;
          background: var(--primary-color);
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          box-shadow: 0 2px 5px rgba(99, 102, 241, 0.2);
        }

        .ask-question-btn:hover {
          background: var(--primary-dark);
          transform: translateY(-1px);
          box-shadow: 0 4px 8px rgba(99, 102, 241, 0.25);
        }

        .questions-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.25rem;
          margin-top: 1.5rem;
        }

        @media (min-width: 768px) {
          .questions-grid {
            grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          }
          
          .questions-controls {
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
          }
        }
      `}</style>
    </div>
  );
}

export default Home;
