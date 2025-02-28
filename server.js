const express = require('express');
const cors = require('cors');
const app = express();
const port = 5000;

app.use(cors());

app.get('/', (req, res) => {
    res.send('¡Hola desde el backend con Express!');
});

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
