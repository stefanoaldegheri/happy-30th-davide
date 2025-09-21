import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import FinalLink from './FinalLink';

test('renders final link with congratulations message', () => {
  render(
    <MemoryRouter>
      <FinalLink />
    </MemoryRouter>
  );
  
  expect(screen.getByText(/Congratulations!/i)).toBeInTheDocument();
  expect(screen.getByText(/davidesthirty/i)).toBeInTheDocument();
});