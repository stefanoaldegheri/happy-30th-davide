import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Welcome.css';

const Welcome = () => {
  const navigate = useNavigate();

  const handleBegin = () => {
    navigate('/chess');
  };

  // Navigation functions for testing
  const navigateToChess = () => {
    navigate('/chess');
  };

  const navigateToReveal = () => {
    navigate('/reveal');
  };

  const navigateToFinal = () => {
    navigate('/final');
  };

  return (
    <div className="enhanced-reveal-container">
      <div className="reveal-card">
        <h1 className="reveal-title" style={{ fontFamily: 'Pirata One, Blackletter, serif', fontSize: '2.5rem' }}>
          A Special Gift Awaits
        </h1>
        <div className="original-text">
          <p className="welcome-message">
            Congratulations on this special milestone! This interactive experience
            has been created just for you to celebrate your achievement.
          </p>
          <p className="welcome-message">
            You'll be guided through a series of puzzles that will ultimately
            reveal a personalized gift. Are you ready to begin?
          </p>
        </div>
        <button type="button" className="continue-button" onClick={handleBegin}>
          Begin the Journey
        </button>
        
        {/* Test Navigation Buttons - Only for development/testing */}
        <div className="test-navigation">
          <h3
            style={{
              marginTop: '30px',
              color: '#666',
              fontSize: '1rem',
              fontFamily: 'Georgia, serif',
            }}
          >
            Testing Navigation (Skip puzzles):
          </h3>
          <div
            style={{
              display: 'flex',
              gap: '10px',
              justifyContent: 'center',
              flexWrap: 'wrap',
              marginTop: '10px',
            }}
          >
            <button
              type="button"
              className="test-nav-button"
              onClick={navigateToChess}
              style={{
                background: '#e0d5c0',
                border: '1px solid #bca158',
                borderRadius: '4px',
                padding: '8px 12px',
                cursor: 'pointer',
                fontSize: '0.9rem',
                fontFamily: 'Georgia, serif',
                color: '#3e3224',
              }}
            >
              Chess Puzzle
            </button>
            <button
              type="button"
              className="test-nav-button"
              onClick={navigateToReveal}
              style={{
                background: '#e0d5c0',
                border: '1px solid #bca158',
                borderRadius: '4px',
                padding: '8px 12px',
                cursor: 'pointer',
                fontSize: '0.9rem',
                fontFamily: 'Georgia, serif',
                color: '#3e3224',
              }}
            >
              Reveal Secret
            </button>
            <button
              type="button"
              className="test-nav-button"
              onClick={navigateToFinal}
              style={{
                background: '#e0d5c0',
                border: '1px solid #bca158',
                borderRadius: '4px',
                padding: '8px 12px',
                cursor: 'pointer',
                fontSize: '0.9rem',
                fontFamily: 'Georgia, serif',
                color: '#3e3224',
              }}
            >
              Final Gift
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
