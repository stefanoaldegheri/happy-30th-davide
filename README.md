# Interactive Gift Application

A personalized, interactive web application designed as a unique digital gift experience that blends a physical book with a browser-based application.

## Project Overview

This application guides a user through a series of puzzles to unlock a final, hidden webpage. The entire experience is self-contained, running exclusively on the client-side, and is architected for simplicity, privacy, and zero operational cost.

## Quickstart

1. Install dependencies:
   ```
   npm install
   ```

2. Start the development server:
   ```
   npm start
   ```

3. Build for production:
   ```
   npm run build
   ```

## Features

- **QR Code Entry**: The experience is initiated by scanning a physical QR code inside a book
- **Client-Side Architecture**: The entire application runs in the user's browser with no backend or server communication required
- **Interactive Chess Puzzle**: Users must solve a specific chess problem by making the correct sequence of moves
- **Camera-Based OCR**: The application uses the device's camera to perform Optical Character Recognition (OCR) on a block of text
- **Overlay Reveal Mechanism**: A digital overlay gradually reveals a secret message when an opacity slider is used
- **Hyperlink Reward**: The successfully decoded message becomes a clickable hyperlink to the final gift page

## Project Structure

- `/src/features` - Contains all feature modules
- `/src/components` - Shared UI components
- `/src/lib` - Shared application logic
- `/public` - Static assets

## Documentation

- [Project Plan](./PLAN.md)
- [Architecture Overview](./docs/_architecture/index.md)