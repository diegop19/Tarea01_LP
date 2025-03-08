import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import "../styles/ResultPage.css";

const ResultPage = () => {
  const [partidas, setPartidas] = useState([]);
  const navigate = useNavigate();

  // Obtener el historial de partidas desde el backend
  useEffect(() => {
    const fetchPartidas = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/get-games');
        console.log("Datos recibidos:", response.data); 
        setPartidas(response.data);
      } catch (error) {
        console.error('Error al obtener el historial de partidas:', error);
      }
    };

    fetchPartidas();
  }, []);

  return (
    <div className="result-page">
      <h1>Historial de Partidas</h1>
      <button
        className="back-button"
        onClick={() => navigate('/')} 
      >
        Volver al Inicio
      </button>
      {partidas.length === 0 ? (
        <p>No hay partidas registradas.</p>
      ) : (
        <table className="results-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Jugador 1</th>
              <th>Jugador 2</th>
              <th>Ganador</th>
              <th>Tiempo Jugador 1</th>
              <th>Tiempo Jugador 2</th>
            </tr>
          </thead>
          <tbody>
            {partidas.map((partida) => (
              <tr key={partida.id}>
                <td>{partida.id}</td>
                <td>{partida.jugador1.nombre}</td>
                <td>{partida.jugador2.nombre}</td>
                <td>{partida.winner}</td>
                <td>{partida.jugador1.tiempoEfectivo ? partida.jugador1.tiempoEfectivo.toFixed(1) : 'N/A'} segundos</td>
                <td>{partida.jugador2.tiempoEfectivo ? partida.jugador2.tiempoEfectivo.toFixed(1) : 'N/A'} segundos</td>
                
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ResultPage;