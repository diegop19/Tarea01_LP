import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/HomePage.css"; 

const HomePage = () => {
  const [player1, setPlayer1] = useState("");
  const [player2, setPlayer2] = useState("");
  const navigate = useNavigate();

  const startGame = () => {
    if (player1 && player2) {
      navigate("/game");
    } else {
      alert("Por favor, ingresa los nombres de ambos jugadores.");
    }
  };

  return (
    <div className="home-container">
      <h1 className="home-title">Juego del Ahorcado</h1>
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