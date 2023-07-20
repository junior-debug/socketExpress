import express from "express";
import morgan from "morgan";
import { Server as SocketServer } from "socket.io";
import http from "http";
import cors from "cors";

import { PORT } from "./config.js";

const app = express();
const server = http.createServer(app);
const io = new SocketServer(server, {
  cors: { origin: "*" },
});

app.use(cors());
app.use(morgan("dev"));

const connectedClients = {};

io.on("connection", (socket) => {
  connectedClients[socket.id] = true;
  io.emit("connectedClients", Object.keys(connectedClients));
  socket.on("disconnect", () => {
    delete connectedClients[socket.id];

    // Enviar la lista actualizada de clientes conectados a todos los clientes
    io.emit("connectedClients", Object.keys(connectedClients));
  });

  // Manejar el evento personalizado "disconnectClient" para desconectar un cliente específico
  socket.on("disconnectClient", (clientId) => {
    if (connectedClients[clientId]) {
      const clientSocket = io.sockets.sockets.get(clientId);
      if (clientSocket) {
        clientSocket.disconnect(true);
      }
    }
  });
});

server.listen(PORT);
console.log("server started on port", PORT);
