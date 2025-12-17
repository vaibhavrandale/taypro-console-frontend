import { io } from "socket.io-client";

// 🔧 Use the correct backend URL
const backendURL =
  window.location.hostname === "localhost"
    ? "http://localhost:5000" // local dev
    : "https://console.taypro.in"; // production (force HTTPS)

const socket = io(backendURL, {
  path: "/socket.io", // must match Nginx/backend
  // transports: ["websocket"],
  transports: ["polling", "websocket"], // allow upgrade

  upgrade: false,
  autoConnect: true,
  secure: true, // ensure WSS
});

console.log("🔌 Connecting to:", backendURL);

export default socket;
