// src/socket.js
import { io } from "socket.io-client";

// 🔧 Use the correct backend URL
const backendURL =
  window.location.hostname === "localhost"
    ? "http://localhost:5000" // local dev
    : "http://console.taypro.in/api"; // production

const socket = io(backendURL, {
  path: "/socket.io", // ✅ important for Nginx proxy
  transports: ["websocket"], // force websocket
  upgrade: false,
  autoConnect: true,
  secure: backendURL.startsWith("http"),
});

console.log(backendURL);

export default socket;
