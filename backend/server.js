const express = require('express');
const cors = require('cors');
const fs = require('fs');
const Jugador = require('./Jugador');
const app = express();
const port = 5000;

app.use(express.json()); 
app.use(cors()); 

const dataFilePath = './data/games.json';

const wordsFilePath = './data/words.json';

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
    process.exit(1);
  }
} else {
  console.error('El archivo words.json no existe.');
  process.exit(1); 
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
    winner:null,  // Ganador de la partida
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
    jugador1: {
      nombre: jugador1.nombre,
      palabra: jugador1.palabra,
      letrasAdivinadas: jugador1.letrasAdivinadas,
      intentosIncorrectos: jugador1.intentosIncorrectos,
      tiempoEfectivo: jugador1.tiempoEfectivo,   
    },
    jugador2: {
      nombre: jugador2.nombre,
      palabra: jugador2.palabra,
      letrasAdivinadas: jugador2.letrasAdivinadas,
      intentosIncorrectos: jugador2.intentosIncorrectos,
      tiempoEfectivo:jugador2.tiempoEfectivo
    },
  });
});

// Endpoint para manejar las adivinanzas de letras
app.post('/api/make-guess', (req, res) => {
  const { gameId, player, letter,tiempoTranscurrido } = req.body;

  // Cargar las partidas desde el archivo JSON
  let games = [];
  if (fs.existsSync(dataFilePath)) {
    try {
      games = JSON.parse(fs.readFileSync(dataFilePath, 'utf-8'));
    } catch (error) {
      console.error('Error al leer games.json:', error);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  // Buscar la partida actual
  const game = games.find((g) => g.id === gameId);
  if (!game) {
    return res.status(404).json({ error: 'Partida no encontrada' });
  }

  // Determinar el jugador actual
  const jugadorActual = game.jugador1.nombre === player ? game.jugador1 : game.jugador2;

  // Sumar el tiempo transcurrido al tiempo efectivo del jugador
  jugadorActual.tiempoEfectivo += tiempoTranscurrido;

  // Verificar si la letra ya fue adivinada
  if (jugadorActual.letrasAdivinadas.includes(letter)) {
    return res.status(400).json({ error: 'Letra ya adivinada' });
  }

  // Agregar la letra a las letras adivinadas
  jugadorActual.letrasAdivinadas.push(letter);

  // Verificar si la letra está en la palabra
  if (!jugadorActual.palabra.includes(letter)) {
    jugadorActual.intentosIncorrectos += 1;
  }

  // Verificar si el juego ha terminado
  const isGameOver =
    jugadorActual.intentosIncorrectos >= 6 ||
    jugadorActual.palabra.split('').every((l) => jugadorActual.letrasAdivinadas.includes(l));

 // Determinar el ganador si el juego ha terminado
  let winner = null;
  if (isGameOver) {
    if (jugadorActual.intentosIncorrectos < 6) {
      winner = jugadorActual.nombre;
    } else {
      winner = game.jugador1.nombre === player ? game.jugador2.nombre : game.jugador1.nombre;
    }
    game.status = 'finished';
    game.endTime = new Date().toISOString();
    game.winner = winner; // Asignar el ganador al objeto game
  }

  // Cambiar de turno si el juego no ha terminado
  if (!isGameOver) {
    game.currentPlayer = game.jugador1.nombre === player ? game.jugador2.nombre : game.jugador1.nombre;
  }

  // Guardar los cambios en el archivo JSON
  try {
    fs.writeFileSync(dataFilePath, JSON.stringify(games, null, 2));
  } catch (error) {
    console.error('Error al escribir en games.json:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }

  // Respuesta al frontend
  res.json({
    isGameOver,
    winner,
    currentPlayer: game.currentPlayer,
    jugador1: game.jugador1,
    jugador2: game.jugador2,
  });
});

app.get('/api/get-games', (req, res) => {
  let games = [];
  if (fs.existsSync(dataFilePath)) {
    try {
      games = JSON.parse(fs.readFileSync(dataFilePath, 'utf-8'));
    } catch (error) {
      console.error('Error al leer games.json:', error);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  // Enviar los datos al frontend
  
  res.json(games);
});

// Inicia el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});