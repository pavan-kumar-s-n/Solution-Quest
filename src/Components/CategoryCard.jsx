import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getCategoryImage } from '../utils/categoryImages';
import '../styles/CategoryCard.css';


const CategoryCard = ({ name, description }) => {
  const navigate = useNavigate();
  const image = getCategoryImage(name);
 
  const handleClick = () => {
    navigate(`/categories/${encodeURIComponent(name.toLowerCase())}`);
  };

  return (
    <div className="category-card" onClick={handleClick}>
      <img src={image} alt={name} className="category-image" />
      <div className="category-info">
        <h3>{name}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
};

export default CategoryCard;
