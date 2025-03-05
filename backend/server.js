const express = require('express');
const cors = require('cors');
const fs =require('fs');
const app = express();
const port = 5000;

app.use(express.json());                                                                 
app.use(cors());

const dataFilePath = './data/games.json';


if (!fs.existsSync(dataFilePath)) {
    fs.writeFileSync(dataFilePath, JSON.stringify([])); 
  }

// Endpoint para iniciar una partida
app.post('/api/start-game', (req, res) => {
    const { player1, player2 } = req.body;
  
    // Verifica que los datos estén presentes
    if (!player1 || !player2) {
      return res.status(400).json({ error: 'Faltan datos' });
    }
  
    // Lee los datos actuales del archivo JSON
    const games = JSON.parse(fs.readFileSync(dataFilePath));
  
    // Crea una nueva partida
    const newGame = {
      id: games.length + 1, // ID único para la partida
      player1,
      player2,
      word: '', // Palabra a adivinar (se asignará más adelante)
      guessedLetters: [], // Letras adivinadas
      incorrectAttempts: 0, // Intentos incorrectos
      status: 'in_progress', // Estado de la partida
      startTime: new Date().toISOString(), // Fecha de inicio
      endTime: null, // Fecha de finalización
    };

      // Agrega la nueva partida al archivo JSON
    games.push(newGame);
    fs.writeFileSync(dataFilePath, JSON.stringify(games, null, 2));

    // Respuesta al frontend
    res.json({ message: 'Partida iniciada correctamente', gameId: newGame.id });
});





app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
