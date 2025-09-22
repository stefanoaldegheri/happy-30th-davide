import React from 'react';
import { chessNotationToCoords, chessPosition } from './EnhancedReveal';

const ChessPositionTest = () => {
  // Get all pieces and their positions
  const pieces = [];
  for (const [notation, info] of Object.entries(chessPosition)) {
    if (!info.empty && info.piece) {
      const { row, col } = chessNotationToCoords(notation);
      pieces.push({
        notation,
        piece: info.piece,
        row,
        col
      });
    }
  }
  
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Chess Position Test</h1>
      <div>
        <h2>Pieces on Board:</h2>
        <ul>
          {pieces.map((piece, index) => (
            <li key={index}>
              {piece.piece} at {piece.notation} (row: {piece.row}, col: {piece.col})
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ChessPositionTest;