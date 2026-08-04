import { io } from "socket.io-client";

// 🔧 Use the correct backend URL
const backendURL =
  window.location.hostname === "localhost"
    ? "http://localhost:5500" // local dev
    : "https://console.taypro.in"; // production (force HTTPS)

const socket = io(backendURL, {
  path: "/socket.io", // must match Nginx/backend
  transports: ["websocket"],
  upgrade: false,
  autoConnect: true,
  secure: true, // ensure WSS
  withCredentials: true, // send HttpOnly authtoken cookie on handshake
});

export default socket;
