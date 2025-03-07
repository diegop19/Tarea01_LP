class Jugador {
    constructor(nombre) {
      this.nombre = nombre;
      this.palabra = ''; 
      this.letrasAdivinadas = []; 
      this.intentosIncorrectos = 0; 
      this.inicio = new Date().toISOString(); 
      this.fin = null; 
    }
   
    asignarPalabra(palabra) {
      this.palabra = palabra;
    }

    agregarLetraAdivinada(letra) {
      this.letrasAdivinadas.push(letra);
    }
   
    incrementarIntentosIncorrectos() {
      this.intentosIncorrectos += 1;
    }
  
    marcarFin() {
      this.fin = new Date().toISOString();
    }
  }
  
  module.exports = Jugador;