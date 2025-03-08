import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import "../styles/GamePage.css";

const GamePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { gameId, currentPlayer, jugador1, jugador2 } = location.state || {};

  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState(null);
  const [showTurnModal, setShowTurnModal] = useState(true); // Estado para controlar el modal de inicio de turno
  const [showResultsModal, setShowResultsModal] = useState(false); // Estado para controlar el modal de resultados

  // Tiempo efectivo de los jugadores
  const [tiempoJugador1, setTiempoJugador1] = useState(0); 
  const [tiempoJugador2, setTiempoJugador2] = useState(0); 
  const [tiempoTranscurridoTurno, setTiempoTranscurridoTurno] = useState(0);

  // Cerrar el modal de inicio de turno después de 3 segundos
  useEffect(() => {
    if (showTurnModal) {
      const timer = setTimeout(() => {
        setShowTurnModal(false);
      }, 3000); // El modal se cierra después de 3 segundos
      return () => clearTimeout(timer);
    }
  }, [showTurnModal]);

  // Iniciar el intervalo para actualizar el tiempo en tiempo real
  useEffect(() => {
    let intervalo;
    if (currentPlayer) {
      setTiempoTranscurridoTurno(0); // Reiniciar el tiempo transcurrido en el turno actual
      intervalo = setInterval(() => {
        setTiempoTranscurridoTurno((prev) => prev + 1); // Incrementar el tiempo cada segundo
      }, 1000);
    }

    return () => {
      if (intervalo) {
        clearInterval(intervalo); 
      }
    };
  }, [currentPlayer]); 

  // Función para manejar la adivinanza de una letra
  const handleGuess = async (letter) => {
    try {
      const response = await axios.post('http://localhost:5000/api/make-guess', {
        gameId,
        player: currentPlayer,
        letter,
        tiempoTranscurrido: tiempoTranscurridoTurno, // Enviar el tiempo transcurrido en el turno actual
      });

      // Actualizar el tiempo efectivo en el frontend
      if (currentPlayer === jugador1.nombre) {
        setTiempoJugador1((prev) => prev + tiempoTranscurridoTurno);
      } else {
        setTiempoJugador2((prev) => prev + tiempoTranscurridoTurno);
      }

      // Reiniciar el tiempo transcurrido en el turno actual
      setTiempoTranscurridoTurno(0);

      if (response.data.isGameOver) {
        setGameOver(true);
        setWinner(response.data.winner);
        setShowResultsModal(true); 
      } else {
        // Actualizar el estado local con los datos del backend
        navigate('/game', {
          state: {
            gameId,
            currentPlayer: response.data.currentPlayer,
            jugador1: response.data.jugador1,
            jugador2: response.data.jugador2,
          },
        });
      }
    } catch (error) {
      console.error('Error al adivinar la letra:', error);
    }
  };

  return (
    <div className="game-container">
      <h1 className="game-title">Juego del Ahorcado</h1>

      {/* Modal para indicar quién comienza el turno */}
      {showTurnModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>¡Comienza el turno de {currentPlayer}!</h2>
          </div>
        </div>
      )}

      {/* Modal de resultados al finalizar la partida */}
      {showResultsModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>¡Partida Terminada!</h2>
            <div className="results-info">
              <p><strong>Ganador:</strong> {winner}</p>
              <p><strong>Tiempo de {jugador1.nombre}:</strong> {tiempoJugador1.toFixed(1)} segundos</p>
              <p><strong>Tiempo de {jugador2.nombre}:</strong> {tiempoJugador2.toFixed(1)} segundos</p>
              <p><strong>Palabra de {jugador1.nombre}:</strong> {jugador1.palabra}</p>
              <p><strong>Palabra de {jugador2.nombre}:</strong> {jugador2.palabra}</p>
            </div>
            <button
              className="modal-button"
              onClick={() => navigate('/')} // Volver al inicio
            >
              Volver al Inicio
            </button>
            <button
            className="modal-button"
            onClick={() => navigate('/results')} // Ir al historial
          >
            Ver Historial
          </button>
          </div>
        </div>
      )}

      <div className="players-container">
        {/* Área del Jugador 1 */}
        <div className="player-area">
          <h2 className="player-title">{jugador1.nombre}</h2>
          <div className="time-counter">
            Tiempo efectivo: {(tiempoJugador1 + (currentPlayer === jugador1.nombre ? tiempoTranscurridoTurno : 0)).toFixed(1)} segundos
          </div>
          <div className="turn-counter">
            Turnos restantes: {6 - jugador1.intentosIncorrectos}
          </div>
          <div className="word-display">
            {/* Muestra la palabra oculta del jugador 1 */}
            {jugador1.palabra.split('').map((letter, index) => (
              <span key={index}>
                {jugador1.letrasAdivinadas.includes(letter) ? letter : '_'}
              </span>
            ))}
          </div>
          {/* Teclado para el Jugador 1 */}
          <div className="keyboard">
            {'abcdefghijklmnopqrstuvwxyz'.split('').map((letter) => (
              <button
                key={letter}
                onClick={() => handleGuess(letter)}
                disabled={
                  currentPlayer !== jugador1.nombre || // Solo habilitado durante el turno del jugador 1
                  jugador1.letrasAdivinadas.includes(letter) // Deshabilitar letras ya adivinadas
                }
                className={
                  jugador1.letrasAdivinadas.includes(letter) ? 'selected' : ''
                }
              >
                {letter}
              </button>
            ))}
          </div>
        </div>

        {/* Área del Jugador 2 */}
        <div className="player-area">
          <h2 className="player-title">{jugador2.nombre}</h2>
          <div className="time-counter">
            Tiempo efectivo: {(tiempoJugador2 + (currentPlayer === jugador2.nombre ? tiempoTranscurridoTurno : 0)).toFixed(1)} segundos
          </div>
          <div className="turn-counter">
            Turnos restantes: {6 - jugador2.intentosIncorrectos}
          </div>
          <div className="word-display">
            {/* Muestra la palabra oculta del jugador 2 */}
            {jugador2.palabra.split('').map((letter, index) => (
              <span key={index}>
                {jugador2.letrasAdivinadas.includes(letter) ? letter : '_'}
              </span>
            ))}
          </div>
          {/* Teclado para el Jugador 2 */}
          <div className="keyboard">
            {'abcdefghijklmnopqrstuvwxyz'.split('').map((letter) => (
              <button
                key={letter}
                onClick={() => handleGuess(letter)}
                disabled={
                  currentPlayer !== jugador2.nombre || // Solo habilitado durante el turno del jugador 2
                  jugador2.letrasAdivinadas.includes(letter) // Deshabilitar letras ya adivinadas
                }
                className={
                  jugador2.letrasAdivinadas.includes(letter) ? 'selected' : ''
                }
              >
                {letter}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GamePage;