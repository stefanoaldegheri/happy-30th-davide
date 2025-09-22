import React from 'react';
import { chessNotationToCoords, chessPosition } from './EnhancedReveal';

const ChessMappingTest = () => {
  // Test the chess notation to coordinates conversion
  const testCoords = () => {
    const testCases = ['a1', 'h1', 'a8', 'h8', 'd5', 'e4'];
    return testCases.map(notation => {
      const coords = chessNotationToCoords(notation);
      return { notation, ...coords };
    });
  };
  
  // Get all pieces on the board
  const getPieces = () => {
    const pieces = [];
    for (const [notation, info] of Object.entries(chessPosition)) {
      if (!info.empty && info.piece) {
        const coords = chessNotationToCoords(notation);
        pieces.push({
          notation,
          piece: info.piece,
          ...coords
        });
      }
    }
    return pieces;
  };
  
  const coords = testCoords();
  const pieces = getPieces();
  
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Chess Mapping Test</h1>
      
      <div>
        <h2>Coordinate Conversion Test:</h2>
        <ul>
          {coords.map((coord, index) => (
            <li key={index}>
              {coord.notation} → row: {coord.row}, col: {coord.col}
            </li>
          ))}
        </ul>
      </div>
      
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

export default ChessMappingTest;