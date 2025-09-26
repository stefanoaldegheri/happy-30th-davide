import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Welcome.css';

const Welcome = () => {
  const navigate = useNavigate();

  const handleBegin = () => {
    navigate('/chess');
  };

  return (
    <div className="enhanced-reveal-container">
      <div className="reveal-card">
        <h1 className="reveal-title" style={{ fontFamily: 'Pirata One, Blackletter, serif', fontSize: '2.5rem' }}>
          Happy Birthday!!!
        </h1>
        <div className="original-text">
          <p className="welcome-message">
            <strong>
              Hear me, Davide! A man's life is a grand adventure, and at 30,
              your greatest voyage is about to begin!
              {'\n'}
              {'\n'}
              Wealth? Fame? A grand prize? I've left it all in one place!
              If you want my treasure, you can have it! But you'll have to seek it out!
              {'\n'}
              {'\n'}
              Overcome the trials that lie ahead, let your will be your compass,
              and the greatest prize of all will be yours!
            </strong>
          </p>
        </div>
        <button type="button" className="continue-button" onClick={handleBegin}>
          Start
        </button>
      </div>
    </div>
  );
};

export default Welcome;
