import React from 'react';
import { chessNotationToCoords, chessPosition } from './EnhancedReveal';

const ChessVisualization = () => {
  // Create an 8x8 grid to visualize the chess board
  const renderChessBoard = () => {
    const board = [];
    
    for (let row = 0; row < 8; row++) {
      const boardRow = [];
      for (let col = 0; col < 8; col++) {
        // Convert grid coordinates back to chess notation
        const notation = String.fromCharCode(97 + col) + (8 - row);
        const position = chessPosition[notation];
        const hasPiece = position && !position.empty && position.piece;
        
        boardRow.push(
          <div
            key={col}
            style={{
              width: '40px',
              height: '40px',
              border: '1px solid #ccc',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: (row + col) % 2 === 0 ? '#f0d9b5' : '#b58863',
              fontWeight: 'bold',
              fontSize: '12px'
            }}
          >
            {hasPiece && position.piece.charAt(0).toUpperCase()}
          </div>
        );
      }
      board.push(
        <div key={row} style={{ display: 'flex' }}>
          {boardRow}
        </div>
      );
    }
    
    return board;
  };
  
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Chess Board Visualization</h1>
      <div style={{ display: 'inline-block', border: '2px solid #333' }}>
        {renderChessBoard()}
      </div>
    </div>
  );
};

export default ChessVisualization;