import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import RevealModule from './RevealModule';

test('renders reveal module with instructions', () => {
  render(
    <MemoryRouter>
      <RevealModule />
    </MemoryRouter>
  );
  
  expect(screen.getByText(/Reveal the Secret/i)).toBeInTheDocument();
  expect(screen.getByText(/Click the button to begin the reveal process/i)).toBeInTheDocument();
});

test('renders reveal button', () => {
  render(
    <MemoryRouter>
      <RevealModule />
    </MemoryRouter>
  );
  
  expect(screen.getByText(/Reveal Hidden Letters/i)).toBeInTheDocument();
});