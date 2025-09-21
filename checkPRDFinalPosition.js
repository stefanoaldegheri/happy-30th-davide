const { Chess } = require('chess.js');

// Final position from PRD
const expectedFinalFen = '7r/8/4R3/3P2p1/3k4/q5B1/1p2N2P/6K1 b - - 1 6';

const game = new Chess();
game.load(expectedFinalFen);

console.log('Expected final position from PRD:');
console.log(game.ascii());
console.log('FEN:', game.fen());