import { FaSearch, FaStar, FaReact, FaFire, FaCode, FaArrowRight, FaTags, FaCss3,
         FaJs, FaPython, FaBrain, FaRobot, FaDatabase, FaJava } 
         from 'react-icons/fa';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase'; // Adjust path if needed

const iconMap = {
  'web development': <FaCode size={24} />,
  'reactjs': <FaReact size={24} />,
  'ai': <FaBrain size={24} />,
  'data science': <FaDatabase size={24} />,
  'machine learning': <FaBrain size={24} />,
  'css': <FaCss3 size={24} />,
  'javascript': <FaJs size={24} />,
  'ai': <FaPython size={24} />,
  'data science': <FaJava size={24} />,
  'robotics': <FaRobot size={24} />,
};

const CategoriesPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('default');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchTags = async () => {
      const tagsSet = new Set();
      const querySnapshot = await getDocs(collection(db, 'questions'));

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const tags = data.tags || [];
        tags.forEach(tag => tagsSet.add(tag.toLowerCase()));
      });

      const tagArray = Array.from(tagsSet).map((tag, index) => ({
        id: index + 1,
        name: tag.charAt(0).toUpperCase() + tag.slice(1),
        description: `Explore all questions related to ${tag}`,
        icon: iconMap[tag] || <FaTags size={24} />,
        popularity: Math.floor(Math.random() * 100), // You can replace with real stats
        isNew: true, // Optionally, mark all as new initially
      }));

      setCategories(tagArray);
    };

    fetchTags();
  }, []);

  const filteredCategories = categories
    .filter(cat => cat.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'popular') return b.popularity - a.popularity;
      if (sortBy === 'newest') return b.isNew - a.isNew;
      return 0;
    });

  return (
    <div className="categories-page">
      <div className="categories-header">
        <h1>Explore Categories</h1>
        <p className="subtitle">Browse through our knowledge collections</p>

        <div className="controls">
          <div className="search-bar">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="sort-options">
            <button className={`sort-btn ${sortBy === 'default' ? 'active' : ''}`} onClick={() => setSortBy('default')}>Default</button>
            <button className={`sort-btn ${sortBy === 'popular' ? 'active' : ''}`} onClick={() => setSortBy('popular')}><FaFire /> Popular</button>
            <button className={`sort-btn ${sortBy === 'newest' ? 'active' : ''}`} onClick={() => setSortBy('newest')}><FaStar /> Newest</button>
          </div>
        </div>
      </div>

      <div className="category-grid">
        {filteredCategories.map(category => (
          <div key={category.id} className="category-card">
            <div className="card-header">
              <div className="category-icon">{category.icon}</div>
              {category.isNew && <span className="new-badge">New</span>}
              <span className="popularity"><FaFire /> {category.popularity}%</span>
            </div>

            <div className="card-body">
              <h3>{category.name}</h3>
              <p>{category.description}</p>
            </div>

            <div className="card-footer">
              <button
                className="explore-btn"
                onClick={() => navigate(`/categories/${encodeURIComponent(category.name.toLowerCase())}`)}
              >
                Explore <FaArrowRight />
              </button>
            </div>
          </div>
        ))}
      </div>


     <style>{`
  .categories-page {
    padding: 2rem;
    background-color: #f9fafb;
    color: #1f2937;
    min-height: 100vh;
    font-family: 'Inter', sans-serif;
    max-width: 1400px;
    margin: 0 auto;
  }

  .categories-header {
    margin-bottom: 2.5rem;
    text-align: center;
  }

  .categories-header h1 {
    font-size: 2.5rem;
    margin-bottom: 0.5rem;
    background: linear-gradient(90deg, #6366f1, #8b5cf6);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    font-weight: 700;
  }

  .subtitle {
    font-size: 1.1rem;
    color: #6b7280;
    margin-bottom: 2rem;
  }

  .controls {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
    gap: 1.5rem;
    margin-bottom: 2rem;
  }

  .search-bar {
    flex: 1;
    min-width: 250px;
    position: relative;
    display: flex;
    align-items: center;
  }

  .search-bar input {
    width: 100%;
    padding: 0.8rem 1rem 0.8rem 2.5rem;
    background: #ffffff;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    color: #111827;
    font-size: 1rem;
    transition: all 0.3s ease;
  }

  .search-bar input:focus {
    outline: none;
    border-color: #6366f1;
    box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.3);
  }

  .search-icon {
    position: absolute;
    left: 1rem;
    color: #9ca3af;
  }

  .sort-options {
    display: flex;
    gap: 0.75rem;
    flex-wrap: wrap;
  }

  .sort-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.6rem 1.2rem;
    background: #ffffff;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    color: #1f2937;
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 0.95rem;
  }

  .sort-btn:hover {
    background: #f3f4f6;
  }

  .sort-btn.active {
    background: #6366f1;
    border-color: #6366f1;
    color: white;
  }

  .category-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1.75rem;
  }

  .category-card {
    background: #ffffff;
    border-radius: 12px;
    padding: 1.5rem;
    transition: all 0.3s ease;
    border: 1px solid #e5e7eb;
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .category-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.05);
    border-color: #6366f1;
  }

  .category-card.selected {
    border-color: #6366f1;
    background: rgba(99, 102, 241, 0.1);
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 1.25rem;
  }

  .category-icon {
    background: rgba(99, 102, 241, 0.15);
    width: 48px;
    height: 48px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .new-badge {
    background: #10b981;
    color: white;
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    font-size: 0.75rem;
    font-weight: 600;
  }

  .popularity {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    font-size: 0.85rem;
    color: #d97706;
  }

  .card-body {
    flex: 1;
    margin-bottom: 1.5rem;
  }

  .card-body h3 {
    font-size: 1.3rem;
    margin-bottom: 0.75rem;
    color: #111827;
    font-weight: 600;
  }

  .card-body p {
    font-size: 0.95rem;
    color: #6b7280;
    line-height: 1.5;
  }

  .card-footer {
    display: flex;
    justify-content: flex-end;
  }

  .explore-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.6rem 1rem;
    background: transparent;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    color: #1f2937;
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 0.9rem;
  }

  .explore-btn:hover {
    background: #6366f1;
    border-color: #6366f1;
    color: white;
  }

  @media (max-width: 768px) {
    .categories-header h1 {
      font-size: 2rem;
    }

    .controls {
      flex-direction: column;
    }

    .search-bar {
      width: 100%;
    }
  }
`}</style>
    </div>
  );
};

export default CategoriesPage;