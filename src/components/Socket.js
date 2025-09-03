// src/socket.js
import { io } from "socket.io-client";

const backendURL = "http://console.taypro.in";

const socket = io(backendURL, {
  transports: ["websocket"], // force only websocket
  upgrade: false,
  autoConnect: true,
});

export default socket;
