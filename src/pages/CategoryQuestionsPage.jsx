import { useParams } from 'react-router-dom';
import { useEffect, useState, useContext  } from 'react';
import { db } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import QuestionPage from './QuestionPage'; // Import your QuestionPage component
import FloatingPostForm from "../Components/FloatingPostForm";
import { useAuth } from "../context/AuthContext";
import { QuestionContext } from "../context/QuestionContext";
import { useNavigate } from "react-router-dom";



const CategoryQuestionsPage = () => {
  const { tag } = useParams();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedQuestionId, setSelectedQuestionId] = useState(null); // To render full question

  const { user } = useAuth();
const { addQuestion } = useContext(QuestionContext);
const navigate = useNavigate();

const [showFloatingForm, setShowFloatingForm] = useState(false);
const [title, setTitle] = useState("");
const [tags, setTags] = useState("");


  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        const q = query(
          collection(db, 'questions'),
          where('tags', 'array-contains', tag.toLowerCase())
        );
        const snapshot = await getDocs(q);
        const fetchedQuestions = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setQuestions(fetchedQuestions);
      } catch (error) {
        console.error('Error fetching questions:', error);
      } finally {
        setLoading(false);
      }
    };

    if (tag) {
      fetchQuestions();
      setSelectedQuestionId(null); // reset selected question on tag change
    }
  }, [tag]);

  const filteredQuestions = questions.filter(q =>
    q.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    q.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (selectedQuestionId) {
    return (
      <div className="category-question-detail">
        <button 
        onClick={() => setSelectedQuestionId(null)} 
        style={{marginLeft:'150px'}}
        className="back-btn">
          ⬅ Back to  Questions
        </button>
        <QuestionPage overrideId={selectedQuestionId} />
      </div>
    );
  }

  const handlePostQuestion = async (e) => {
  e.preventDefault();
  if (!title.trim()) return;

  const newQuestion = {
    title,
    author: user.username,
    tags: tags.split(",").map((tag) => tag.trim()).filter(Boolean),
    answers: [],
    createdAt: Date.now()
  };

  const added = await addQuestion(newQuestion);
  
  setTitle("");
  setTags("");
  setShowFloatingForm(false);

  // Navigate to the question page after posting
  navigate(`/questions/${added.id}`);
};


  return (
    <div className="category-questions-page">
      <div className="header-section">
        <h1>Questions related to <span className="tag-highlight">{tag}</span></h1>
        <p className="results-count">{filteredQuestions.length} question{filteredQuestions.length !== 1 ? 's' : ''}</p>

        <div className="search-container">
          <input
            type="text"
            placeholder="Search within this tag..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <button className="ask-question-btn">Ask Question</button>
        </div>
      </div>

      {loading ? (
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading questions...</p>
        </div>
      ) : filteredQuestions.length > 0 ? (
        <div className="questions-grid">
          {filteredQuestions.map(q => (
            <div 
              key={q.id} 
              className="question-card"
              onClick={() => setSelectedQuestionId(q.id)}
            >
              <h3>{q.title}</h3>
              <div className="question-footer">
                <div className="tags-container">
                  {q.tags?.map(t => (
                    <span key={t} className="tag">{t}</span>
                  ))}
                </div>
                <div className="question-meta">
                  <span className="answers-count">{q.answers?.length || 0} answers</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-questions">
          <h3>No questions found</h3>
          <p>Be the first to ask a question with this tag!</p>
          <button onClick={() => setShowFloatingForm(true)}>Ask a Question</button>

          {showFloatingForm && (
  <FloatingPostForm
    title={title}
    setTitle={setTitle}
    tags={tags}
    setTags={setTags}
    onSubmit={handlePostQuestion}
    onClose={() => setShowFloatingForm(false)}
  />
)}
        </div>
      )}
   
      <style>{`
        .category-questions-page {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        
        .header-section {
          margin-bottom: 2rem;
          border-bottom: 1px solid #e0e0e0;
          padding-bottom: 1.5rem;
        }
        
        h1 {
          font-size: 2rem;
          color: #333;
          margin-bottom: 0.5rem;
        }
        
        .tag-highlight {
          color: #3b82f6;
          background-color: #eff6ff;
          padding: 0.2rem 0.5rem;
          border-radius: 4px;
        }
        
        .results-count {
          color: #666;
          font-size: 0.9rem;
          margin-bottom: 1.5rem;
        }
        
        .search-container {
          display: flex;
          gap: 1rem;
          margin-top: 1.5rem;
        }
        
        .search-input {
          flex: 1;
          padding: 0.75rem 1rem;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 1rem;
          transition: border 0.2s;
        }
        
        .search-input:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
        }
        
        .ask-question-btn {
          background-color: #3b82f6;
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 4px;
          cursor: pointer;
          font-weight: 600;
          transition: background-color 0.2s;
        }
        
        .ask-question-btn:hover {
          background-color: #2563eb;
        }
        
        .loading-spinner {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 3rem;
        }
        
        .spinner {
          border: 4px solid rgba(0, 0, 0, 0.1);
          border-radius: 50%;
          border-top: 4px solid #3b82f6;
          width: 40px;
          height: 40px;
          animation: spin 1s linear infinite;
          margin-bottom: 1rem;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .questions-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1.5rem;
        }
        
        .question-card {
          background-color: white;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          padding: 1.5rem;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
          width: 600px;
        }
        
        .question-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          border-color: #3b82f6;
        }
        
        .question-card h3 {
          color: #3b82f6;
          margin-bottom: 0.75rem;
          font-size: 1.2rem;
        }
        
        .question-excerpt {
          color: #555;
          margin-bottom: 1rem;
          line-height: 1.5;
        }
        
        .question-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 1rem;
        }
        
        .tags-container {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }
        
        .tag {
          background-color: #eff6ff;
          color: #3b82f6;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-size: 0.8rem;
        }
        
        .question-meta {
          display: flex;
          gap: 0.75rem;
          font-size: 0.85rem;
          color: #666;
        }
        
        .no-questions {
          text-align: center;
          padding: 3rem;
          background-color: #f8fafc;
          border-radius: 8px;
        }
        
        .no-questions h3 {
          color: #333;
          margin-bottom: 0.5rem;
        }
        
        .no-questions p {
          color: #666;
          margin-bottom: 1.5rem;
        }
        
        .ask-question-btn.primary {
          font-size: 1rem;
          padding: 0.75rem 2rem;
        }
        
        @media (max-width: 768px) {
          .questions-grid {
            grid-template-columns: 1fr;
          }
          
          .search-container {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
};

export default CategoryQuestionsPage;