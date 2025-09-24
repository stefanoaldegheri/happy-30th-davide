import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import ShipWheel from './ShipWheel';
import './EnhancedReveal.css';

// Chess position data from the provided JSON
export const chessPosition = {
  a1: { empty: true, piece: null },
  b1: { empty: true, piece: null },
  c1: { empty: true, piece: null },
  d1: { empty: true, piece: null },
  e1: { empty: true, piece: null },
  f1: { empty: true, piece: null },
  g1: { empty: false, piece: 'white king' },
  h1: { empty: true, piece: null },
  a2: { empty: true, piece: null },
  b2: { empty: false, piece: 'black pawn' },
  c2: { empty: true, piece: null },
  d2: { empty: true, piece: null },
  e2: { empty: true, piece: null },
  f2: { empty: true, piece: null },
  g2: { empty: true, piece: null },
  h2: { empty: false, piece: 'white pawn' },
  a3: { empty: false, piece: 'black queen' },
  b3: { empty: true, piece: null },
  c3: { empty: true, piece: null },
  d3: { empty: true, piece: null },
  e3: { empty: false, piece: 'black pawn' },
  f3: { empty: true, piece: null },
  g3: { empty: false, piece: 'white bishop' },
  h3: { empty: false, piece: 'white pawn' },
  a4: { empty: true, piece: null },
  b4: { empty: true, piece: null },
  c4: { empty: true, piece: null },
  d4: { empty: false, piece: 'white knight' },
  e4: { empty: true, piece: null },
  f4: { empty: false, piece: 'black king' },
  g4: { empty: true, piece: null },
  h4: { empty: true, piece: null },
  a5: { empty: true, piece: null },
  b5: { empty: true, piece: null },
  c5: { empty: true, piece: null },
  d5: { empty: false, piece: 'white pawn' },
  e5: { empty: true, piece: null },
  f5: { empty: true, piece: null },
  g5: { empty: false, piece: 'white pawn' },
  h5: { empty: true, piece: null },
  a6: { empty: true, piece: null },
  b6: { empty: true, piece: null },
  c6: { empty: true, piece: null },
  d6: { empty: true, piece: null },
  e6: { empty: false, piece: 'white rook' },
  f6: { empty: true, piece: null },
  g6: { empty: true, piece: null },
  h6: { empty: true, piece: null },
  a7: { empty: true, piece: null },
  b7: { empty: true, piece: null },
  c7: { empty: true, piece: null },
  d7: { empty: true, piece: null },
  e7: { empty: true, piece: null },
  f7: { empty: true, piece: null },
  g7: { empty: true, piece: null },
  h7: { empty: true, piece: null },
  a8: { empty: true, piece: null },
  b8: { empty: true, piece: null },
  c8: { empty: true, piece: null },
  d8: { empty: true, piece: null },
  e8: { empty: true, piece: null },
  f8: { empty: true, piece: null },
  g8: { empty: true, piece: null },
  h8: { empty: false, piece: 'black rook' },
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
  const [step, setStep] = useState(0); // 0: initial, 1: original text, 2: transition to cleaned text, 3: apply padding, 4: chess overlay, 5: poneglyph alignment, 6: revealed message

  const [revealedMessage, setRevealedMessage] = useState('');
  const [ocrResult, setOcrResult] = useState('');
  const [treasureOpened, setTreasureOpened] = useState(false);
  const [currentPoneglyph, setCurrentPoneglyph] = useState(null);
  const [chessBoardPosition, setChessBoardPosition] = useState({
    left: 420,
    top: 0,
  }); // Start at column 14 (14*30=420px) to align a8 with R in row 0 position 14
  const [chessBoardOpacity, setChessBoardOpacity] = useState(0); // Start with 0 opacity for fade-in effect
  const [revealedState, setRevealedState] = useState({}); // Store the final revealed state when moving to step 6
  const [animationCompleted, setAnimationCompleted] = useState(false); // Track if animation has run

  // Static configuration for padding values
  const paddingConfig = [0, 4, 7, 11, 10, 9, 6, 10];

  // Chess filter column parameter (0-indexed) - chessboard starts at column 14 (14*30=420px)
  const chessFilterColumn = 14;

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

    // Don't start the animation sequence automatically - wait for first wheel rotation
    // The step will remain at 0 until the user rotates the wheel
  }, []);

  // Effect to handle step transitions (manual only)
  useEffect(() => {
    // All transitions are now manual, so we don't need automatic transitions
    // We'll keep this useEffect to handle any side effects when step changes

    if (step === 4) {
      // When we reach the chess overlay step, we might want to do some initialization
      // but we don't want to automatically animate the chess board
    }

    // When step reaches 6, animate the letters to form a word (only once)
    if (step === 6 && !animationCompleted) {
      console.log('Starting step 6 animation');
      setAnimationCompleted(true);
      // Delay to ensure state is set before running animation
      setTimeout(() => {
        // Get all red letters from the grid that were under chess pieces
        const chars = gridRef.current
          ? Array.from(gridRef.current.querySelectorAll('.grid-char'))
          : [];
        const redLettersToMove = [];

        chars.forEach((char) => {
          const row = parseInt(char.dataset.currentRow);
          const col = parseInt(char.dataset.currentCol);
          const isUnderPiece = isPositionUnderChessPiece(row, col);
          const isRedText =
            char.style.color === 'red' &&
            parseFloat(char.style.opacity || '1') > 0;

          if (isUnderPiece && char.textContent.trim() !== '' && isRedText) {
            redLettersToMove.push({
              element: char,
              text: char.textContent,
              row: row,
              col: col,
            });
          }
        });

        console.log('Letters to move:', redLettersToMove);
        const secretWord = revealedMessage || 'davidesthirty';

        // Calculate the final positions for each letter in the 4th row (index 3) from column 20 to 34
        const letterPositions = [];

        letterPositions.push({ x: 600, y: 90 });
        letterPositions.push({ x: 630, y: 90 -60 });
        letterPositions.push({ x: 660, y: 90 -90 });
        letterPositions.push({ x: 690, y: 90 -90});
        letterPositions.push({ x: 720, y: 90-120 });
        letterPositions.push({ x: 750, y: 90-120 });
        letterPositions.push({ x: 780, y: 90-150 });
        letterPositions.push({ x: 810, y: 90-150 });
        letterPositions.push({ x: 840, y: 90-150 });
        letterPositions.push({ x: 870, y: 90-150 });
        letterPositions.push({ x: 900, y: 90-180 });
        letterPositions.push({ x: 930, y: 90 -180});
        letterPositions.push({ x: 960, y: 90-210 });

        // const targetRow = 3; // 4th row (0-indexed)
        // const startCol = 20;

        // // Position each letter in sequence from column 20 onwards
        // for (let i = 0; i < secretWord.length && (startCol + i) < 35; i++) {
        //   const finalCol = startCol + i;
        //   const finalX = finalCol * 30; // 30px per column
        //   const finalY = targetRow * 30; // 30px per row
        //   letterPositions.push({ x: finalX, y: finalY });
        // }

        console.log('Letter positions:', letterPositions);
        redLettersToMove.forEach((letterData, index) => {
          if (index < letterPositions.length) {
            // Calculate the original position relative to the grid container
            const originalLeft =
              parseInt(letterData.element.style.left) || letterData.col * 30;
            const originalTop =
              parseInt(letterData.element.style.top) || letterData.row * 30;

            // Get the final position for this letter
            const finalPos = letterPositions[index];

            console.log(
              `Animating letter ${letterData.text} from (${originalLeft}, ${originalTop}) to (${finalPos.x}, ${finalPos.y})`
            );



        gsap.set(letterData.element, {
              left: finalPos.x,
              top: finalPos.y,
              x: 0, // Reset the transform
              y: 0, // Reset the transform
              position: 'absolute',
              zIndex: 200,
              color: 'red',
              delay:  index * 0.35,
              // fontSize and fontWeight are already animated, so no need to set them again
            });

            // Animate the letter from its original grid position to the new position in row 4
            // gsap.to(letterData.element, {
            //   x: finalPos.x - originalLeft,
            //   y: finalPos.y,
            //   fontSize: '32px',
            //   fontWeight: 'bold',
            //   duration: 2,
            //   ease: "power2.inOut",
            //   position: 'absolute',
            //   delay: index * 0.35, // Stagger the animation
            //   onComplete: () => {
           
            //   }
            // });
          }
        });
      }, 50);
    }

    // Reset animation completed when leaving step 6
    if (step !== 6) {
      setAnimationCompleted(false);
    }

    // Remove the automatic transition from step 1 to step 2 since this is now handled by wheel rotation
  }, [step, animationCompleted]);

  // Animate transition from original text to cleaned text
  const animateToCleanedText = () => {
    if (gridRef.current) {
      const chars = gridRef.current.querySelectorAll('.grid-char');
      chars.forEach((char) => {
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
            y: 0,
          });

          // Animate from original position to target position
          gsap.to(char, {
            x: targetLeft - originalLeft,
            y: targetTop - originalTop,
            duration: 2, // 2 seconds for faster movement
            ease: 'power2.out',
            delay: originalRow * 0.05 + originalCol * 0.01, // Staggered animation
          });
        }
      });
    }
  };

  // Animate transition from cleaned text to padded text
  const animateToPaddedText = () => {
    if (gridRef.current) {
      const chars = gridRef.current.querySelectorAll('.grid-char');
      chars.forEach((char) => {
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
            y: 0,
          });

          // Animate from original position to target position
          gsap.to(char, {
            x: targetLeft - originalLeft,
            y: targetTop - originalTop,
            duration: 2, // 2 seconds for faster movement
            ease: 'power2.out',
            delay: originalRow * 0.05 + originalCol * 0.01, // Staggered animation
          });
        }
      });
    }
  };

  // Convert text to original grid format (8 rows x 38 columns, with all row letters starting at column 0)
  const textToOriginalGrid = (text) => {
    // Split text into lines
    const lines = text.split('\n');

    // Create grid with 8 rows and 38 columns, all letters starting at column 0
    const grid = [];
    for (let row = 0; row < 8; row++) {
      const line = row < lines.length ? lines[row] : '';
      const gridRow = [];

      // Add all characters from the line
      for (let col = 0; col < line.length; col++) {
        gridRow.push(line[col]);
      }

      // Fill the rest of the row with spaces to make it 38 columns wide
      for (let col = line.length; col < 38; col++) {
        gridRow.push(' ');
      }

      grid.push(gridRow);
    }

    return grid;
  };

  // Convert text to cleaned grid format (removing spaces and punctuation, 8 rows x 38 columns)
  const textToCleanedGrid = (text) => {
    // Split text into lines
    const lines = text.split('\n');

    // Create grid with 8 rows and 38 columns, cleaned content starting at column 0
    const grid = [];
    for (let row = 0; row < 8; row++) {
      const line = row < lines.length ? lines[row] : '';
      // Remove spaces and punctuation, keep only A-Z and 0-9
      const cleanLine = line.replace(/[^A-Z0-9]/g, '');
      const gridRow = [];

      // Add cleaned characters starting at column 0
      for (let col = 0; col < cleanLine.length; col++) {
        gridRow.push(cleanLine[col]);
      }

      // Fill the rest of the row with spaces to make it 38 columns wide
      for (let col = cleanLine.length; col < 38; col++) {
        gridRow.push(' ');
      }

      grid.push(gridRow);
    }

    return grid;
  };

  // Convert text to padded grid format (applying padding to cleaned text, 8 rows x 38 columns)
  const textToPaddedGrid = (text) => {
    // Split text into lines
    const lines = text.split('\n');

    // Create grid with 8 rows and 38 columns, cleaned and padded content
    const grid = [];
    for (let row = 0; row < 8; row++) {
      const line = row < lines.length ? lines[row] : '';
      // Remove spaces and punctuation, keep only A-Z and 0-9
      const cleanLine = line.replace(/[^A-Z0-9]/g, '');

      // Apply padding
      const padding = paddingConfig[row] || 0;
      const paddedLine = ' '.repeat(padding) + cleanLine;

      const gridRow = [];
      // Add padded characters
      for (let col = 0; col < paddedLine.length; col++) {
        gridRow.push(paddedLine[col]);
      }

      // Fill the rest of the row with spaces to make it 38 columns wide
      for (let col = paddedLine.length; col < 38; col++) {
        gridRow.push(' ');
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
            targetCol: cleanCol,
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
          targetCol: col + padding,
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
      'g5', // P (white pawn)
    ];

    // Iterate through chess positions in the defined order to extract letters
    for (const notation of pieceOrder) {
      const position = chessPosition[notation];
      if (position && !position.empty && position.piece) {
        const { row, col } = chessNotationToCoords(notation);
        // Adjust column based on chessFilterColumn parameter (now at column 0)
        const adjustedCol = col + chessFilterColumn;
        if (row < grid.length && adjustedCol < grid[row].length) {
          message += grid[row][adjustedCol];
        }
      }
    }

    return message;
  };

  // Check if a grid position is under a chess piece considering the actual chessboard position
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
      'g5', // P (white pawn)
    ];

    // Calculate where the chessboard is positioned based on the current chessBoardPosition.left
    // Each column is 30px wide, so we can calculate the starting column from the left position
    const leftOffset = chessBoardPosition.left;
    const startingColumn = Math.round(leftOffset / 30);

    // Check if the given text position matches any piece position
    for (const notation of piecePositions) {
      const position = chessPosition[notation];
      if (position && !position.empty && position.piece) {
        // Get the chess board coordinates for this piece
        const { row: pieceRow, col: pieceCol } =
          chessNotationToCoords(notation);

        // Calculate the actual column position of the piece on the text grid
        // This is the starting column of the chessboard + the piece's column offset (0-7)
        const actualPieceCol = startingColumn + pieceCol;

        // Check if the text character position matches the piece position
        if (textRow === pieceRow && textCol === actualPieceCol) {
          return true;
        }
      }
    }

    return false;
  };

  // Update the chess board position and opacity based on rotation
  const handlePoneglyphAlignment = (rotation) => {
    // For step 4: Calculate position based on rotation with the following requirements:
    // At 180°: a8 at column 14 (420px)
    // At 5°: a8 at column 8 (240px)
    // At 355°: a8 at column 20 (600px)
    // Every 30° = one text square movement (30px)
    if (step === 4) {
      // Calculate movement from reference point (180° = starting position at 420px)
      // Each 30° of rotation should move 1 square (30px)
      const baseRotation = 180; // Reference rotation where position is 420px
      const basePosition = 420; // Reference position where a8 is at column 14
      const degreesPerMove = 30; // Every 30 degrees is one square move
      const pixelsPerMove = 30; // Each move is 30 pixels

      // Calculate how many moves from the base rotation - round to nearest to update at halfway point
      const rotationDifference = rotation - baseRotation;
      // Use Math.round to update when reaching halfway point between squares (e.g. at 165°, 135°, etc.)
      const moveCount = Math.round(rotationDifference / degreesPerMove);
      const leftOffset = basePosition + moveCount * pixelsPerMove;

      // Ensure chessboard doesn't go out of bounds (0 to 1140px for 38 columns)
      // Chessboard is 8 squares * 30px = 240px wide
      const clampedOffset = Math.max(0, Math.min(900, leftOffset)); // Keep within bounds: min 0, max 900 (1140-240)

      setChessBoardPosition({ left: clampedOffset, top: 0 });
    } else if (step === 5) {
      // In step 5: Don't move the chessboard, control opacity of chess squares with pieces and text characters
      // Opacity goes from 100% at 5° to 0% at 355° for chess pieces
      // Calculate opacity: 100% at 5°, 0% at 355° for chess pieces
      // Map rotation from 5° to 355° to percentage from 100% to 0%
      // We want pieceOpacity to go from 1 (at 5°) to 0 (at 355°)
      let pieceOpacity;
      if (rotation <= 5) {
        pieceOpacity = 1; // At start of range (5°), pieces are 100% visible
      } else if (rotation >= 355) {
        pieceOpacity = 0; // At end of range (355°), pieces are 0% visible
      } else {
        // Linear interpolation: from 1 at 5° to 0 at 355°
        pieceOpacity = 1 - (rotation - 5) / (355 - 5); // (rotation - 5) / 350
      }

      // Text characters not under pieces should fade out as pieces become more transparent
      const otherTextOpacity = pieceOpacity; // Other text fades with chess pieces
      // Text characters under pieces should become more visible as pieces become more transparent
      const underPieceTextOpacity = 1 - pieceOpacity; // Inverse: when pieces are 0% opaque, text under them is 100% visible

      if (chessBoardRef.current) {
        // Update opacity of individual squares that have pieces
        const squares = chessBoardRef.current.querySelectorAll(
          '.chess-square.has-piece'
        );
        squares.forEach((square) => {
          // Apply the calculated opacity based on rotation
          square.style.opacity = Math.max(0, Math.min(1, pieceOpacity)); // Clamp between 0 and 1
        });
      }

      // Update opacity of ALL text characters
      if (gridRef.current) {
        const chars = gridRef.current.querySelectorAll('.grid-char');
        chars.forEach((char) => {
          // Get the position of this character
          const row = parseInt(char.dataset.currentRow);
          const col = parseInt(char.dataset.currentCol);

          // Check if this character is under a chess piece
          const isUnderPiece = isPositionUnderChessPiece(row, col);

          if (isUnderPiece) {
            // Text under pieces should become more visible as chess pieces become transparent
            char.style.opacity = Math.max(
              0,
              Math.min(1, underPieceTextOpacity)
            );
            char.style.color = 'red';
            char.style.fontWeight = 'bold';
          } else {
            // Other text should fade out as chess pieces become transparent
            char.style.opacity = Math.max(0, Math.min(1, otherTextOpacity));
            char.style.color = '';
            char.style.fontWeight = '';
          }
        });
      }
    } else if (step === 6) {
      // In step 6: Maintain the final revealed state (independent of rotation)
      // At the moment the secret was revealed (355°), pieces became invisible and text under them became visible
      // So in step 6, chess pieces should be invisible (0% opacity) and text under them should be visible (100% opacity)

      if (chessBoardRef.current) {
        // Set chess pieces to 0 opacity so they are completely invisible in step 6
        const squares = chessBoardRef.current.querySelectorAll(
          '.chess-square.has-piece'
        );
        squares.forEach((square) => {
          square.style.opacity = 0; // Hide chess pieces completely in step 6
        });

        // Set empty chess squares to full opacity so they remain visible in step 6
        const emptySquares = chessBoardRef.current.querySelectorAll(
          '.chess-square:not(.has-piece)'
        );
        emptySquares.forEach((square) => {
          square.style.opacity = 1; // Keep empty squares visible in step 6
        });
      }

      // Update opacity of ALL text characters for step 6
      if (gridRef.current) {
        const chars = gridRef.current.querySelectorAll('.grid-char');
        chars.forEach((char) => {
          // Get the position of this character
          const row = parseInt(char.dataset.currentRow);
          const col = parseInt(char.dataset.currentCol);

          // Check if this character is under a chess piece
          const isUnderPiece = isPositionUnderChessPiece(row, col);

          if (isUnderPiece) {
            // Text that was under pieces should be fully visible in step 6
            char.style.opacity = 1; // 100% visible
            // Keep red and bold for text that was under pieces
            char.style.color = 'red';
            char.style.fontWeight = 'bold';
          } else {
            // Other text should be invisible in step 6
            char.style.opacity = 0; // 0% visible
            char.style.color = '';
            char.style.fontWeight = '';
          }
        });
      }
    }

    // Calculate opacity based on current step and rotation:
    let mainOpacity = 1; // Default to fully opaque

    if (step === 3) {
      // Step 3: Chessboard remains hidden (should not happen with new logic)
      mainOpacity = 0; // Keep chessboard hidden in step 3 if reached
    } else if (step === 4) {
      // Step 4: Fully opaque to allow sliding
      mainOpacity = 1; // Fully opaque in step 4 to allow sliding
    } else if (step === 5 || step === 6) {
      // Step 5 and 6: Main container stays fully opaque, individual elements controlled by the function above
      mainOpacity = 1; // Main container stays at 1, individual elements are controlled separately
    }

    setChessBoardOpacity(mainOpacity);
  };

  // Handle poneglyph alignment instruction (Step 5)
  const handlePoneglyphInstruction = (rotation) => {
    handlePoneglyphAlignment(rotation);
    // If rotation is close to 355° (within 5°), show poneglyph
    if (Math.abs(rotation - 355) < 5 && step < 6) {
      setCurrentPoneglyph('/images/poneglyph_256.png');
    }
    // Once poneglyph is shown, it stays visible
  };

  // Handle wheel rotation changes
  const handleWheelRotation = (angle) => {
    switch (step) {
      case 0:
        // Step 0 → target 180° = show text
        if (angle === 180) {
          setStep(1);
          setTreasureOpened(true);
          setTimeout(() => {
            setTreasureOpened(false);
          }, 5000);
        }
        break;
      case 1:
        // Step 1 → target 90° = remove punctuation
        if (angle === 90) {
          setStep(2);
          setTreasureOpened(true);
          setTimeout(() => {
            setTreasureOpened(false);
            animateToCleanedText();
            // Stay in step 2 and wait for the next rotation to 270°
          }, 5000);
        }
        break;
      case 2:
        // Step 2 → target 270° = apply padding
        if (angle === 270) {
          setStep(3);
          setTreasureOpened(true);
          setTimeout(() => {
            setTreasureOpened(false);
            animateToPaddedText();
            // Stay in step 3 and wait for the next rotation to 180°
          }, 1000); // Reduced from 5000 to 1000ms (1 second)
        }
        break;
      case 3:
        // Step 3 → target 180° = show chessboard with fade-in effect
        if (angle === 180) {
          setStep(4);
          setTreasureOpened(true);
          setTimeout(() => {
            setTreasureOpened(false);
            // Make sure the chessboard starts at the correct center position
            setChessBoardPosition({ left: 420, top: 0 }); // Set center position before fade-in
            // Update the chess board opacity to 1 to make it visible
            setChessBoardOpacity(1);
            if (chessBoardRef.current) {
              // Animate chess board fade-in effect
              const squares =
                chessBoardRef.current.querySelectorAll('.chess-square');
              squares.forEach((square, index) => {
                const rowIndex = Math.floor(index / 8);
                const colIndex = index % 8;

                if (
                  rowIndex >= 0 &&
                  rowIndex <= 7 &&
                  colIndex >= 0 &&
                  colIndex <= 7
                ) {
                  gsap.fromTo(
                    square,
                    { opacity: 0 },
                    {
                      opacity: 1,
                      duration: 1,
                      delay: rowIndex * 0.1 + colIndex * 0.05,
                      ease: 'power2.out',
                    }
                  );
                }
              });
            }
            // Stay in step 4 and wait for rotation to 340° to continue to next step
          }, 100); // Short delay to allow state update before fade-in
        }
        break;
      case 4:
        // Step 4 → target range 16°-44° = slide chessboard
        // Slide chessboard as wheel rotates
        handlePoneglyphAlignment(angle); // This function adjusts chessboard position based on rotation
        // When target reached (between 16°-44°), move to next step
        if (angle >= 16 && angle <= 44) {
          // Within the target range
          setStep(5);
          setTreasureOpened(true);
          setTimeout(() => {
            setTreasureOpened(false);
          }, 5000);
        }
        break;
      case 5:
        // Step 5 → target 355° = control opacity of chessboard squares with pieces to reveal message
        // Opacity goes from 100% at 5° to 0% at 355° (adjusted from 0° to 360° to avoid confusion)
        handlePoneglyphAlignment(angle); // This function adjusts opacity of squares with pieces based on rotation
        // When rotation reaches 355° (adjusted target to avoid 0°/360° confusion), reveal the final message
        if (Math.abs(angle - 355) < 5) {
          const grid = textToPaddedGrid(ocrResult || originalText);
          const secret = getSecretMessage(grid);
          // Set the revealed message and capture the current revealed state to preserve when transitioning to step 6
          setRevealedMessage(secret);
          setRevealedState({
            rotation: angle,
          });
          setStep(6); // Move to final step
        }
        break;
      case 6:
        // Final step - maintain opacity from step 5 and animate letters to form a word
        // The opacity control from step 5 continues to apply the same settings
        handlePoneglyphAlignment(angle);
        // No further rotation changes in step 6
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

    // Calculate number of columns (max across all rows)
    const maxCols = Math.max(...originalGrid.map(row => row.length), 38); // Use at least 38 columns

    return (
      <div
        className="text-grid"
        ref={gridRef}
        style={{
          position: 'relative',
          height: '240px',
          width: '1140px',
          overflow: 'visible' // Allow treasure boxes to be visible outside the grid
        }}
      >
        {/* Top border treasure boxes */}
       {Array.from({ length: Math.ceil(maxCols/2) -1 }).map((_, colIndex) => (
         <img
           key={`top-tbox-${colIndex}`}
           src="/images/treasure_box_256.png"
           alt="Treasure Box"
           style={{
             position: 'absolute',
             top: '-60px', /* Move up by half the treasure box height (60/2) */
             left: `${colIndex * 60}px`,
             width: '60px',
             height: '60px',
             zIndex: 10,
           }}
         />
       ))}
       
       {/* Bottom border treasure boxes */}
       {Array.from({ length: Math.ceil(maxCols/2) -1 }).map((_, colIndex) => (
         <img
           key={`bottom-tbox-${colIndex}`}
           src="/images/treasure_box_256.png"
           alt="Treasure Box"
           style={{
             position: 'absolute',
             top: '240px', /* Align with bottom of grid plus half treasure box height (240 + 30) */
             left: `${colIndex * 60}px`,
             width: '60px',
             height: '60px',
             zIndex: 10,
           }}
         />
       ))}
       
       {/* Left border treasure boxes */}
       {Array.from({ length: 6 }).map((_, rowIndex) => (
         <img
           key={`left-tbox-${rowIndex}`}
           src="/images/treasure_box_256.png"
           alt="Treasure Box"
           style={{
             position: 'absolute',
             top: `${rowIndex * 60 -60}px`,
             left: '-60px', /* Move left by half the treasure box width (60/2) */
             width: '60px',
             height: '60px',
             zIndex: 10,
           }}
         />
       ))}
       
       {/* Right border treasure boxes */}
       {Array.from({ length: 6 }).map((_, rowIndex) => (
         <img
           key={`right-tbox-${rowIndex}`}
           src="/images/treasure_box_256.png"
           alt="Treasure Box"
           style={{
             position: 'absolute',
             top: `${rowIndex * 60-60}px`,
             left: '1140px', /* Grid width (1140) + half treasure box width (30) */
             width: '60px',
             height: '60px',
             zIndex: 10,
           }}
         />
       ))}
       
  
        
        {' '}
        {/* 38 columns * 30px = 1140px */}
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
            <div
              key={rowIndex}
              className="grid-row"
              style={{
                position: 'absolute',
                top: `${rowIndex * 30}px`,
                left: 0,
              }}
            >
              {displayRow.map((char, colIndex) => {
                // Calculate original position for animation
                let originalRow = rowIndex;
                let originalCol = colIndex;

                // For step 2+, we need to find the original position of this character
                if (step >= 2) {
                  // Look up the mapping for this character
                  const mapping = charMapping.find(
                    (m) => m.targetRow === rowIndex && m.targetCol === colIndex
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
                      opacity:
                        step === 1 ? (/[A-Z0-9]/.test(char) ? 1 : 0.3) : 1, // Dim non-alphanumeric characters only in step 1
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

    // Calculate grid dimensions (8 rows, 38 columns)
    const maxCols = 38;
    const gridHeight = 8 * 30;

    return (
      <div
        className="text-grid"
        ref={gridRef}
        style={{
          position: 'relative',
          height: `${gridHeight}px`,
          width: '1140px',
          textAlign: 'left',
          margin: '0 auto 0 0',
        }}
      >
        {grid.map((row, rowIndex) => (
          <div
            key={rowIndex}
            className="grid-row"
            style={{ position: 'absolute', top: `${rowIndex * 30}px`, left: 0 }}
          >
            {row.map((char, colIndex) => {
              // Find target position for this character with padding
              let targetRow = rowIndex;
              let targetCol = colIndex;

              // Look up the mapping for this character
              const mapping = paddingMapping.find(
                (m) => m.originalRow === rowIndex && m.originalCol === colIndex
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
                    top: 0,
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
      <div
        className="text-grid"
        ref={gridRef}
        style={{ position: 'relative', height: '240px', width: '1140px' }}
      >
        {grid.map((row, rowIndex) => (
          <div
            key={rowIndex}
            className="grid-row"
            style={{ position: 'absolute', top: `${rowIndex * 30}px`, left: 0 }}
          >
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
                    top: 0,
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
    // Show chessboard at column 0 (relative to text grid) as requested
    const startColumn = 0;

    return (
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
        }}
      >
        {Array.from({ length: 8 }).map((_, rowIndex) => (
          <div
            key={rowIndex}
            style={{
              display: 'flex',
              position: 'absolute',
              top: `${rowIndex * 30}px`, // Match the grid character height
              left: 0,
            }}
          >
            {Array.from({ length: 8 }).map((_, colIndex) => {
              // Calculate the actual column based on startColumn - but since we want chessboard at column 0,
              // the container position already accounts for the offset, so chess squares should start at left: 0
              const actualCol = colIndex + startColumn;
              const notation =
                String.fromCharCode(97 + colIndex) + (8 - rowIndex); // a-h, 8-1
              const position = chessPosition[notation];
              const hasPiece = position && !position.empty && position.piece;

              return (
                <div
                  key={colIndex}
                  className={`chess-square ${
                    (rowIndex + colIndex) % 2 === 0 ? 'light' : 'dark'
                  } ${hasPiece ? 'has-piece' : ''}`}
                  style={{
                    width: '30px',
                    height: '30px',
                    opacity: hasPiece ? 1 : 1, // Always start with 100% opacity, individual opacities controlled by handlePoneglyphAlignment
                    transition: 'opacity 0.3s ease', // Faster transition for better responsiveness
                    position: 'absolute',
                    left: `${actualCol * 30}px`, // Position each square at its correct column relative to the chessboard container
                    top: 0,
                  }}
                >
                  {hasPiece && (
                    <span
                      style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        fontSize: '20px',
                        fontWeight: 'bold',
                        color: position.piece.includes('white')
                          ? 'black'
                          : 'white',
                        textShadow: '1px 1px 1px rgba(0,0,0,0.5)',
                      }}
                    >
                      {position.piece.includes('king')
                        ? '♔'
                        : position.piece.includes('queen')
                        ? '♕'
                        : position.piece.includes('rook')
                        ? '♖'
                        : position.piece.includes('bishop')
                        ? '♗'
                        : position.piece.includes('knight')
                        ? '♘'
                        : position.piece.includes('pawn')
                        ? '♙'
                        : ' '}
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

  {
    /* Render the step content with updated chess board position */
  }
  const renderStepContent = () => {
    if (step < 1) return null; // Don't render anything until the first rotation occurs (step 1+)

    return (
      <div className="step-all-transitions">
        {/* Remove step titles - captions above text grid are no longer needed */}

        <div
          style={{
            position: 'relative',
            width: '1140px' /* 38 columns * 30px = 1140px */,
            margin: '20px 0',
            textAlign: 'left',
          }}
        >
          {/* Render the text grid - always visible and reusing same elements */}
          <div
            style={{
              position: 'relative',
              width: '1140px' /* 38 columns * 30px = 1140px */,
              height: '240px',
            }}
          >
            {renderTextGrid()}
          </div>

          {/* Render the chess overlay on top for step 4+ (chessboard appears after completing step 3, in step 4) */}
          {step >= 4 && (
            <div
              ref={chessBoardRef}
              className="chess-overlay-container"
              style={{
                position: 'absolute',
                top: `${chessBoardPosition.top}px`,
                left: `${chessBoardPosition.left}px`,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
                opacity: chessBoardOpacity, // Use dynamic opacity for all steps
              }}
            >
              {renderChessOverlay()}
            </div>
          )}

          {/* No container needed for step 6 since letters move to the 4th row of the grid */}

          {/* Show poneglyph instead of chessboard during step 5 when aligned */}
          {step === 5 && currentPoneglyph && (
            <div
              style={{
                position: 'absolute',
                top: `${chessBoardPosition.top}px`,
                left: `${chessBoardPosition.left}px`,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 102,
                animation: 'poneglyphFadeIn 1s forwards',
              }}
            >
              <img
                src={currentPoneglyph}
                alt="Poneglyph"
                style={{ width: '100px', height: '100px' }}
              />
            </div>
          )}

          {/* Create a new grid area below the main text grid for step 6 to show animated letters */}
          {step === 6 && (
            <div
              id="secret-word-grid"
              style={{
                position: 'relative',
                width: '1140px',
                height: '60px', // Height for one row of text
                top: '260px', // Below the main grid (240px + 20px margin)
                left: 0,
                display: 'flex',
                alignItems: 'center',
              }}
            >
              {/* The animated letters will be positioned in this area */}
            </div>
          )}
        </div>

        {/* Navigation buttons for manual control */}
        <div className="navigation-buttons">
          {step === 1 && (
            <button
              className="continue-button"
              onClick={() => {
                setStep(2);
                setTreasureOpened(true);
                setTimeout(() => {
                  setTreasureOpened(false);
                  animateToCleanedText();
                  setTimeout(() => setStep(3), 2000);
                }, 5000);
              }}
            >
              A sharp turn to 90° to clear the decks!
            </button>
          )}
          {step === 2 && (
            <button
              className="continue-button"
              onClick={() => {
                setStep(3);
                setTreasureOpened(true);
                setTimeout(() => {
                  setTreasureOpened(false);
                  animateToPaddedText();
                  // Stay in step 3 - no auto transition, user needs to rotate to 180° for step 4
                }, 1000); // Reduced from 5000 to 1000ms (1 second)
              }}
            >
              Swing 'er about to 270° and give the cargo some sea room!
            </button>
          )}
          {step === 3 && (
            <button
              className="continue-button"
              onClick={() => {
                setStep(4);
                setTreasureOpened(true);
                setTimeout(() => {
                  setTreasureOpened(false);
                  // Make sure the chessboard starts at the correct center position
                  setChessBoardPosition({ left: 420, top: 0 }); // Set center position before fade-in
                  // Update the chess board opacity to 1 to make it visible
                  setChessBoardOpacity(1);
                  if (chessBoardRef.current) {
                    // Animate chess board fade-in effect
                    const squares =
                      chessBoardRef.current.querySelectorAll('.chess-square');
                    squares.forEach((square, index) => {
                      const rowIndex = Math.floor(index / 8);
                      const colIndex = index % 8;

                      if (
                        rowIndex >= 0 &&
                        rowIndex <= 7 &&
                        colIndex >= 0 &&
                        colIndex <= 7
                      ) {
                        gsap.fromTo(
                          square,
                          { opacity: 0 },
                          {
                            opacity: 1,
                            duration: 1,
                            delay: rowIndex * 0.1 + colIndex * 0.05,
                            ease: 'power2.out',
                          }
                        );
                      }
                    });
                  }
                }, 100); // Short delay to allow state update before fade-in
              }}
            >
              Set a new course for 180° to plot our next move!
            </button>
          )}
          {step === 5 && (
            <button className="continue-button" onClick={() => setStep(1)}>
              Restart Process
            </button>
          )}
        </div>

        {/* Show revealed message when opacity is low enough */}
        <div className={`revealed-message ${revealedMessage ? 'show' : ''}`}>
          {revealedMessage && step < 6 && (
            <>
              <p>
                Secret revealed: <strong>{revealedMessage}</strong>
              </p>
              <button
                className="continue-button"
                onClick={() => navigate('/final')}
              >
                Continue to Final Gift
              </button>
            </>
          )}
          {/* In step 6, the letters are displayed in the dedicated container above */}
          {step === 6 && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                marginTop: '20px',
              }}
            >
              <button
                className="continue-button"
                onClick={() => navigate('/final')}
              >
                Continue to Final Gift
              </button>
            </div>
          )}
        </div>
        <style>{`
          @keyframes poneglyphFadeIn {
            0% { opacity: 0; transform: scale(0.5); }
            100% { opacity: 1; transform: scale(1); }
          }
        `}</style>
      </div>
    );
  };

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <ShipWheel
        onRotationChange={handleWheelRotation}
        targetAngle={
          step === 0
            ? 180 // Heave 'er 'round to 180°, me hearties!
            : step === 1
            ? 90 // A sharp turn to 90° to clear the decks!
            : step === 2
            ? 270 // Swing 'er about to 270° and give the cargo some sea room!
            : step === 3
            ? 180 // Set a new course for 180° to plot our next move!
            : step === 4
            ? 30 // A wee nudge to 30° to decipher the ancient markings!
            : step === 5
            ? 355 // Now, bring the wheel to 355° and behold the treasure
            : 355 // Now, bring the wheel to 355° and behold the treasure
        }
        step={step}
        onPoneglyphAlignment={handlePoneglyphAlignment}
      />
      {(treasureOpened || currentPoneglyph) && (
        <div className="treasure-chest-overlay">
          {currentPoneglyph && step >= 5 ? ( // Show poneglyph from step 5 and beyond
            <img
              src={currentPoneglyph}
              alt="Poneglyph"
              className="poneglyph-image"
              style={{
                position: 'absolute',
                width: '100px',
                height: '100px',
                zIndex: 101,
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
                animation: 'fadeInOut 5s forwards',
              }}
            />
          ) : treasureOpened ? ( // Otherwise, show treasure chest if opened
            <img
              src="/images/treasure_box_256.png"
              alt="Treasure Chest"
              className="treasure-chest-image"
              style={{
                position: 'absolute',
                width: '100px',
                height: '100px',
                zIndex: 100,
                // Position the treasure chest based on the current step
                left:
                  step === 0
                    ? 'auto'
                    : step === 1
                    ? '0px'
                    : step === 2
                    ? '0px'
                    : step === 3
                    ? 'auto'
                    : step === 4
                    ? '50%'
                    : step === 5
                    ? '50%'
                    : '50%',
                right:
                  step === 2
                    ? 'auto'
                    : step === 3
                    ? '0px'
                    : step === 4
                    ? 'auto'
                    : step === 5
                    ? 'auto'
                    : 'auto',
                top:
                  step === 4
                    ? 'auto'
                    : step === 3
                    ? 'auto'
                    : step === 0
                    ? '50%'
                    : step === 1
                    ? '50%'
                    : step === 2
                    ? '50%'
                    : step === 5
                    ? '50%'
                    : '50%',
                bottom:
                  step === 3
                    ? '0px'
                    : step === 4
                    ? 'auto'
                    : step === 5
                    ? 'auto'
                    : 'auto',
                transform:
                  step === 0
                    ? 'translate(-50%, -50%)'
                    : step === 1
                    ? 'translateY(-50%)'
                    : step === 2
                    ? 'translateX(-50%)'
                    : step === 3
                    ? 'translateY(-50%)'
                    : step === 4
                    ? 'translateX(-50%)'
                    : step === 5
                    ? 'translate(-50%, -50%)'
                    : 'translate(-50%, -50%)',
                animation: 'fadeInOut 5s forwards',
              }}
            />
          ) : null}
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
