// src/Components/Avatar.jsx

import React from 'react';

const Avatar = ({ src, alt = 'User Avatar', size = 40 }) => {
  return (
    <img
      src={src || '/default-avatar.png'} // fallback to default image
      alt={alt}
      width={size}
      height={size}
      style={{
        borderRadius: '50%',
        objectFit: 'cover',
        border: '2px solid #ccc',
      }}
    />
  );
};

export default Avatar;
