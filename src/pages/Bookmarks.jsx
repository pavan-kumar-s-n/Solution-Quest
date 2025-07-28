import React, { useContext } from 'react';
import { BookmarksContext } from '../context/BookmarksContext';
import QuestionCard from '../Components/QuestionCard';
import { FaBookmark, FaRegBookmark } from 'react-icons/fa';

export default function Bookmarks() {
  const { bookmarkedQuestions, removeBookmark } = useContext(BookmarksContext);

  return (
    <div className="bookmarks-container">
      <div className="bookmarks-header">
        <h2><FaBookmark /> Saved Questions</h2>
        <p>{bookmarkedQuestions.length} bookmarked questions</p>
      </div>

      {bookmarkedQuestions.length === 0 ? (
        <div className="empty-state">
          <FaRegBookmark size={48} />
          <h3>No bookmarks yet</h3>
          <p>Save interesting questions to find them easily later</p>
        </div>
      ) : (
        <div className="bookmarks-list">
          {bookmarkedQuestions.map(question => (
            <QuestionCard
              key={question.id}
              question={question}
              onBookmark={() => removeBookmark(question.id)}
              isBookmarked={true}
            />
          ))}
        </div>
      )}
  
      <style jsx>{`
        .bookmarks-container {
          margin: 2rem 0;
          padding: 0 1rem;
          margin-left: 300px;
          max-width: 800px;
        }
        
        .bookmarks-header {
          margin-bottom: 2rem;
        }
        
        .bookmarks-header h2 {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 1.8rem;
          color: #4f46e5;
          margin-bottom: 0.5rem;
        }
        
        .bookmarks-header p {
          color: #64748b;
          font-size: 0.9rem;
        }
        
        .empty-state {
          text-align: center;
          padding: 3rem;
          background: white;
          border-radius: 10px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        
        .empty-state h3 {
          margin: 1rem 0 0.5rem;
          color: #334155;
        }
        
        .empty-state p {
          color: #64748b;
          margin: 0;
        }
        
        .bookmarks-list {
          display: grid;
          gap: 1.5rem;
        }
        
        @media (max-width: 768px) {
          .bookmarks-container {
            margin-left: 1rem;
            padding: 0 1rem;
          }
        }
      `}</style>
    </div>
  );
}