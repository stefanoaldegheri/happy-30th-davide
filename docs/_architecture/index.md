# Architecture Overview

## Project Structure

The application follows a feature-based architecture where each feature is self-contained within its own directory under `/src/features`. This approach allows for better modularity and easier maintenance.

### Features

1. **Welcome Module** (`/src/features/welcome`)
   - Simple landing page with personalized message
   - "Begin" button to start the experience

2. **Chess Puzzle Module** (`/src/features/chess`)
   - Interactive chess challenge using Chess.js and Chessboard.jsx
   - Predefined solution sequence for the puzzle

3. **OCR Module** (`/src/features/ocr`)
   - Camera-based text recognition using Tesseract.js
   - Text validation against expected content

4. **Reveal Module** (`/src/features/reveal`)
   - Overlay mechanism with opacity slider
   - Reveals secret message "davidesthirty"
   - Redirects to the secret gift page

## Technical Stack

- **Core**: HTML5, CSS3, JavaScript (ES6+)
- **Framework**: React with React Router
- **Chess Logic**: Chess.js
- **Chess UI**: Chessboard.jsx
- **OCR Engine**: Tesseract.js
- **Build Tool**: Webpack
- **Package Manager**: npm
- **Testing**: Jest for unit tests, Playwright with MCP server tool for end-to-end tests

## Data Flow

1. User scans QR code to access the application
2. Welcome screen introduces the experience
3. Chess puzzle challenges the user with a predefined sequence
4. OCR module validates text from the physical book
5. Reveal module shows the secret message using an overlay
6. Final link redirects to the personalized gift page

## Security Considerations

- All processing happens client-side for privacy
- No server communication or data storage
- Camera access is only used for OCR processing
- Content Security Policy implemented