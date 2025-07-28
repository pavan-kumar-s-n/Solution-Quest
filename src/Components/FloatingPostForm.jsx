// src/components/FloatingPostForm.jsx
import React from 'react';

const FloatingPostForm = ({ title, setTitle, tags, setTags, onSubmit, onClose }) => {
  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h2>Ask a Question</h2>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            size={500}
            placeholder="Enter question question"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={styles.input}
          />
          <input
            type="text"
            placeholder="Enter tags (comma separated)"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            style={styles.input}
          />
          <div style={styles.actions}>
            <button type="submit" style={styles.btnPost}>Post</button>
            <button type="button" onClick={onClose} style={styles.btnClose}>Cancel</button>
          </div>
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
  },
  actions: { display: 'flex', justifyContent: 'space-between' },
  btnPost: { backgroundColor: '#28a745', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer' },
  btnClose: { backgroundColor: '#ccc', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer' }
};

export default FloatingPostForm;
