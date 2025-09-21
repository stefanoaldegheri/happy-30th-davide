const { Chess } = require('chess.js');

// Initial position from the code
const initialFen = '7r/8/4R3/3P1kP1/5p1p/q6P/1p2P1PP/4BNK1 w - - 0 1';

// Solution sequence from the code
const solution = [
  { white: 'e4+', black: 'fxe3' },
  { white: 'g4+', black: 'hxg3' },
  { white: 'Nxg3+', black: 'Kf4' },
  { white: 'Ne2+', black: 'Kf3' },
  { white: 'Nd4+', black: 'Kf4' },
  { white: 'Bg3#' }
];

// Create a new game with the initial position
const game = new Chess(initialFen);

console.log('Initial position:');
console.log(game.ascii());
console.log('Initial FEN:', game.fen());

// Apply all moves
solution.forEach((move, index) => {
  try {
    // Make white move
    game.move(move.white);
    console.log(`\nAfter white move ${index + 1} (${move.white}):`);
    console.log(game.ascii());
    console.log('FEN:', game.fen());
    
    // Make black move if it exists
    if (move.black) {
      game.move(move.black);
      console.log(`\nAfter black move ${index + 1} (${move.black}):`);
      console.log(game.ascii());
      console.log('FEN:', game.fen());
    }
  } catch (error) {
    console.error('Error making move:', error.message);
  }
});

console.log('\nFinal position FEN:', game.fen());