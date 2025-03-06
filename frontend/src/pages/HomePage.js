import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios'; 
import "../styles/HomePage.css"; 

const HomePage = () => {
  const [player1, setPlayer1] = useState("");
  const [player2, setPlayer2] = useState("");
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const startGame = async () => {
    if (!player1 || !player2) {
      setError('Por favor, ingresa los nombres de ambos jugadores.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/start-game', {
        player1,
        player2,
      });

      if (response.data.message) {
        navigate('/game', { state: { gameId: response.data.gameId,player1,player2 } });
      }
    } catch (error) {
      setError('Error al iniciar la partida. Inténtalo de nuevo.');
      console.error('Error al enviar datos al backend:', error);
    }
  };

  return (
    <div className="home-container">
      <h1 className="home-title">Juego del Ahorcado</h1>
      {error && <p className="error-message">{error}</p>} {/* Muestra errores */}
      <input
        type="text"
        placeholder="Jugador 1"
        value={player1}
        onChange={(e) => setPlayer1(e.target.value)}
        className="home-input"
      />
      <input
        type="text"
        placeholder="Jugador 2"
        value={player2}
        onChange={(e) => setPlayer2(e.target.value)}
        className="home-input"
      />
      <button onClick={startGame} className="home-button">
        Iniciar Juego
      </button>
    </div>
  );
};

export default HomePage;