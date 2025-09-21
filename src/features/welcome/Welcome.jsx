import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Welcome.css';

const Welcome = () => {
  const navigate = useNavigate();

  const handleBegin = () => {
    navigate('/chess');
  };

  return (
    <div className="welcome-container">
      <div className="welcome-card">
        <h1 className="welcome-title">A Special Gift Awaits</h1>
        <p className="welcome-message">
          Congratulations on this special milestone! This interactive experience 
          has been created just for you to celebrate your achievement.
        </p>
        <p className="welcome-message">
          You'll be guided through a series of puzzles that will ultimately 
          reveal a personalized gift. Are you ready to begin?
        </p>
        <button className="begin-button" onClick={handleBegin}>
          Begin the Journey
        </button>
      </div>
    </div>
  );
};

export default Welcome;