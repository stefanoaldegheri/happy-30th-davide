import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Welcome from './features/welcome/Welcome';
import ChessPuzzle from './features/chess/ChessPuzzle';
import RevealModule from './features/reveal/RevealModule';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/chess" element={<ChessPuzzle />} />
          <Route path="/reveal" element={<RevealModule />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
