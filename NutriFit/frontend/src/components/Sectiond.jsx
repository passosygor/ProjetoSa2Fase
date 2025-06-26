// src/components/Section.jsx
import React from 'react';
import './Sectiond.css';
import { useNavigate } from 'react-router-dom';

const Sectiond = ({ title, description, buttonText, imageSrc, url }) => {
  const handleClick = () => {
    navigate(url)
  };


  const navigate = useNavigate();

  return (
    <div className="sectiond-container">
      <div className="sectiond-content">
        <h2>{title}</h2>
        <p>{description}</p>
        <button onClick={handleClick} className="sectiond-button">
          {buttonText}
        </button>
      </div>
      <div className="sectiond-image">
        <img src={imageSrc} alt={title} />
      </div>
    </div>
  );
};

export default Sectiond;