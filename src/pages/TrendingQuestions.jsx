import React, { useContext } from "react";
import { QuestionContext } from "../context/QuestionContext";
import { FaFire, FaComment, FaHeart, FaEye } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function TrendingQuestions() {
  const { questions } = useContext(QuestionContext);
  const navigate = useNavigate();

  if (!questions || questions.length === 0) {
    return (
      <div className="trending-container">
        <p className="no-questions">Loading or no trending questions available.</p>
      </div>
    );
  }

  // Sort by engagement score (answers + likes + views)
  const sortedQuestions = [...questions].sort((a, b) => {
    const engagementA = (a.answers?.length || 0) + (a.likes || 0) + (a.views || 0);
    const engagementB = (b.answers?.length || 0) + (b.likes || 0) + (b.views || 0);
    return engagementB - engagementA;
  });

  const handleQuestionClick = (id) => {
    navigate(`/question/${id}`);
  };

  return (
    <div className="trending-container">
      <div className="trending-header">
        <FaFire className="trending-icon" />
        <h2>Trending Questions</h2>
      </div>
      
      <div className="trending-list">
        {sortedQuestions.slice(0, 10).map((q, index) => (
          <div 
            key={q.id} 
            className="trending-card"
            onClick={() => handleQuestionClick(q.id)}
          >
            <div className="trending-rank">
              #{index + 1}
            </div>
            <div className="trending-content">
              <h3 className="trending-title">{q.title}</h3>
              <div className="trending-tags">
                {q.tags?.map(tag => (
                  <span key={tag} className="trending-tag">#{tag}</span>
                ))}
              </div>
              <div className="trending-stats">
                <span className="trending-stat">
                  <FaComment />  {q.answers?.length || 0} <small>answers</small>
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        .trending-container {
          margin: 2rem 0;
          padding: 0 1rem;
          margin-left: 300px;
          max-width: 800px;
        }
        
        .trending-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 2rem;
          color: #ff6b35;
        }
        
        .trending-icon {
          font-size: 1.8rem;
        }
        
        .trending-header h2 {
          font-size: 1.8rem;
          margin: 0;
          font-weight: 600;
        }
        
        .trending-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        
        .trending-card {
          background: white;
          border-radius: 10px;
          padding: 1.5rem;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          display: flex;
          gap: 1.5rem;
          cursor: pointer;
          transition: all 0.2s ease;
          border-left: 4px solid #ff6b35;
        }
        
        .trending-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }
        
        .trending-rank {
          font-size: 1.5rem;
          font-weight: bold;
          color: #ff6b35;
          min-width: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .trending-content {
          flex: 1;
        }
        
        .trending-title {
          margin: 0 0 0.5rem 0;
          font-size: 1.1rem;
          color: #333;
        }
        
        .trending-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }
        
        .trending-tag {
          background: #f0f7ff;
          color: #1a73e8;
          padding: 0.2rem 0.6rem;
          border-radius: 20px;
          font-size: 0.8rem;
        }
        
        .trending-stats {
          display: flex;
          gap: 1.5rem;
          color: #666;
        }
        
        .trending-stat {
          display: flex;
          align-items: center;
          gap: 0.3rem;
          font-size: 0.9rem;
        }
        
        .no-questions {
          text-align: center;
          color: #666;
          padding: 2rem;
          background: white;
          border-radius: 10px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        
        @media (max-width: 768px) {
          .trending-container {
            margin-left: 1rem;
            padding: 0 1rem;
          }
        }
      `}</style>
    </div>
  );
}