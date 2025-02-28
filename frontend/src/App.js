import { useEffect, useState } from "react";
import axios from "axios";

function App() {
    const [mensaje, setMensaje] = useState("");

    useEffect(() => {
        axios.get("http://localhost:5000")
            .then(response => setMensaje(response.data))
            .catch(error => console.error("Error al obtener datos", error));
    }, []);

    return (
        <div>
            <h1>React y Express</h1>
            <p>{mensaje}</p>
        </div>
    );
}

export default App;
