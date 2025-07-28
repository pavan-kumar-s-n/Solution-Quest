import { Link } from 'react-router-dom';
import { BookmarksContext } from '../context/BookmarksContext';
import { FaBookmark, FaRegBookmark } from 'react-icons/fa';
import { useContext } from 'react';

const QuestionCard = ({ question, user, onEdit, onDelete }) => {
  const { id, title, tags, author, answers = [] } = question;

  const isAuthor = user?.username === author;

const { isBookmarked, addBookmark, removeBookmark } = useContext(BookmarksContext);
const bookmarked = isBookmarked(question.id);

  const handleBookmarkClick = () => {
  bookmarked ? removeBookmark(question.id) : addBookmark(question.id);
};

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      onDelete(id);
    }
  };

  const renderAnswerPreview = () => {
    if (answers.length === 0) return <p style={styles.noAnswer}>No answers yet.</p>;

    const preview = answers[0].text || ''; // assuming each answer has a "text" field
    return (
      <div style={styles.answerPreview}>
        <strong>Top Answer:</strong>
        <p style={styles.answerText}>
          {preview.length > 100 ? `${preview.slice(0, 100)}...` : preview}
        </p>
      </div>
    );
  };

 return (
  <div className="question-card" style={styles.card}>
    <Link to={`/question/${id}`} style={styles.title}>
      <h3>{title}</h3>
    </Link>
    <p style={styles.meta}>
      <>
        Posted by <strong>{author}</strong>
        <small> on {new Date(question.createdAt).toLocaleDateString()}</small>
      </> | {answers.length} answer{answers.length !== 1 ? 's' : ''}
    </p>
    <div style={styles.tagContainer}>
      {tags.map((tag, idx) => (
        <span key={idx} style={styles.tag}>#{tag}</span>
      ))}
    </div>

    {renderAnswerPreview()}

    <div style={styles.actions}>
      {isAuthor && (
        <>
          <button onClick={() => onEdit(id)} style={styles.btnEdit}>Edit</button>
          <button onClick={handleDelete} style={styles.btnDelete}>Delete</button>
        </>
      )}

      <div onClick={handleBookmarkClick} style={styles.bookmark}>
        {bookmarked ? <FaBookmark className="text-yellow-500" /> : <FaRegBookmark />}
      </div>
    </div>
  </div>)};

const styles = {
  card: {
    border: '1px solid #ddd',
    padding: '1rem',
    marginBottom: '1rem',
    borderRadius: '8px',
    backgroundColor: '#fdfdfd',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
  },
  title: {
    textDecoration: 'none',
    color: '#222'
  },
  meta: {
    fontSize: '0.9rem',
    color: '#666',
    marginBottom: '0.5rem'
  },
  tagContainer: {
    marginBottom: '0.5rem',
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.5rem'
  },
  tag: {
    backgroundColor: '#e1ecf4',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '0.8rem'
  },
  answerPreview: {
    backgroundColor: '#f1f1f1',
    padding: '0.75rem',
    borderRadius: '6px',
    marginTop: '0.75rem',
    color: '#333'
  },
  answerText: {
    margin: '0.25rem 0 0 0',
    fontSize: '0.9rem'
  },
  noAnswer: {
    marginTop: '0.75rem',
    fontStyle: 'italic',
    color: '#888',
    fontSize: '0.9rem'
  },
  actions: {
    marginTop: '1rem',
    display: 'flex',
    gap: '0.5rem'
  },
  btnEdit: {
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    padding: '6px 12px',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  btnDelete: {
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    padding: '6px 12px',
    borderRadius: '4px',
    cursor: 'pointer'
  },

  bookmark: {
    cursor: 'pointer',
    marginLeft: 'auto',
    fontSize: '1.2rem',
  }

};

export default QuestionCard;