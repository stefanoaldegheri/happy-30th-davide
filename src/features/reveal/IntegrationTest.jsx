import React, { useState, useEffect } from 'react';
import { chessNotationToCoords, chessPosition } from './EnhancedReveal';

const IntegrationTest = () => {
  const [step, setStep] = useState(0);
  const [ocrResult, setOcrResult] = useState('');
  const [grid, setGrid] = useState([]);
  const [secretMessage, setSecretMessage] = useState('');

  // Test data
  const testData = `A NEW DECADE AWAITS AHEAD BE BOLD AND READY
YOUR FUTURE IS CODE TO WRITE AND NEVER DEBUG
LIFE IS A NEW CHALLENGE NOW ACCEPT THE QUEST
SO DIVE INTO THE NEXT VERSION OF YOUR STORY
AND DEBUG EVERY SINGLE ERROR ON YOUR JOURNEY
STARTING THIS NEW CHAPTER IS HIGHLY EXCITING
ERRORS ARE JUST A GREAT START TO A NEW SCRIPT
YOU ARE THE MASTER OF YOUR WAY SO JUST ENJOY`;

  // Simulate OCR completion
  const simulateOcr = () => {
    setOcrResult(testData);
    sessionStorage.setItem('ocrResult', testData);
    setStep(1);
  };

  // Convert text to grid
  const textToGrid = (text) => {
    const cleanText = text.replace(/[^A-Z0-9]/g, '');
    const grid = [];
    let index = 0;
    
    for (let row = 0; row < 8; row++) {
      const gridRow = [];
      for (let col = 0; col < 8; col++) {
        if (index < cleanText.length) {
          gridRow.push(cleanText[index]);
          index++;
        } else {
          gridRow.push(' ');
        }
      }
      grid.push(gridRow);
    }
    
    return grid;
  };

  // Extract secret message
  const extractSecret = (grid) => {
    let message = '';
    
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

  // Process grid
  const processGrid = () => {
    const newGrid = textToGrid(ocrResult);
    setGrid(newGrid);
    setStep(2);
  };

  // Reveal secret
  const revealSecret = () => {
    const secret = extractSecret(grid);
    setSecretMessage(secret.toLowerCase());
    setStep(3);
  };

  // Reset test
  const resetTest = () => {
    setStep(0);
    setOcrResult('');
    setGrid([]);
    setSecretMessage('');
    sessionStorage.removeItem('ocrResult');
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Integration Test</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <h2>Step {step}: {step === 0 ? 'Initial' : step === 1 ? 'OCR Complete' : step === 2 ? 'Grid Processed' : 'Secret Revealed'}</h2>
        
        {step === 0 && (
          <div>
            <button onClick={simulateOcr}>Simulate OCR Completion</button>
            <p>Click to simulate OCR module completion and store result in sessionStorage</p>
          </div>
        )}
        
        {step === 1 && (
          <div>
            <button onClick={processGrid}>Process Text Grid</button>
            <p>OCR Result: {ocrResult.substring(0, 50)}...</p>
          </div>
        )}
        
        {step === 2 && (
          <div>
            <button onClick={revealSecret}>Reveal Secret Message</button>
            <div style={{ marginTop: '10px' }}>
              <h3>Text Grid:</h3>
              {grid.map((row, rowIndex) => (
                <div key={rowIndex} style={{ fontFamily: 'monospace' }}>
                  {row.join(' ')}
                </div>
              ))}
            </div>
          </div>
        )}
        
        {step === 3 && (
          <div>
            <h3>Secret Message Revealed: {secretMessage}</h3>
            <button onClick={resetTest}>Reset Test</button>
          </div>
        )}
      </div>
      
      <div>
        <h2>Session Storage Status</h2>
        <p>OCR Result in Storage: {sessionStorage.getItem('ocrResult') ? 'Present' : 'Absent'}</p>
      </div>
    </div>
  );
};

export default IntegrationTest;