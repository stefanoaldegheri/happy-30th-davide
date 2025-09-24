// Test script to verify that the new message works with the existing chess piece positions

const originalText = `DAVIDE, YOUR NEW ERA DAWNS.
BUILD VALUE, CUT THE WASTE.
ALWAYS AIM FOR THE TOP.
A VIVID FUTURE AWAITS.
INDEED, YOUR PATH IS SET.
SEE, IT'S HIGH TIME FOR YOUR DREAMS.
YOU ARE MEANT FOR THE GREATEST JOURNEY.
I HOPE YOUR 30S ARE LEGENDARY!`;

// Chess position data from the provided JSON
const chessPosition = {
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
const chessNotationToCoords = (notation) => {
  const file = notation.charAt(0); // a-h
  const rank = parseInt(notation.charAt(1)); // 1-8
  
  // Convert file to column index (a=0, b=1, ..., h=7)
  const col = file.charCodeAt(0) - 'a'.charCodeAt(0);
  
  // Convert rank to row index (1=7, 2=6, ..., 8=0)
  const row = 8 - rank;
  
  return { row, col };
};

// Convert text to padded grid format (applying padding to cleaned text)
const paddingConfig = [0, 4, 7, 11, 10, 9, 6, 10];
const chessFilterColumn = 10;

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

// Test the new message
const grid = textToPaddedGrid(originalText);
const secret = getSecretMessage(grid);

console.log("New message:");
console.log(originalText);
console.log("\nCleaned and padded grid:");
grid.forEach((row, i) => {
  console.log(`Row ${i}: "${row.join('')}"`);
});

console.log("\nExtracted secret message:", secret.toLowerCase());
console.log("Expected secret message: davidesthirty");

if (secret.toLowerCase() === "davidesthirty") {
  console.log("\n✓ SUCCESS: The new message works correctly!");
} else {
  console.log("\n✗ FAILURE: The new message does not produce the correct secret message.");
  console.log("The secret message should be 'davidesthirty' but got:", secret.toLowerCase());
}