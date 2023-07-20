import "./App.css";
import io from "socket.io-client";
import React, { useState, useEffect } from "react";

const socket = io("http://localhost:4000");

function App() {
  const [connectedClients, setConnectedClients] = useState([]);

  useEffect(() => {
    // Suscribirse al evento "connectedClients" cuando el componente se monta
    socket.on("connectedClients", (clients) => {
      setConnectedClients(clients);
    });

    // Limpiar el evento cuando el componente se desmonta
    return () => {
      socket.off("connectedClients");
    };
  }, []);

  const handleDisconnect = (clientId) => {
    // Envía un mensaje al servidor para desconectar al cliente con el ID dado
    socket.emit("disconnectClient", clientId);
  };

  return (
    <div>
      <h1>Clientes Conectados:</h1>
      <ul>
        {connectedClients.map((client) => (
          <li key={client}>
            {client}{" "}
            <button onClick={() => handleDisconnect(client)}>
              Desconectar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
