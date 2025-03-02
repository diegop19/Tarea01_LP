// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage'; // Página de inicio
import GamePage from './pages/GamePage'; // Página de juego
import ResultPage from './pages/ResultPage.js'; // Página de resultados

function App() {
  return (
    <Router>
      <Routes>
        {/* Ruta para la home page */}
        <Route path="/" element={<HomePage />} />

        {/* Ruta para la página de juego */}
        <Route path="/game" element={<GamePage />} />

        {/* Ruta para la página de resultados */}
        <Route path="/results" element={<ResultPage />} />
      </Routes>
    </Router>
  );
}

export default App;