import { io } from "socket.io-client";

// 🔧 Use the correct backend URL
const backendURL =
  window.location.hostname === "localhost"
    ? "http://localhost:5500" // local dev
    : "https://console.taypro.in"; // production (force HTTPS)

const socket = io(backendURL, {
  path: "/socket.io", // must match Nginx/backend
  // transports: ["websocket"],
  transports: [
    // "polling",
    "websocket",
  ], // allow upgrade

  upgrade: false,
  autoConnect: true,
  secure: true, // ensure WSS
});

// const socket = io(backendURL, {
//   path: "/socket.io",
//   transports: ["websocket"], // ✅ NO polling
//   autoConnect: false, // ✅ manual lifecycle
//   secure: true,
//   reconnection: true,
//   reconnectionAttempts: 5,
//   reconnectionDelay: 2000,
// });

console.log("🔌 Connecting to:", backendURL);

export default socket;
