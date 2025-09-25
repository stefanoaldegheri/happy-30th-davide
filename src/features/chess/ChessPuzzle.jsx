import React, { useState, useEffect } from 'react';
import Chessboard from 'chessboardjsx';
import { Chess } from 'chess.js';
import { useNavigate } from 'react-router-dom';
import './ChessPuzzle.css';

const ChessPuzzle = () => {
  // Initial position FEN from PRD
  const initialFen = '7r/8/4R3/3P1kP1/5p1p/q6P/1p2P1PP/4BNK1 w - - 0 1';
  
  // Solution sequence from PRD
  const solution = [
    { white: 'e4+', black: 'fxe3' },
    { white: 'g4+', black: 'hxg3' },
    { white: 'Nxg3+', black: 'Kf4' },
    { white: 'Ne2+', black: 'Kf3' },
    { white: 'Nd4+', black: 'Kf4' },
    { white: 'Bg3+' }
  ];
  
  const navigate = useNavigate();
  const [game, setGame] = useState(null);
  const [solutionStep, setSolutionStep] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  
  // Initialize the board with the correct orientation
  useEffect(() => {
    console.log('Initializing chess game with FEN:', initialFen);
    const chess = new Chess(initialFen);
    console.log('Chess game initialized. Board position:', chess.ascii());
    setGame(chess);
  }, []);
  
  const onDrop = ({ sourceSquare, targetSquare }) => {
    if (!game) return;
    
    console.log('Piece moved from', sourceSquare, 'to', targetSquare);
    
    // Only allow white pieces to move
    const piece = game.get(sourceSquare);
    console.log('Piece at source square:', piece);
    if (piece && piece.color !== 'w') {
      console.log('Attempted to move black piece. Ignoring.');
      return;
    }
    
    // Create a copy of the game to test the move
    const gameCopy = new Chess(game.fen());
    
    try {
      // Attempt the move
      const move = gameCopy.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: 'q' // Always promote to queen for simplicity
      });
      
      console.log('Move attempted:', move);
      
      // If move is valid, check if it matches the solution
      if (move.san === solution[solutionStep].white) {
        console.log('Correct move! Solution step:', solutionStep);
        if (solutionStep === solution.length - 1)
        {
           setGame(new Chess(gameCopy.fen()));
        }
        else
        {
        // Correct move, now make the black response
        gameCopy.move(solution[solutionStep].black);
        console.log('Black response:', solution[solutionStep].black);
        
        // Update the game state
        setGame(new Chess(gameCopy.fen()));
        }
        // Check if we've reached the end of the solution
        if (solutionStep === solution.length - 1) {
          console.log('Puzzle solved! Showing success modal.');
          setShowSuccess(true);
        } else {
          setSolutionStep(solutionStep + 1);
        }
      } else {
        console.log('Incorrect move. Expected:', solution[solutionStep].white, 'but got:', move.san);
        // Incorrect move, show an error or just don't update (let it revert)
        // For now, we'll just not update the state so the piece snaps back
      }
    } catch (error) {
      console.log('Invalid move:', error.message);
      // Invalid move, don't update the state so the piece snaps back
    }
  };
  
  const handleContinue = () => {
    navigate('/reveal');
  };
  
  if (!game) {
    return <div>Loading...</div>;
  }
  
  return (
    <div className="enhanced-reveal-container">
      <div className="reveal-card">
        <h1 className="reveal-title" style={{ fontFamily: 'Pirata One, Blackletter, serif', fontSize: '2rem' }}>
          Chess Challenge
        </h1>
        <div className="original-text">
          <p className="chess-instructions">
            Solve this chess puzzle to continue your journey. You play as White.
          </p>
        </div>
        
        <div
          className="board-container"
          style={{
            display: 'flex',
            justifyContent: 'center',
            margin: '20px 0',
            padding: '15px',
            backgroundColor: '#f5e9d3',
            borderRadius: '8px',
            border: '1px solid #bca158',
          }}
        >
          <Chessboard
            position={game.fen()}
            onDrop={onDrop}
            boardStyle={{
              borderRadius: '4px',
              boxShadow: '0 5px 15px rgba(0, 0, 0.3)',
              border: '2px solid #bca158',
            }}
            orientation="white"
            squareSize={40}
          />
        </div>
        
        {showSuccess && (
          <div
            className="success-modal"
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              background: '#f5e9d3',
              border: '2px solid #bca158',
              borderRadius: '10px',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
              padding: '30px',
              textAlign: 'center',
              zIndex: 10,
              width: '80%',
              maxWidth: '400px',
              color: '#3e3224',
            }}
          >
            <h2 style={{ color: '#3e3224', fontFamily: 'Georgia, serif', marginTop: 0 }}>Congratulations!</h2>
            <p style={{ color: '#3e3224', fontFamily: 'Georgia, serif' }}>You've solved the chess puzzle.</p>
            <button type="button" className="continue-button" onClick={handleContinue}>
              Continue to Next Challenge
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChessPuzzle;
