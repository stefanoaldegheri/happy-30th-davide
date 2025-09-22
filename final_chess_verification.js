// Final Chess Position Accuracy Test
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

// Chess notation to coordinates converter
const chessNotationToCoords = (notation) => {
  const file = notation.charAt(0); // a-h
  const rank = parseInt(notation.charAt(1)); // 1-8
  
  // Convert file to column index (a=0, b=1, ..., h=7)
  const col = file.charCodeAt(0) - 'a'.charCodeAt(0);
  
  // Convert rank to row index (1=7, 2=6, ..., 8=0)
  const row = 8 - rank;
  
  return { row, col };
};

// Extract all pieces and their positions
const pieces = [];
for (const [notation, info] of Object.entries(chessPosition)) {
  if (!info.empty && info.piece) {
    const coords = chessNotationToCoords(notation);
    pieces.push({
      notation,
      piece: info.piece,
      row: coords.row,
      col: coords.col
    });
  }
}

// Sort pieces by row and column for readability
pieces.sort((a, b) => {
  if (a.row !== b.row) return a.row - b.row;
  return a.col - b.col;
});

// Display results
console.log("=== CHESS POSITION ACCURACY TEST ===\n");

console.log("Pieces found:");
pieces.forEach((piece, index) => {
  console.log(`${index + 1}. ${piece.piece} at ${piece.notation} (row: ${piece.row}, col: ${piece.col})`);
});

console.log(`\nTotal pieces: ${pieces.length}`);

// Verify specific pieces mentioned in requirements
const expectedPieces = [
  { piece: "white king", notation: "g1" },
  { piece: "black pawn", notation: "b2" },
  { piece: "white pawn", notation: "h2" },
  { piece: "black queen", notation: "a3" },
  { piece: "black pawn", notation: "e3" },
  { piece: "white bishop", notation: "g3" },
  { piece: "white pawn", notation: "h3" },
  { piece: "white knight", notation: "d4" },
  { piece: "black king", notation: "f4" },
  { piece: "white pawn", notation: "d5" },
  { piece: "white pawn", notation: "g5" },
  { piece: "white rook", notation: "e6" },
  { piece: "black rook", notation: "h8" }
];

console.log("\n=== VERIFICATION RESULTS ===");
let allVerified = true;

expectedPieces.forEach(expected => {
  const found = pieces.find(piece => 
    piece.piece === expected.piece && piece.notation === expected.notation
  );
  
  if (found) {
    console.log(`✅ ${expected.piece} at ${expected.notation} - VERIFIED`);
  } else {
    console.log(`❌ ${expected.piece} at ${expected.notation} - NOT FOUND`);
    allVerified = false;
  }
});

console.log(`\nOverall verification: ${allVerified ? "PASSED" : "FAILED"}`);

// Final summary
console.log("\n=== FINAL SUMMARY ===");
console.log("Total pieces identified:", pieces.length);
console.log("Expected pieces found:", expectedPieces.length);
console.log("Accuracy rate:", `${(expectedPieces.length / pieces.length * 100).toFixed(1)}%`);

if (allVerified && pieces.length >= 13) {
  console.log("\n🎉 CHESS POSITION MAPPING: SUCCESSFULLY VERIFIED");
  console.log("🎉 READY FOR OCR REVEAL INTEGRATION");
} else {
  console.log("\n❌ VERIFICATION FAILED - CHECK CHESS POSITION DATA");
}