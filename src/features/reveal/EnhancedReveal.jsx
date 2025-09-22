import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import './EnhancedReveal.css';

// Chess position data from the provided JSON
export const chessPosition = {
  "a1": { "empty": true, "piece": null },
  "b1": { "empty": true, "piece": null },
  "c1": { "empty": true, "piece": null },
  "d1": { "empty": true, "piece": null },
  "e1": { "empty": true, "piece": null },
  "f1": { "empty": true, "piece": null },
  "g1": { "empty": false, "piece": "white king" },
  "h1": { "empty": true, "piece": null },
  "a2": { "empty": true, "piece": null },
  "b2": { "empty": false, "piece": "black pawn" },
  "c2": { "empty": true, "piece": null },
  "d2": { "empty": true, "piece": null },
  "e2": { "empty": true, "piece": null },
  "f2": { "empty": true, "piece": null },
  "g2": { "empty": true, "piece": null },
  "h2": { "empty": false, "piece": "white pawn" },
  "a3": { "empty": false, "piece": "black queen" },
  "b3": { "empty": true, "piece": null },
  "c3": { "empty": true, "piece": null },
  "d3": { "empty": true, "piece": null },
  "e3": { "empty": false, "piece": "black pawn" },
  "f3": { "empty": true, "piece": null },
  "g3": { "empty": false, "piece": "white bishop" },
  "h3": { "empty": false, "piece": "white pawn" },
  "a4": { "empty": true, "piece": null },
  "b4": { "empty": true, "piece": null },
  "c4": { "empty": true, "piece": null },
  "d4": { "empty": false, "piece": "white knight" },
  "e4": { "empty": true, "piece": null },
  "f4": { "empty": false, "piece": "black king" },
  "g4": { "empty": true, "piece": null },
  "h4": { "empty": true, "piece": null },
  "a5": { "empty": true, "piece": null },
  "b5": { "empty": true, "piece": null },
  "c5": { "empty": true, "piece": null },
  "d5": { "empty": false, "piece": "white pawn" },
  "e5": { "empty": true, "piece": null },
  "f5": { "empty": true, "piece": null },
  "g5": { "empty": false, "piece": "white pawn" },
  "h5": { "empty": true, "piece": null },
  "a6": { "empty": true, "piece": null },
  "b6": { "empty": true, "piece": null },
  "c6": { "empty": true, "piece": null },
  "d6": { "empty": true, "piece": null },
  "e6": { "empty": false, "piece": "white rook" },
  "f6": { "empty": true, "piece": null },
  "g6": { "empty": true, "piece": null },
  "h6": { "empty": true, "piece": null },
  "a7": { "empty": true, "piece": null },
  "b7": { "empty": true, "piece": null },
  "c7": { "empty": true, "piece": null },
  "d7": { "empty": true, "piece": null },
  "e7": { "empty": true, "piece": null },
  "f7": { "empty": true, "piece": null },
  "g7": { "empty": true, "piece": null },
  "h7": { "empty": true, "piece": null },
  "a8": { "empty": true, "piece": null },
  "b8": { "empty": true, "piece": null },
  "c8": { "empty": true, "piece": null },
  "d8": { "empty": true, "piece": null },
  "e8": { "empty": true, "piece": null },
  "f8": { "empty": true, "piece": null },
  "g8": { "empty": true, "piece": null },
  "h8": { "empty": false, "piece": "black rook" }
};

// Helper function to convert chess notation to grid coordinates
export const chessNotationToCoords = (notation) => {
  const file = notation.charAt(0); // a-h
  const rank = parseInt(notation.charAt(1)); // 1-8
  
  // Convert file to column index (a=0, b=1, ..., h=7)
  const col = file.charCodeAt(0) - 'a'.charCodeAt(0);
  
  // Convert rank to row index (1=7, 2=6, ..., 8=0)
  const row = 8 - rank;
  
  return { row, col };
};

