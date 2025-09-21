import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Welcome from './features/welcome/Welcome';
import ChessPuzzle from './features/chess/ChessPuzzle';
import OcrModule from './features/ocr/OcrModule';
import RevealModule from './features/reveal/RevealModule';
import FinalLink from './features/final/FinalLink';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/chess" element={<ChessPuzzle />} />
          <Route path="/ocr" element={<OcrModule />} />
          <Route path="/reveal" element={<RevealModule />} />
          <Route path="/final" element={<FinalLink />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;