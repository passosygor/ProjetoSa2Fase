import React from 'react';
import './Section.css';

const Section = ({ title, description, buttonText, imageSrc, onNavigate }) => {
  const handleClick = () => {
    if (onNavigate) {
      onNavigate();
    }
  };

  return (
    <div className="section-container">
      <div className="section-text">
        <h2>{title}</h2>
        <p>{description}</p>
        <button onClick={handleClick} className="section-button">
          {buttonText}
        </button>
      </div>
      <div className="section-image">
        <img src={imageSrc} alt={title} />
      </div>
    </div>
  );
};

export default Section;