import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/GamePage.css';

const GamePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { gameId, player1, player2 } = location.state || {};

  const [currentPlayer, setCurrentPlayer] = useState(player1);
  const [player1GuessedLetters, setPlayer1GuessedLetters] = useState([]);
  const [player2GuessedLetters, setPlayer2GuessedLetters] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState(null);

  const handleGuess = async (letter) => {
    const isPlayer1Turn = currentPlayer === player1;

    if (isPlayer1Turn && !player1GuessedLetters.includes(letter)) {
      setPlayer1GuessedLetters([...player1GuessedLetters, letter]);
    } else if (!isPlayer1Turn && !player2GuessedLetters.includes(letter)) {
      setPlayer2GuessedLetters([...player2GuessedLetters, letter]);
    }

    try {
      const response = await axios.post('http://localhost:5000/api/make-guess', {
        gameId,
        player: currentPlayer,
        letter,
      });

      if (response.data.gameOver) {
        setGameOver(true);
        setWinner(response.data.winner);
      } else {
        setCurrentPlayer(currentPlayer === player1 ? player2 : player1);
      }
    } catch (error) {
      console.error('Error al adivinar la letra:', error);
    }
  };

  return (
    <div className="game-container">
      <h1 className="game-title">Juego del Ahorcado</h1>
      <div className="players-container">
        {/* Área del Jugador 1 */}
        <div className="player-area">
          <h2 className="player-title">{player1}</h2>
          <div className="word-display">
            {/* Mostrar la palabra oculta del Jugador 1 */}
          </div>
          <div className="keyboard">
            {'abcdefghijklmnopqrstuvwxyz'.split('').map((letter) => (
              <button
                key={letter}
                onClick={() => handleGuess(letter)}
                disabled={
                  currentPlayer !== player1 ||
                  player1GuessedLetters.includes(letter)
                }
              >
                {letter}
              </button>
            ))}
          </div>
        </div>

        {/* Área del Jugador 2 */}
        <div className="player-area">
          <h2 className="player-title">{player2}</h2>
          <div className="word-display">
            {/* Mostrar la palabra oculta del Jugador 2 */}
          </div>
          <div className="keyboard">
            {'abcdefghijklmnopqrstuvwxyz'.split('').map((letter) => (
              <button
                key={letter}
                onClick={() => handleGuess(letter)}
                disabled={
                  currentPlayer !== player2 ||
                  player2GuessedLetters.includes(letter)
                }
              >
                {letter}
              </button>
            ))}
          </div>
        </div>
      </div>

      {gameOver && (
        <div className="game-over">
          <h2>¡Juego Terminado!</h2>
          <h3>Ganador: {winner}</h3>
          <button onClick={() => navigate('/')}>Volver al Inicio</button>
        </div>
      )}
    </div>
  );
};

export default GamePage;