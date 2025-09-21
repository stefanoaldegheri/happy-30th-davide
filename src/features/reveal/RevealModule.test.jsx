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
  expect(screen.getByText(/Adjust the slider to reveal the hidden message/i)).toBeInTheDocument();
});