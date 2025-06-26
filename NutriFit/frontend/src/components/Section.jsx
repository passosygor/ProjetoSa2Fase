
import React from 'react';
import './Section.css';
import { useNavigate } from 'react-router-dom';

const Section = ({ title, description, buttonText, imageSrc, url }) => {
  const handleClick = () => {
    navigate(url)
   
  };

  
  const navigate = useNavigate();

  return (
    <div className="section-container">
      <div className="section-image">
        <img src={imageSrc} alt={title} />
      </div>
      <div className="section-content">
        <h2>{title}</h2>
        <p>{description}</p>
        <button onClick={handleClick} className="section-button">
          {buttonText}
        </button>
      </div>
    </div>
  );
};

export default Section;