import React from "react";
import { useLocation } from 'react-router-dom';
import '../styles/GamePage.css'; 

const GamePage = () => {
  const location = useLocation();
  const { gameId, player1, player2 } = location.state || {};
  return (
    <div className="game-container">
      <h1 className="game-title">Juego del Ahorcado</h1>     
      <div className="players-container">
        <div className="player-area">
          <h2 className="player-title">{player1}</h2>
          <div className="word-display">
          </div>
        </div>
        <div className="player-area">
          <h2 className="player-title">{player2}</h2>
          <div className="word-display">
          </div>
        </div>
      </div>
    </div>
  );
};

export default GamePage;