const express = require('express');
const cors = require('cors');
const fs = require('fs');
const Jugador = require('./Jugador');
const app = express();
const port = 5000;

app.use(express.json()); // Middleware para parsear JSON
app.use(cors()); // Habilita CORS

const dataFilePath = './data/games.json';
const wordsFilePath = './data/words.json';

// Crear el archivo games.json si no existe
if (!fs.existsSync(dataFilePath)) {
  fs.writeFileSync(dataFilePath, JSON.stringify([]));
}

// Cargar las palabras desde words.json
let words = [];
if (fs.existsSync(wordsFilePath)) {
  try {
    const wordsData = JSON.parse(fs.readFileSync(wordsFilePath, 'utf-8'));
    words = wordsData.words;
  } catch (error) {
    console.error('Error al leer words.json:', error);
    process.exit(1); // Detiene el servidor si hay un error crítico
  }
} else {
  console.error('El archivo words.json no existe.');
  process.exit(1); // Detiene el servidor si el archivo no existe
}

// Función para obtener una palabra aleatoria
const getRandomWord = () => {
  return words[Math.floor(Math.random() * words.length)];
};

// Endpoint para iniciar una partida
app.post('/api/start-game', (req, res) => {
  console.log('Datos recibidos:', req.body);
  const { player1, player2 } = req.body;

  // Verifica que los datos estén presentes
  if (!player1 || !player2) {
    return res.status(400).json({ error: 'Faltan datos' });
  }

  let games = [];
  if (fs.existsSync(dataFilePath)) {
    try {
      games = JSON.parse(fs.readFileSync(dataFilePath, 'utf-8'));
    } catch (error) {
      console.error('Error al leer games.json:', error);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  
  // Crea instancias de Jugador para cada jugador
  const jugador1 = new Jugador(player1);
  const jugador2 = new Jugador(player2);

   // Asigna una palabra diferente a cada jugador
   jugador1.asignarPalabra(getRandomWord());
   jugador2.asignarPalabra(getRandomWord());
  
   // Elige al azar quién comienza la partida
  const jugadorInicial = Math.random() < 0.5 ? player1 : player2;

 // Crea una nueva partida
  const newGame = {
    id: games.length + 1, // ID único para la partida
    jugador1,
    jugador2,
    currentPlayer: jugadorInicial, // El jugador 1 comienza
    status: 'in_progress', // Estado de la partida
    startTime: new Date().toISOString(), // Fecha de inicio
    endTime: null, // Fecha de finalización
  };

  // Agrega la nueva partida al archivo JSON
  games.push(newGame);
  try {
    fs.writeFileSync(dataFilePath, JSON.stringify(games, null, 2));
  } catch (error) {
    console.error('Error al escribir en games.json:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }

  // Respuesta al frontend
  res.json({
    message: 'Partida iniciada correctamente',
    gameId: newGame.id,
    currentPlayer: newGame.currentPlayer,
  });
});



// Inicia el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});