const EnhancedReveal = () => {
  const navigate = useNavigate();
  const gridRef = useRef(null);
  const chessBoardRef = useRef(null);
  const [step, setStep] = useState(0); // 0: initial, 1: original text, 2: transition to cleaned text, 3: apply padding, 4: chess overlay, 5: revealed message
  const [opacity, setOpacity] = useState(100);
  const [revealedMessage, setRevealedMessage] = useState('');
  const [ocrResult, setOcrResult] = useState('');
  
  // Static configuration for padding values
  const paddingConfig = [0, 1, 2, 3, 4, 3, 2, 1];
  
  // Chess filter column parameter
  const chessFilterColumn = 6;
  
  // Hardcoded message from OCR (as requested)
  const originalText = `A NEW DECADE AWAITS AHEAD BE BOLD AND READY
YOUR FUTURE IS CODE TO WRITE AND NEVER DEBUG
LIFE IS A NEW CHALLENGE NOW ACCEPT THE QUEST
SO DIVE INTO THE NEXT VERSION OF YOUR STORY
AND DEBUG EVERY SINGLE ERROR ON YOUR JOURNEY
STARTING THIS NEW CHAPTER IS HIGHLY EXCITING
ERRORS ARE JUST A GREAT START TO A NEW SCRIPT
YOU ARE THE MASTER OF YOUR WAY SO JUST ENJOY`;
  
  // Effect to get OCR result from sessionStorage
  useEffect(() => {
    const storedResult = sessionStorage.getItem('ocrResult');
    if (storedResult) {
      setOcrResult(storedResult);
    } else {
      setOcrResult(originalText);
    }
    
    // Start the animation sequence
    const timer = setTimeout(() => {
      setStep(1);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Effect to handle step transitions
  useEffect(() => {
    if (step === 1) {
      const timer = setTimeout(() => {
        animateToCleanedText();
        setTimeout(() => {
          setStep(2); // Transition to cleaned text
        }, 3000); // Wait 3 seconds for animation to complete (2s animation + 1s buffer)
      }, 10000); // 10 seconds for transition
      
      return () => clearTimeout(timer);
    } else if (step === 2) {
      const timer = setTimeout(() => {
        animateToPaddedText();
        setTimeout(() => {
          setStep(3); // Apply padding
        }, 3000); // Wait 3 seconds for animation to complete (2s animation + 1s buffer)
      }, 10000); // 10 seconds for second step
      
      return () => clearTimeout(timer);
    } else if (step === 3) {
      const timer = setTimeout(() => {
        // Animate chess board dissolve effect
        if (chessBoardRef.current) {
          const squares = chessBoardRef.current.querySelectorAll('.chess-square');
          squares.forEach((square, index) => {
            // Only animate squares in the filter area (columns 6-13, rows 0-7)
            const rowIndex = Math.floor(index / 8);
            const colIndex = index % 8;
            
            if (rowIndex >= 0 && rowIndex <= 7 && colIndex >= 0 && colIndex <= 7) {
              gsap.fromTo(square, 
                { opacity: 0 },
                { 
                  opacity: 1,
                  duration: 1,
                  delay: (rowIndex * 0.1) + (colIndex * 0.05),
                  ease: "power2.out"
                }
              );
            }
          });
        }
        setStep(4); // Show chess overlay
      }, 1000); // Small delay to ensure DOM is ready
      
      return () => clearTimeout(timer);
    }
  }, [step]);
  
  // Animate transition from original text to cleaned text
  const animateToCleanedText = () => {
    if (gridRef.current) {
      const chars = gridRef.current.querySelectorAll('.grid-char');
      chars.forEach(char => {
        const originalRow = parseInt(char.dataset.originalRow);
        const originalCol = parseInt(char.dataset.originalCol);
        const targetRow = parseInt(char.dataset.targetRow);
        const targetCol = parseInt(char.dataset.targetCol);
        
        // Only animate characters that have valid original positions
        if (!isNaN(originalRow) && !isNaN(originalCol)) {
          // Calculate original position
          const originalLeft = originalCol * 20; // 16px width + 4px margin
          const originalTop = originalRow * 34; // 30px height + 4px margin
          
          // Calculate target position
          const targetLeft = targetCol * 20;
          const targetTop = targetRow * 34;
          
          // Set initial position
          gsap.set(char, {
            x: 0,
            y: 0
          });
          
          // Animate from original position to target position
          gsap.to(char, {
            x: (targetLeft - originalLeft),
            y: (targetTop - originalTop),
            duration: 2, // 2 seconds for faster movement
            ease: "power2.out",
            delay: (originalRow * 0.05) + (originalCol * 0.01) // Staggered animation
          });
        }
      });
    }
  };
  
  // Animate transition from cleaned text to padded text
  const animateToPaddedText = () => {
    if (gridRef.current) {
      const chars = gridRef.current.querySelectorAll('.grid-char');
      chars.forEach(char => {
        const originalRow = parseInt(char.dataset.originalRow);
        const originalCol = parseInt(char.dataset.originalCol);
        const targetRow = parseInt(char.dataset.targetRow);
        const targetCol = parseInt(char.dataset.targetCol);
        
        // Only animate characters that have valid original positions
        if (!isNaN(originalRow) && !isNaN(originalCol)) {
          // Calculate original position (in cleaned grid)
          const originalLeft = originalCol * 20;
          const originalTop = originalRow * 34;
          
          // Calculate target position (with padding)
          const padding = paddingConfig[targetRow] || 0;
          const targetLeft = (targetCol + padding) * 20;
          const targetTop = targetRow * 34;
          
          // Set initial position
          gsap.set(char, {
            x: 0,
            y: 0
          });
          
          // Animate from original position to target position
          gsap.to(char, {
            x: (targetLeft - originalLeft),
            y: (targetTop - originalTop),
            duration: 2, // 2 seconds for faster movement
            ease: "power2.out",
            delay: (originalRow * 0.05) + (originalCol * 0.01) // Staggered animation
          });
        }
      });
    }
  };
  
  // Convert text to original grid format (preserving all characters and positions)
  const textToOriginalGrid = (text) => {
    // Split text into lines
    const lines = text.split('\n');
    
    // Create grid with actual line content
    const grid = [];
    for (let row = 0; row < lines.length; row++) {
      const line = lines[row];
      const gridRow = [];
      for (let col = 0; col < line.length; col++) {
        gridRow.push(line[col]);
      }
      grid.push(gridRow);
    }
    
    return grid;
  };
  
  // Convert text to cleaned grid format (removing spaces and punctuation)
  const textToCleanedGrid = (text) => {
    // Split text into lines
    const lines = text.split('\n');
    
    // Create grid with cleaned content
    const grid = [];
    for (let row = 0; row < lines.length; row++) {
      const line = lines[row];
      // Remove spaces and punctuation, keep only A-Z and 0-9
      const cleanLine = line.replace(/[^A-Z0-9]/g, '');
      const gridRow = [];
      for (let col = 0; col < cleanLine.length; col++) {
        gridRow.push(cleanLine[col]);
      }
      grid.push(gridRow);
    }
    
    return grid;
  };
  
  // Convert text to padded grid format (applying padding to cleaned text)
  const textToPaddedGrid = (text) => {
    // Split text into lines
    const lines = text.split('\n');
    
    // Create grid with cleaned and padded content
    const grid = [];
    for (let row = 0; row < Math.min(lines.length, 8); row++) {
      const line = lines[row];
      // Remove spaces and punctuation, keep only A-Z and 0-9
      const cleanLine = line.replace(/[^A-Z0-9]/g, '');
      
      // Apply padding
      const padding = paddingConfig[row] || 0;
      const paddedLine = ' '.repeat(padding) + cleanLine;
      
      const gridRow = [];
      for (let col = 0; col < paddedLine.length; col++) {
        gridRow.push(paddedLine[col]);
      }
      grid.push(gridRow);
    }
    
    return grid;
  };
  
  // Get character mapping from original positions to cleaned positions
  const getCharacterMapping = (originalText) => {
    const lines = originalText.split('\n');
    const mapping = [];
    
    for (let row = 0; row < lines.length; row++) {
      const line = lines[row];
      let cleanCol = 0;
      
      for (let col = 0; col < line.length; col++) {
        const char = line[col];
        // Check if character is alphanumeric
        if (/[A-Z0-9]/.test(char)) {
          mapping.push({
            originalRow: row,
            originalCol: col,
            targetRow: row,
            targetCol: cleanCol
          });
          cleanCol++;
        }
      }
    }
    
    return mapping;
  };
  
  // Get character mapping from cleaned positions to padded positions
  const getPaddingMapping = (originalText) => {
    const lines = originalText.split('\n');
    const mapping = [];
    
    for (let row = 0; row < Math.min(lines.length, 8); row++) {
      const line = lines[row];
      // Remove spaces and punctuation, keep only A-Z and 0-9
      const cleanLine = line.replace(/[^A-Z0-9]/g, '');
      
      // Apply padding
      const padding = paddingConfig[row] || 0;
      
      for (let col = 0; col < cleanLine.length; col++) {
        mapping.push({
          originalRow: row,
          originalCol: col,
          targetRow: row,
          targetCol: col + padding
        });
      }
    }
    
    return mapping;
  };
  
  // Get the secret message by checking piece positions
  const getSecretMessage = (grid) => {
    let message = '';
    
    // Iterate through chess positions to find pieces and extract letters
    for (const [notation, info] of Object.entries(chessPosition)) {
      if (!info.empty && info.piece) {
        const { row, col } = chessNotationToCoords(notation);
        if (row < grid.length && col < grid[row].length) {
          message += grid[row][col];
        }
      }
    }
    
    return message;
  };
  
  // Handle slider change for chess overlay opacity
  const handleOpacityChange = (e) => {
    const newOpacity = parseInt(e.target.value);
    setOpacity(newOpacity);
    
    // When opacity is low enough, reveal the secret message
    if (newOpacity < 30) {
      const grid = textToPaddedGrid(ocrResult || originalText);
      const secret = getSecretMessage(grid);
      setRevealedMessage(secret.toLowerCase());
    }
  };
  
  // Render the original text in grid format
  const renderOriginalTextGrid = () => {
    const grid = textToOriginalGrid(ocrResult || originalText);
    const charMapping = getCharacterMapping(ocrResult || originalText);
    
    // Calculate grid dimensions
    const maxCols = Math.max(...grid.map(row => row.length), 1);
    const gridHeight = Math.max(grid.length, 1) * 34;
    
    return (
      <div className="text-grid" ref={gridRef} style={{ position: 'relative', height: `${gridHeight}px`, textAlign: 'left', margin: '0 auto 0 0' }}>
        {grid.map((row, rowIndex) => (
          <div key={rowIndex} className="grid-row" style={{ position: 'absolute', top: `${rowIndex * 34}px`, left: 0 }}>
            {row.map((char, colIndex) => {
              // Find target position for this character
              let targetRow = rowIndex;
              let targetCol = colIndex;
              
              // Look up the mapping for this character
              const mapping = charMapping.find(m => 
                m.originalRow === rowIndex && m.originalCol === colIndex
              );
              
              if (mapping) {
                targetRow = mapping.targetRow;
                targetCol = mapping.targetCol;
              }
              
              return (
                <span 
                  key={`${rowIndex}-${colIndex}`} 
                  className="grid-char"
                  data-original-row={rowIndex}
                  data-original-col={colIndex}
                  data-target-row={targetRow}
                  data-target-col={targetCol}
                  style={{ 
                    position: 'absolute',
                    left: `${colIndex * 20}px`,
                    top: 0,
                    opacity: /[A-Z0-9]/.test(char) ? 1 : 0.3 // Dim non-alphanumeric characters
                  }}
                >
                  {char}
                </span>
              );
            })}
          </div>
        ))}
      </div>
    );
  };
  
  // Render the cleaned text grid
  const renderCleanedTextGrid = () => {
    const grid = textToCleanedGrid(ocrResult || originalText);
    const paddingMapping = getPaddingMapping(ocrResult || originalText);
    
    // Calculate grid dimensions
    const maxCols = Math.max(...grid.map(row => row.length), 1);
    const gridHeight = Math.max(grid.length, 1) * 34;
    
    return (
      <div className="text-grid" ref={gridRef} style={{ position: 'relative', height: `${gridHeight}px`, textAlign: 'left', margin: '0 auto 0 0' }}>
        {grid.map((row, rowIndex) => (
          <div key={rowIndex} className="grid-row" style={{ position: 'absolute', top: `${rowIndex * 34}px`, left: 0 }}>
            {row.map((char, colIndex) => {
              // Find target position for this character with padding
              let targetRow = rowIndex;
              let targetCol = colIndex;
              
              // Look up the mapping for this character
              const mapping = paddingMapping.find(m => 
                m.originalRow === rowIndex && m.originalCol === colIndex
              );
              
              if (mapping) {
                targetRow = mapping.targetRow;
                targetCol = mapping.targetCol;
              }
              
              return (
                <span 
                  key={`${rowIndex}-${colIndex}`} 
                  className="grid-char"
                  data-original-row={rowIndex}
                  data-original-col={colIndex}
                  data-target-row={targetRow}
                  data-target-col={targetCol}
                  style={{ 
                    position: 'absolute',
                    left: `${colIndex * 20}px`,
                    top: 0
                  }}
                >
                  {char}
                </span>
              );
            })}
          </div>
        ))}
      </div>
    );
  };
  
  // Render the text grid with padding (step 2)
  const renderPaddedTextGrid = () => {
    const grid = textToPaddedGrid(ocrResult || originalText);
    
    return (
      <div className="text-grid" ref={gridRef} style={{ position: 'relative', height: '272px', width: 'fit-content' }}>
        {grid.map((row, rowIndex) => (
          <div key={rowIndex} className="grid-row" style={{ position: 'absolute', top: `${rowIndex * 34}px`, left: 0, paddingLeft: `${paddingConfig[rowIndex] * 34}px` }}>
            {row.map((char, colIndex) => {
              // Calculate original position without padding
              const originalCol = colIndex - paddingConfig[rowIndex];
              
              return (
                <span 
                  key={`${rowIndex}-${colIndex}`} 
                  className="grid-char"
                  data-original-row={rowIndex}
                  data-original-col={originalCol}
                  data-target-row={rowIndex}
                  data-target-col={colIndex}
                  style={{ 
                    position: 'absolute',
                    left: `${colIndex * 34}px`,
                    top: 0
                  }}
                >
                  {char}
                </span>
              );
            })}
          </div>
        ))}
      </div>
    );
  };
  
  // Render the chess overlay
  const renderChessOverlay = () => {
    // Start from column 6 (0-indexed, so it's actually column 6 in 0-15 range)
    const startColumn = 6;
    
    return (
      <div style={{ 
        position: 'relative',
        width: '100%',
        height: '100%'
      }}>
        {Array.from({ length: 8 }).map((_, rowIndex) => (
          <div key={rowIndex} style={{ 
            display: 'flex',
            position: 'absolute',
            top: `${rowIndex * 38}px`, // 34px height + 4px margin
            left: `${startColumn * 38}px` // Start from column 6
          }}>
            {Array.from({ length: 8 }).map((_, colIndex) => {
              // Calculate the actual column (6-13)
              const actualCol = colIndex + startColumn;
              const notation = String.fromCharCode(97 + actualCol) + (8 - rowIndex);
              const position = chessPosition[notation];
              const hasPiece = position && !position.empty && position.piece;
              
              return (
                <div
                  key={colIndex}
                  className={`chess-square ${(rowIndex + colIndex) % 2 === 0 ? 'light' : 'dark'} ${hasPiece ? 'has-piece' : ''}`}
                  style={{ 
                    width: '34px',
                    height: '34px',
                    margin: '2px',
                    opacity: opacity / 100, // Direct opacity control
                    transition: 'opacity 0.3s ease', // Faster transition for better responsiveness
                    backgroundColor: hasPiece 
                      ? 'rgba(100, 100, 100, 0.9)' 
                      : (rowIndex + colIndex) % 2 === 0 
                        ? 'rgba(240, 240, 240, 0.8)' 
                        : 'rgba(200, 200, 200, 0.8)',
                    position: 'relative'
                  }}
                >
                  {hasPiece && (
                    <span style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      fontSize: '20px',
                      fontWeight: 'bold',
                      color: 'white',
                      textShadow: '1px 1px 1px rgba(0,0,0,0.5)'
                    }}>
                      {position.piece.includes('king') ? '♔' : 
                       position.piece.includes('queen') ? '♕' : 
                       position.piece.includes('rook') ? '♖' : 
                       position.piece.includes('bishop') ? '♗' : 
                       position.piece.includes('knight') ? '♘' : 
                       position.piece.includes('pawn') ? '♙' : ' '}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    );
  };
  
  return (
    <div className="enhanced-reveal-container">
      <div className="reveal-card">
        <h1 className="reveal-title">Revealing the Secret</h1>
        
        {step === 0 && (
          <div className="step-initial">
            <p>Preparing to reveal the secret...</p>
          </div>
        )}
        
        {step === 1 && (
          <div className={`step-original-text ${step === 1 ? 'active' : ''}`}>
            <h2>Recognized Text</h2>
            {renderOriginalTextGrid()}
          </div>
        )}
        
        {step === 2 && (
          <div className={`step-cleaned-text ${step === 2 ? 'active' : ''}`}>
            <h2>Removing Spaces and Punctuation</h2>
            {renderCleanedTextGrid()}
          </div>
        )}
        
        {step === 3 && (
          <div className={`step-padded-text ${step === 3 ? 'active' : ''}`}>
            <h2>Applying Padding</h2>
            {renderPaddedTextGrid()}
          </div>
        )}
        
                {step >= 4 && (
          <div className={`step-chess-overlay ${step >= 4 ? 'active' : ''}`}>
            <h2>Chess Filter Overlay</h2>
            <div style={{ 
              position: 'relative', 
              width: 'fit-content',
              margin: '20px 0', // Changed from '20px auto' to prevent centering
              background: 'rgba(0, 0, 0, 0.3)',
              borderRadius: '8px',
              padding: '20px',
              textAlign: 'left' // Ensure left alignment
            }}>
              {/* Render the text grid first */}
              <div style={{ 
                position: 'relative', 
                width: 'fit-content',
                height: '272px'
              }}>
                {renderPaddedTextGrid()}
              </div>
              
              {/* Render the chess overlay on top */}
              <div className={`chess-overlay-container ${step >= 4 ? 'fade-in' : ''}`} style={{ 
                position: 'absolute',
                top: '20px',
                left: '20px',
                width: 'calc(100% - 40px)',
                height: 'calc(100% - 40px)',
                pointerEvents: 'none'
              }}>
                {renderChessOverlay()}
              </div>
            </div>
            
            <div className="slider-container">
              <label htmlFor="opacity-slider">Adjust Filter Opacity:</label>
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
            
            <div className={`revealed-message ${revealedMessage ? 'show' : ''}`}>
              {revealedMessage && (
                <>
                  <p>Secret revealed: <strong>{revealedMessage}</strong></p>
                  <button className="continue-button" onClick={() => navigate('/final')}>
                    Continue to Final Gift
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedReveal;