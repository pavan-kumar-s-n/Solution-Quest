import { useParams, useNavigate } from 'react-router-dom';
import { useContext, useState, useEffect } from 'react';
import { QuestionContext } from '../context/QuestionContext';

const EditQuestion = () => {
  const { id } = useParams(); // Get question ID from URL
  const navigate = useNavigate();
  const { questions, editQuestion } = useContext(QuestionContext);

  const [title, setTitle] = useState('');
  const [tags, setTags] = useState('');
  const [loading, setLoading] = useState(true);

  // Find the question to edit
  useEffect(() => {
    const questionToEdit = questions.find(q => q.id === id);
    if (questionToEdit) {
      setTitle(questionToEdit.title);
      setTags(questionToEdit.tags ? questionToEdit.tags.join(', ') : '');
    }
    setLoading(false);
  }, [questions, id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedTags = tags
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag !== '');
    
    await editQuestion(id, { title, tags: trimmedTags });
    navigate(`/question/${id}`); // Redirect to detail page
  };

  if (loading) return <p style={{ textAlign: 'center' }}>Loading question...</p>;

  const questionExists = questions.some(q => q.id === id);
  if (!questionExists) return <p style={{ textAlign: 'center', color: 'red' }}>Question not found.</p>;

  return (
       <div style={styles.overlay}>
      <div style={styles.modal}>
      <h2 style={{ textAlign: 'center', marginBottom: '1rem' }}><b>Edit Question</b></h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
        <label style={{ marginBottom: '0.5rem' }}>Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          style={styles.input}
        />

        <label style={{ marginBottom: '0.5rem' }}>Tags (comma separated)</label>
        <input
          type="text"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="e.g. react, firebase, auth"
          style={styles.input}
        />

        <button
          type="submit"
          style={{
            backgroundColor: '#4CAF50',
            color: 'white',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '5px',
            fontSize: '1rem',
            cursor: 'pointer'
          }}
        >
          Save Changes
        </button>
      </form>
    </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex',
    justifyContent: 'center', alignItems: 'center', zIndex: 999
  },
  modal: {
    backgroundColor: '#fff', padding: '2rem', borderRadius: '12px',
    width: '400px', boxShadow: '0 0 10px rgba(0,0,0,0.2)', width: '50%',
    marginLeft: '220px'
  },
  input: {
    width: '100%', padding: '10px', marginBottom: '1rem', borderRadius: '6px',
    border: '1px solid #ccc'
  }
};

export default EditQuestion;
