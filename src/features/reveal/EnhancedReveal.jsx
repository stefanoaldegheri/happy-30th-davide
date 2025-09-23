import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import ShipWheel from './ShipWheel';
import TreasureBoxBorder from './TreasureBoxBorder';
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
  const [opacity, setOpacity] = useState(100); // Start with 100% opacity
  const [revealedMessage, setRevealedMessage] = useState('');
  const [ocrResult, setOcrResult] = useState('');
  const [treasureOpened, setTreasureOpened] = useState(false);
  const [currentPoneglyph, setCurrentPoneglyph] = useState(null);
  const [chessBoardPosition, setChessBoardPosition] = useState({ left: 10, top: 60 }); // Default position
  
  // Static configuration for padding values
  const paddingConfig = [0, 4, 7, 11, 10, 9, 6, 10];
  
  // Chess filter column parameter (0-indexed)
  const chessFilterColumn = 10;
  
  // Hardcoded message from OCR (as requested)
  const originalText = `DAVIDE, YOUR NEW ERA DAWNS.
BUILD VALUE, CUT THE WASTE.
ALWAYS AIM FOR THE TOP.
A VIVID FUTURE AWAITS.
INDEED, YOUR PATH IS SET.
SEE, IT'S HIGH TIME FOR YOUR DREAMS.
YOU ARE MEANT FOR THE GREATEST JOURNEY.
I HOPE YOUR 30S ARE LEGENDARY!`;
  
  // Effect to get OCR result from sessionStorage
  useEffect(() => {
    const storedResult = sessionStorage.getItem('ocrResult');
    if (storedResult) {
      setOcrResult(storedResult);
    }
    
    // Start the animation sequence
    const timer = setTimeout(() => {
      setStep(1);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Effect to handle step transitions (manual only)
  useEffect(() => {
    // All transitions are now manual, so we don't need automatic transitions
    // We'll keep this useEffect to handle any side effects when step changes
    
    if (step === 4) {
      // When we reach the chess overlay step, we might want to do some initialization
      // but we don't want to automatically animate the chess board
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
          const originalLeft = originalCol * 30; // 30px width to match CSS
          const originalTop = originalRow * 30; // 30px height to match CSS
          
          // Calculate target position
          const targetLeft = targetCol * 30;
          const targetTop = targetRow * 30;
          
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
          const originalLeft = originalCol * 30; // 30px width to match CSS
          const originalTop = originalRow * 30; // 30px height to match CSS
          
          // Calculate target position (with padding)
          const padding = paddingConfig[targetRow] || 0;
          const targetLeft = (targetCol + padding) * 30;
          const targetTop = targetRow * 30;
          
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
    
    // Define the order of pieces to extract the secret message
    // This should match the order in which the pieces spell "davidesthirty"
    // Based on the key piece verification in final_verification.js
    const pieceOrder = [
      'h8', // R (black rook)
      'e6', // R (white rook)
      'g1', // K (white king)
      'd5', // P (white pawn)
      'a3', // Q (black queen)
      'b2', // P (black pawn)
      'e3', // P (black pawn)
      'd4', // N (white knight)
      'f4', // K (black king)
      'h3', // P (white pawn)
      'g3', // B (white bishop)
      'h2', // P (white pawn)
      'g5'  // P (white pawn)
    ];
    
    // Iterate through chess positions in the defined order to extract letters
    for (const notation of pieceOrder) {
      const position = chessPosition[notation];
      if (position && !position.empty && position.piece) {
        const { row, col } = chessNotationToCoords(notation);
        // Adjust column based on chessFilterColumn parameter
        const adjustedCol = col + chessFilterColumn;
        if (row < grid.length && adjustedCol < grid[row].length) {
          message += grid[row][adjustedCol];
        }
      }
    }
    
    return message;
  };
  
  // Check if a grid position is under a chess piece
  const isPositionUnderChessPiece = (textRow, textCol) => {
    // Define the positions of pieces that spell "davidesthirty"
    // Based on the key piece verification in final_verification.js
    const piecePositions = [
      'h8', // R (black rook)
      'e6', // R (white rook)
      'g1', // K (white king)
      'd5', // P (white pawn)
      'a3', // Q (black queen)
      'b2', // P (black pawn)
      'e3', // P (black pawn)
      'd4', // N (white knight)
      'f4', // K (black king)
      'h3', // P (white pawn)
      'g3', // B (white bishop)
      'h2', // P (white pawn)
      'g5' // P (white pawn)
    ];
    
    // Check if the given text position matches any piece position
    for (const notation of piecePositions) {
      const position = chessPosition[notation];
      if (position && !position.empty && position.piece) {
        // Get the chess board coordinates for this piece
        const { row: pieceRow, col: pieceCol } = chessNotationToCoords(notation);
        
        // Calculate the actual column position of the piece on the grid
        // The chessboard is offset by chessFilterColumn
        // Adjust by -1 to correct for column offset issue
        const actualPieceCol = pieceCol + chessFilterColumn - 1;
        
        // Check if the text character position matches the piece position
        if (textRow === pieceRow && textCol === actualPieceCol) {
          return true;
        }
      }
    }
    
    return false;
  };
  
  // Handle slider change for chess overlay opacity (reversed: left=100%, right=0%)
  const handleOpacityChange = (e) => {
    // Reverse the value so left = 100% and right = 0%
    const reversedValue = 100 - parseInt(e.target.value);
    setOpacity(reversedValue);
    
    // Update the opacity of chess squares
    if (chessBoardRef.current) {
      const squares = chessBoardRef.current.querySelectorAll('.chess-square');
      squares.forEach(square => {
        // Only apply opacity change to squares with pieces
        if (square.classList.contains('has-piece')) {
          // Apply reversed opacity: when slider is at 0 (left), opacity is 100%
          square.style.opacity = reversedValue / 100;
        }
        // Empty squares should remain fully opaque
      });
    }
    
    // Update the opacity and color of text characters
    if (gridRef.current) {
      const chars = gridRef.current.querySelectorAll('.grid-char');
      chars.forEach(char => {
        // Get the position of this character
        const row = parseInt(char.dataset.currentRow);
        const col = parseInt(char.dataset.currentCol);
        
        // Check if this character is under a chess piece
        const isUnderPiece = isPositionUnderChessPiece(row, col);
        
        // Apply smooth transition for all characters
        char.style.transition = 'opacity 0.3s ease, color 0.3s ease';
        
        // Red letters (under pieces) should stay fully opaque
        // Other letters should fade as the slider moves left
        if (isUnderPiece) {
          char.style.opacity = 1; // Keep red letters fully visible
          char.style.color = 'red';
          char.style.fontWeight = 'bold';
        } else {
          // Other letters fade as the slider moves left
          char.style.opacity = reversedValue / 100;
          char.style.color = ''; // Reset to default color
          char.style.fontWeight = ''; // Reset to default weight
        }
      });
    }
    
    // When opacity is low enough, reveal the secret message
    if (reversedValue < 30) {
      const grid = textToPaddedGrid(ocrResult || originalText);
      const secret = getSecretMessage(grid);
      setRevealedMessage(secret.toLowerCase());
    }
  };
  
  // Update the chess board position based on rotation
  const handlePoneglyphAlignment = (rotation) => {
    // Calculate how many 30px moves based on rotation (30px per 30 degrees)
    // Start from initial position and move left based on rotation
    const moves = Math.floor(rotation / 30);
    const leftOffset = 10 - (moves * 30); // Move 30px left for every 30°
    
    setChessBoardPosition({ left: leftOffset, top: 60 });
  };
  
  // Handle poneglyph alignment instruction (Step 5)
  const handlePoneglyphInstruction = (rotation) => {
    handlePoneglyphAlignment(rotation);
  };
  
  // Handle wheel rotation changes
  const handleWheelRotation = (angle) => {
    switch (step) {
      case 0:
        // Step 0: Move to 180° - Initial text display
        setTreasureOpened(true);
        setTimeout(() => {
          if (step < 1) {
            setStep(1);
          }
          setTreasureOpened(false);
        }, 5000);
        break;
      case 1:
        // Step 1: Move to 90° - open treasure chest west and fade in text
        setTreasureOpened(true);
        setTimeout(() => {
          if (step === 1) {
            setStep(2);
          }
          setTreasureOpened(false);
        }, 5000);
        break;
      case 2:
        // Step 2: Move to 270° - open treasure chest east and remove punctuation
        setTreasureOpened(true);
        setTimeout(() => {
          if (step === 2) {
            animateToCleanedText();
            setTimeout(() => setStep(3), 2000);
          }
          setTreasureOpened(false);
        }, 5000);
        break;
      case 3:
        // Step 3: Move to 180° - open treasure chest south and apply padding
        setTreasureOpened(true);
        setTimeout(() => {
          if (step === 3) {
            animateToPaddedText();
            setTimeout(() => setStep(4), 2000);
          }
          setTreasureOpened(false);
        }, 5000);
        break;
      case 4:
        // Step 4: Move to 0° - open treasure chest north and show chessboard
        setTreasureOpened(true);
        setTimeout(() => {
          if (step === 4) {
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
            setStep(5);
          }
          setTreasureOpened(false);
        }, 5000);
        break;
      case 5:
        // Step 5: Align poneglyph - chessboard moves as wheel rotates
        // This is handled by the handlePoneglyphAlignment function
        // When target reached, move to next step
        if (angle === 0 || angle === 360) {
          setStep(6);
        }
        break;
      case 6:
        // Step 6: Apply opacity filter gradually from current position (opacity 100) to 360° (full transparent)
        // This is handled by the opacity slider, but we could add an automatic transition
        // When rotation reaches 360°, reveal the final message
        if (angle === 360) {
          const grid = textToPaddedGrid(ocrResult || originalText);
          const secret = getSecretMessage(grid);
          setRevealedMessage(secret.toLowerCase());
        }
        break;
      default:
        break;
    }
  };
  
  // Render the text grid (unified function for all steps)
  const renderTextGrid = () => {
    // Get the base grid (original text)
    const originalGrid = textToOriginalGrid(ocrResult || originalText);
    const charMapping = getCharacterMapping(ocrResult || originalText);
    
    // Get the cleaned grid (without spaces/punctuation)
    const cleanedGrid = textToCleanedGrid(ocrResult || originalText);
    
    // Get the padded grid (with padding applied)
    const paddedGrid = textToPaddedGrid(ocrResult || originalText);
    
    return (
      <div className="text-grid" ref={gridRef} style={{ position: 'relative', height: '240px', width: 'fit-content' }}>
        {originalGrid.map((row, rowIndex) => {
          // Determine which grid to use based on current step
          let displayRow = row;
          if (step >= 2) {
            // For steps 2+, use the cleaned grid
            displayRow = cleanedGrid[rowIndex] || [];
          }
          if (step >= 3) {
            // For steps 3+, use the padded grid
            displayRow = paddedGrid[rowIndex] || [];
          }
          
          return (
            <div key={rowIndex} className="grid-row" style={{ position: 'absolute', top: `${rowIndex * 30}px`, left: 0 }}>
              {displayRow.map((char, colIndex) => {
                // Calculate original position for animation
                let originalRow = rowIndex;
                let originalCol = colIndex;
                
                // For step 2+, we need to find the original position of this character
                if (step >= 2) {
                  // Look up the mapping for this character
                  const mapping = charMapping.find(m => 
                    m.targetRow === rowIndex && m.targetCol === colIndex
                  );
                  
                  if (mapping) {
                    originalRow = mapping.originalRow;
                    originalCol = mapping.originalCol;
                  }
                }
                
                // For step 3+, we need to account for padding
                if (step >= 3) {
                  // Calculate original position without padding
                  const padding = paddingConfig[rowIndex] || 0;
                  originalCol = colIndex - padding;
                }
                
                return (
                  <span 
                    key={`${rowIndex}-${colIndex}`} 
                    className="grid-char"
                    data-original-row={originalRow}
                    data-original-col={originalCol}
                    data-current-row={rowIndex}
                    data-current-col={colIndex}
                    style={{ 
                      position: 'absolute',
                      left: `${colIndex * 30}px`,
                      top: 0,
                      opacity: step === 1 ? (/[A-Z0-9]/.test(char) ? 1 : 0.3) : 1 // Dim non-alphanumeric characters only in step 1
                    }}
                  >
                    {char}
                  </span>
                );
              })}
            </div>
          );
        })}
      </div>
    );
  };
  
  // Render the cleaned text grid
  const renderCleanedTextGrid = () => {
    const grid = textToCleanedGrid(ocrResult || originalText);
    const paddingMapping = getPaddingMapping(ocrResult || originalText);
    
    // Calculate grid dimensions
    const maxCols = Math.max(...grid.map(row => row.length), 1);
    const gridHeight = Math.max(grid.length, 1) * 30;
    
    return (
      <div className="text-grid" ref={gridRef} style={{ position: 'relative', height: `${gridHeight}px`, textAlign: 'left', margin: '0 auto 0 0' }}>
        {grid.map((row, rowIndex) => (
          <div key={rowIndex} className="grid-row" style={{ position: 'absolute', top: `${rowIndex * 30}px`, left: 0 }}>
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
                    left: `${colIndex * 30}px`,
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
      <div className="text-grid" ref={gridRef} style={{ position: 'relative', height: '240px', width: 'fit-content' }}>
        {grid.map((row, rowIndex) => (
          <div key={rowIndex} className="grid-row" style={{ position: 'absolute', top: `${rowIndex * 30}px`, left: 0 }}>
            {row.map((char, colIndex) => {
              // Calculate original position without padding
              const originalCol = colIndex - (paddingConfig[rowIndex] || 0);
              
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
                    left: `${colIndex * 30}px`,
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
    // Start from column defined by chessFilterColumn parameter
    const startColumn = chessFilterColumn;
    
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
            top: `${rowIndex * 30}px`, // Match the grid character height
            left: 0
          }}>
            {Array.from({ length: 8 }).map((_, colIndex) => {
              // Calculate the actual column based on startColumn
              const actualCol = colIndex + startColumn;
              const notation = String.fromCharCode(97 + colIndex) + (8 - rowIndex); // a-h, 8-1
              const position = chessPosition[notation];
              const hasPiece = position && !position.empty && position.piece;
              
              return (
                <div
                  key={colIndex}
                  className={`chess-square ${(rowIndex + colIndex) % 2 === 0 ? 'light' : 'dark'} ${hasPiece ? 'has-piece' : ''}`}
                  style={{ 
                    width: '30px',
                    height: '30px',
                    opacity: 1, // Always start with 100% opacity
                    transition: 'opacity 0.3s ease', // Faster transition for better responsiveness
                    position: 'absolute',
                    left: `${actualCol * 30}px` // Position each square at its correct column (30px to match character width)
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
                      color: position.piece.includes('white') ? 'black' : 'white',
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
  
  // Render the step content with updated chess board position
  const renderStepContent = () => {
    if (step < 1) return null;
    
    return (
      <div className="step-all-transitions">
        {/* Show step title based on current step */}
        {step === 1 && <h2>Recognized Text</h2>}
        {step === 2 && <h2>Removing Spaces and Punctuation</h2>}
        {step === 3 && <h2>Applying Padding</h2>}
        {(step >= 4) && <h2>Chess Filter Overlay</h2>}
        
        <div style={{ 
          position: 'relative', 
          width: 'fit-content',
          margin: '20px 0',
          background: 'rgba(0, 0, 0, 0.3)',
          borderRadius: '8px',
          padding: '20px',
          textAlign: 'left'
        }}>
          {/* Render the text grid - always visible and reusing same elements */}
          <div style={{ 
            position: 'relative', 
            width: 'fit-content',
            height: '240px'
          }}>
            {renderTextGrid()}
          </div>
          
          {/* Render the chess overlay on top for step 4+ */}
          {(step >= 4) && (
            <div 
              ref={chessBoardRef}
              className={`chess-overlay-container ${step >= 4 ? 'fade-in' : ''}`} 
              style={{ 
                position: 'absolute',
                top: `${chessBoardPosition.top}px`, 
                left: `${chessBoardPosition.left}px`, 
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
                marginLeft: '-20px',
                marginTop: '-20px'
              }}
            >
              {renderChessOverlay()}
            </div>
          )}
        </div>
        
        {/* Navigation buttons for manual control */}
        <div className="navigation-buttons">
          {step === 1 && (
            <button className="continue-button" onClick={() => {
              animateToCleanedText();
              setTimeout(() => setStep(2), 2000);
            }}>
              Remove Spaces and Punctuation
            </button>
          )}
          {step === 2 && (
            <button className="continue-button" onClick={() => {
              animateToPaddedText();
              setTimeout(() => setStep(3), 2000);
            }}>
              Apply Padding
            </button>
          )}
          {step === 3 && (
            <button className="continue-button" onClick={() => {
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
              setStep(4);
            }}>
              Show Chess Overlay
            </button>
          )}
          {(step >= 4) && (
            <>
              <button className="continue-button" onClick={() => setStep(1)}>
                Restart Process
              </button>
              <div className="slider-container">
                <label htmlFor="opacity-slider">Adjust Filter Opacity (Left: Hide Letters, Right: Show Letters):</label>
                <input
                  id="opacity-slider"
                  type="range"
                  min="0"
                  max="100"
                  value={100 - opacity} // Reverse the value for display
                  onChange={handleOpacityChange}
                  className="opacity-slider"
                />
                <span className="slider-value">{opacity}%</span>
              </div>
            </>
          )}
        </div>
        
        {/* Show revealed message when opacity is low enough */}
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
    );
  };

  return (
    <div style={{ 
      position: 'relative',
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      <ShipWheel 
        onRotationChange={handleWheelRotation} 
        targetAngle={
          step === 0 ? 180 :    // Initial state: rotate to 180° to display text
          step === 1 ? 90 :     // After text shown: rotate to 90° 
          step === 2 ? 270 :    // After punctuation removed: rotate to 270°
          step === 3 ? 180 :    // After padding applied: rotate to 180°
          step === 4 ? 0 :      // After chessboard shown: rotate to 0°
          step === 5 ? 0 :      // For poneglyph alignment: return to 0°
          360                   // For opacity transition: to 360°
        }
        step={step}
        onPoneglyphAlignment={handlePoneglyphAlignment}
      />
      {treasureOpened && (
        <div className="treasure-chest-overlay">
          <img 
            src="/images/treasure_box_256.png" 
            alt="Treasure Chest" 
            className="treasure-chest-image"
            style={{ 
              position: 'absolute', 
              width: '100px', 
              height: '100px',
              animation: 'fadeInOut 5s forwards'
            }}
          />
        </div>
      )}
      {renderStepContent()}
      <style>{`
        @keyframes fadeInOut {
          0% { opacity: 0; transform: scale(0.5); }
          20% { opacity: 1; transform: scale(1); }
          80% { opacity: 1; transform: scale(1); }
          100% { opacity: 0; transform: scale(0.5); }
        }
      `}</style>
    </div>
  );
};

export default EnhancedReveal;