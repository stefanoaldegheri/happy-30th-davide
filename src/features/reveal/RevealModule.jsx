import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './RevealModule.css';

const RevealModule = () => {
  const navigate = useNavigate();
  const [opacity, setOpacity] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);
  
  // The expected text from the PRD
  const textGrid = `A NEW DECADE AWAITS AHEAD BE BOLD AND READY
YOUR FUTURE IS CODE TO WRITE AND NEVER DEBUG
LIFE IS A NEW CHALLENGE NOW ACCEPT THE QUEST
SO DIVE INTO THE NEXT VERSION OF YOUR STORY
AND DEBUG EVERY SINGLE ERROR ON YOUR JOURNEY
STARTING THIS NEW CHAPTER IS HIGHLY EXCITING
ERRORS ARE JUST A GREAT START TO A NEW SCRIPT
YOU ARE THE MASTER OF YOUR WAY SO JUST ENJOY`;
  
  // The positions of the letters that spell "davidesthirty" (0-indexed)
  // Based on the chessboard layout in the PRD
  const secretPositions = [
    0,  // A (row 0, col 0)
    18, // D (row 1, col 2)
    34, // A (row 2, col 2)
    53, // V (row 3, col 5)
    64, // I (row 4, col 0)
    87, // D (row 5, col 7)
    98, // E (row 6, col 2)
    113, // S (row 7, col 1)
    128, // T (row 8, col 0)
    137, // H (row 8, col 9)
    146, // I (row 9, col 2)
    162, // R (row 10, col 2)
    179 // T (row 11, col 3)
    // Y is at position 184 (row 11, col 8)
  ];
  
  const handleOpacityChange = (e) => {
    const newOpacity = parseInt(e.target.value);
    setOpacity(newOpacity);
    
    // Check if the secret is revealed (opacity > 70%)
    if (newOpacity > 70 && !isRevealed) {
      setIsRevealed(true);
    }
  };
  
  const handleContinue = () => {
    navigate('/final');
  };
  
  // Convert text to grid format
  const renderTextGrid = () => {
    const lines = textGrid.split('\n');
    return lines.map((line, lineIndex) => (
      <div key={lineIndex} className="text-row">
        {line.split('').map((char, charIndex) => {
          const position = lineIndex * 16 + charIndex;
          const isSecretChar = secretPositions.includes(position);
          return (
            <span 
              key={charIndex} 
              className={`text-char ${isSecretChar ? 'secret-char' : ''}`}
            >
              {char}
            </span>
          );
        })}
      </div>
    ));
  };
  
  return (
    <div className="reveal-container">
      <div className="reveal-card">
        <h1 className="reveal-title">Reveal the Secret</h1>
        <p className="reveal-instructions">
          Adjust the slider to reveal the hidden message.
        </p>
        
        <div className="reveal-content">
          <div className="text-grid-container">
            <div className="text-grid">
              {renderTextGrid()}
            </div>
            
            {/* Chessboard overlay */}
            <div 
              className="chessboard-overlay"
              style={{ opacity: opacity / 100 }}
            >
              {/* 8x16 grid for the chessboard overlay */}
              {Array.from({ length: 8 }).map((_, rowIndex) => (
                <div key={rowIndex} className="overlay-row">
                  {Array.from({ length: 16 }).map((_, colIndex) => {
                    // Determine if this square should be filled (piece position)
                    // Based on the final chess position in the PRD
                    const isFilled = 
                      (rowIndex === 0 && colIndex === 0) ||  // Rook
                      (rowIndex === 2 && colIndex === 2) ||  // Rook
                      (rowIndex === 3 && colIndex === 5) ||  // Pawn
                      (rowIndex === 4 && colIndex === 0) ||  // Knight
                      (rowIndex === 5 && colIndex === 7) ||  // Pawn
                      (rowIndex === 6 && colIndex === 2) ||  // King
                      (rowIndex === 7 && colIndex === 1) ||  // Pawn
                      (rowIndex === 8 && colIndex === 0) ||  // Queen
                      (rowIndex === 8 && colIndex === 9) ||  // Pawn
                      (rowIndex === 9 && colIndex === 2) ||  // Bishop
                      (rowIndex === 10 && colIndex === 2) || // Knight
                      (rowIndex === 11 && colIndex === 3) || // Pawn
                      (rowIndex === 11 && colIndex === 8);   // Pawn
                    
                    return (
                      <div 
                        key={colIndex} 
                        className={`overlay-square ${isFilled ? 'filled' : 'empty'}`}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
          
          <div className="slider-container">
            <label htmlFor="opacity-slider">Adjust Visibility:</label>
            <input
              id="opacity-slider"
              type="range"
              min="0"
              max="100"
              value={opacity}
              onChange={handleOpacityChange}
              className="opacity-slider"
            />
            <span className="slider-value">{opacity}%</span>
          </div>
          
          {isRevealed && (
            <div className="reveal-success">
              <p className="success-message">Secret revealed: <strong>davidesthirty</strong></p>
              <button className="continue-button" onClick={handleContinue}>
                Continue to Final Gift
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RevealModule;