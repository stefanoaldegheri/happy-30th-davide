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

  const navigateToOcr = () => {
    navigate('/ocr');
  };

  const navigateToReveal = () => {
    navigate('/reveal');
  };

  const navigateToFinal = () => {
    navigate('/final');
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
        
        {/* Test Navigation Buttons - Only for development/testing */}
        <div className="test-navigation">
          <h3 style={{ marginTop: '30px', color: '#666', fontSize: '1rem' }}>Testing Navigation (Skip puzzles):</h3>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap', marginTop: '10px' }}>
            <button 
              className="test-nav-button" 
              onClick={navigateToChess}
              style={{
                background: '#f0f0f0',
                border: '1px solid #ccc',
                borderRadius: '4px',
                padding: '8px 12px',
                cursor: 'pointer',
                fontSize: '0.9rem'
              }}
            >
              Chess Puzzle
            </button>
            <button 
              className="test-nav-button" 
              onClick={navigateToOcr}
              style={{
                background: '#f0f0f0',
                border: '1px solid #ccc',
                borderRadius: '4px',
                padding: '8px 12px',
                cursor: 'pointer',
                fontSize: '0.9rem'
              }}
            >
              OCR Challenge
            </button>
            <button 
              className="test-nav-button" 
              onClick={navigateToReveal}
              style={{
                background: '#f0f0f0',
                border: '1px solid #ccc',
                borderRadius: '4px',
                padding: '8px 12px',
                cursor: 'pointer',
                fontSize: '0.9rem'
              }}
            >
              Reveal Secret
            </button>
            <button 
              className="test-nav-button" 
              onClick={navigateToFinal}
              style={{
                background: '#f0f0f0',
                border: '1px solid #ccc',
                borderRadius: '4px',
                padding: '8px 12px',
                cursor: 'pointer',
                fontSize: '0.9rem'
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