import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import './RevealModule.css';

const RevealModule = () => {
  const navigate = useNavigate();
  const [animationStep, setAnimationStep] = useState(0); // 0: initial, 1: letters revealed, 2: chess transition, 3: final message
  const [opacity, setOpacity] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);
  const [gridLetters, setGridLetters] = useState([]);
  const gridRef = useRef(null);
  
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
    0,   // A (row 0, col 0)
    18,  // D (row 1, col 2)
    34,  // A (row 2, col 2)
    53,  // V (row 3, col 5)
    64,  // I (row 4, col 0)
    87,  // D (row 5, col 7)
    98,  // E (row 6, col 2)
    113, // S (row 7, col 1)
    128, // T (row 8, col 0)
    137, // H (row 8, col 9)
    146, // I (row 9, col 2)
    162, // R (row 10, col 2)
    179  // T (row 11, col 3)
    // Y is at position 184 (row 11, col 8)
  ];
  
  // Extract the secret message
  const secretMessage = "DAVIDESTHIRTY";
  
  // Initialize the grid
  useEffect(() => {
    initializeGrid();
  }, []);
  
  const initializeGrid = () => {
    const gridSize = 100; // 10x10 grid
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let letters = [];
    let messageIndex = 0;
    
    // Generate positions for message letters
    let messagePositions = new Set();
    while (messagePositions.size < secretMessage.length) {
      messagePositions.add(Math.floor(Math.random() * gridSize));
    }
    messagePositions = Array.from(messagePositions);
    
    // Generate the grid
    for (let i = 0; i < gridSize; i++) {
      if (messagePositions.includes(i)) {
        letters.push({
          char: secretMessage[messageIndex],
          isSecret: true,
          index: messageIndex,
          position: i
        });
        messageIndex++;
      } else {
        letters.push({
          char: alphabet.charAt(Math.floor(Math.random() * alphabet.length)),
          isSecret: false,
          index: null,
          position: i
        });
      }
    }
    
    setGridLetters(letters);
  };
  
  const handleRevealLetters = () => {
    setAnimationStep(1);
  };
  
  const handleChessTransition = () => {
    animateLetters();
  };
  
  const animateLetters = () => {
    if (!gridRef.current) return;
    
    const highlightedLetters = gridRef.current.querySelectorAll('.highlight');
    
    // Hide non-highlighted letters
    const junkLetters = gridRef.current.querySelectorAll('.letter-grid span:not(.highlight)');
    gsap.to(junkLetters, {
      duration: 0.5,
      opacity: 0
    });
    
    // Sort letters by their message index
    const sortedLetters = Array.from(highlightedLetters).sort((a, b) => {
      return a.dataset.messageIndex - b.dataset.messageIndex;
    });
    
    // Create target positions for the message
    const targetContainer = document.createElement('div');
    targetContainer.className = 'message-container';
    targetContainer.style.display = 'flex';
    targetContainer.style.justifyContent = 'center';
    targetContainer.style.marginTop = '30px';
    targetContainer.style.fontSize = '2rem';
    targetContainer.style.fontWeight = 'bold';
    targetContainer.style.color = '#00ff99';
    targetContainer.style.textShadow = '0 0 15px #00ff99';
    targetContainer.style.height = '50px';
    targetContainer.style.position = 'relative';
    targetContainer.style.zIndex = '100';
    
    secretMessage.split('').forEach(() => {
      const placeholder = document.createElement('span');
      placeholder.innerHTML = '&nbsp;';
      placeholder.style.display = 'inline-block';
      placeholder.style.width = '30px';
      targetContainer.appendChild(placeholder);
    });
    
    // Insert target container after the grid
    gridRef.current.parentNode.insertBefore(targetContainer, gridRef.current.nextSibling);
    
    // Animate each letter
    const timeline = gsap.timeline({
      onComplete: () => {
        setTimeout(() => {
          setAnimationStep(2);
        }, 1000);
      }
    });
    
    sortedLetters.forEach((letter, index) => {
      if (targetContainer.children[index]) {
        const target = targetContainer.children[index];
        const targetRect = target.getBoundingClientRect();
        const letterRect = letter.getBoundingClientRect();
        
        // Position letter absolutely for animation
        letter.style.position = 'absolute';
        letter.style.left = `${letterRect.left}px`;
        letter.style.top = `${letterRect.top}px`;
        letter.style.zIndex = '1000';
        letter.style.margin = '0';
        
        // Animate to target position
        timeline.to(letter, {
          duration: 1.5,
          x: targetRect.left - letterRect.left,
          y: targetRect.top - letterRect.top,
          scale: 1.2,
          rotation: Math.random() * 360 - 180,
          ease: "power3.inOut",
          onComplete: () => {
            target.textContent = letter.textContent;
            letter.style.visibility = 'hidden';
          }
        }, index * 0.1);
      }
    });
  };
  
  const handleOpacityChange = (e) => {
    const newOpacity = parseInt(e.target.value);
    setOpacity(newOpacity);
    
    // Check if the secret is revealed (opacity > 70%)
    if (newOpacity > 70 && !isRevealed) {
      setIsRevealed(true);
      setAnimationStep(3);
    }
  };
  
  const handleContinue = () => {
    navigate('/final');
  };
  
  // Render the letter grid for the animation
  const renderLetterGrid = () => {
    return (
      <div className="letter-grid" ref={gridRef}>
        {gridLetters.map((letter, index) => (
          <span 
            key={index} 
            className={letter.isSecret ? 'highlight' : ''}
            data-message-index={letter.isSecret ? letter.index : null}
          >
            {letter.char}
          </span>
        ))}
      </div>
    );
  };
  
  // Convert text to grid format for the chessboard overlay
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
        
        {animationStep === 0 && (
          <div className="initial-step">
            <p className="reveal-instructions">
              Click the button to begin the reveal process.
            </p>
            <button className="action-button" onClick={handleRevealLetters}>
              Reveal Hidden Letters
            </button>
          </div>
        )}
        
        {animationStep >= 1 && animationStep < 3 && (
          <div className="animation-step">
            <div className="grid-section">
              <div className="letter-grid-container">
                {renderLetterGrid()}
              </div>
              
              {animationStep >= 2 && (
                <div className="chessboard-transition">
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
                              (rowIndex === 0 && colIndex === 11) ||  // Black Rook
                              (rowIndex === 2 && colIndex === 8) ||   // White Rook
                              (rowIndex === 3 && colIndex === 7) ||   // White Pawn
                              (rowIndex === 3 && colIndex === 10) ||  // White Pawn
                              (rowIndex === 5 && colIndex === 4) ||   // Black Queen
                              (rowIndex === 5 && colIndex === 8) ||   // Black Pawn
                              (rowIndex === 5 && colIndex === 9) ||   // Black King
                              (rowIndex === 5 && colIndex === 11) ||  // White Pawn
                              (rowIndex === 6 && colIndex === 5) ||   // Black Pawn
                              (rowIndex === 6 && colIndex === 8) ||   // White Knight
                              (rowIndex === 6 && colIndex === 11) ||  // White Pawn
                              (rowIndex === 7 && colIndex === 8) ||   // White Bishop
                              (rowIndex === 7 && colIndex === 10);    // White King
                            
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
                </div>
              )}
            </div>
            
            {animationStep === 1 && (
              <div className="transition-controls">
                <button className="action-button" onClick={handleChessTransition}>
                  Apply Chess Pattern
                </button>
              </div>
            )}
            
            {animationStep >= 2 && (
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
            )}
          </div>
        )}
        
        {animationStep >= 3 && isRevealed && (
          <div className="reveal-success">
            <p className="success-message">Secret revealed: <strong>davidesthirty</strong></p>
            <button className="continue-button" onClick={handleContinue}>
              Continue to Final Gift
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RevealModule;