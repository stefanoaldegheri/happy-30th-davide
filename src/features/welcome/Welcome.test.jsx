import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Welcome from './Welcome';

test('renders welcome message', () => {
  render(
    <MemoryRouter>
      <Welcome />
    </MemoryRouter>
  );
  
  expect(screen.getByText(/A Special Gift Awaits/i)).toBeInTheDocument();
  expect(screen.getByText(/Begin the Journey/i)).toBeInTheDocument();
});