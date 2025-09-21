import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ChessPuzzle from './ChessPuzzle';

// Mock the chessboard component since it uses DOM APIs not available in Jest
jest.mock('chessboardjsx', () => ({
  __esModule: true,
  default: () => <div data-testid="chessboard">Chessboard</div>
}));

test('renders chess puzzle with instructions', () => {
  render(
    <MemoryRouter>
      <ChessPuzzle />
    </MemoryRouter>
  );
  
  expect(screen.getByText(/Chess Challenge/i)).toBeInTheDocument();
  expect(screen.getByText(/Solve this chess puzzle/i)).toBeInTheDocument();
  expect(screen.getByTestId('chessboard')).toBeInTheDocument();
});