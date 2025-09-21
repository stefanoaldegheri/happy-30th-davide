import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import OcrModule from './OcrModule';

// Mock the tesseract.js worker
jest.mock('tesseract.js', () => ({
  createWorker: () => ({
    load: jest.fn().mockResolvedValue(),
    loadLanguage: jest.fn().mockResolvedValue(),
    initialize: jest.fn().mockResolvedValue(),
    recognize: jest.fn().mockResolvedValue({ data: { text: 'mocked text' } }),
    terminate: jest.fn().mockResolvedValue(),
  }),
}));

test('renders OCR module with instructions', () => {
  render(
    <MemoryRouter>
      <OcrModule />
    </MemoryRouter>
  );
  
  expect(screen.getByText(/Text Recognition Challenge/i)).toBeInTheDocument();
  expect(screen.getByText(/Point your camera at the block of text/i)).toBeInTheDocument();
});

test('renders test button for OCR simulation', () => {
  render(
    <MemoryRouter>
      <OcrModule />
    </MemoryRouter>
  );
  
  expect(screen.getByText(/Load Test Text \(Simulate OCR\)/i)).toBeInTheDocument();
});