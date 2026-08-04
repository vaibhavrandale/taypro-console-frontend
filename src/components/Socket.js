import { io } from "socket.io-client";

// 🔧 Use the correct backend URL
const backendURL =
  window.location.hostname === "localhost"
    ? "http://localhost:5500" // local dev
    : "https://console.taypro.in"; // production (force HTTPS)

// Auth is the HttpOnly `authtoken` cookie (see Login + auth.controller) —
// not localStorage. withCredentials sends it on handshake.
const socket = io(backendURL, {
  path: "/socket.io", // must match Nginx/backend
  transports: ["websocket"],
  upgrade: false,
  autoConnect: false, // connect after EMP_SIGNIN (cookie already set)
  secure: true,
  withCredentials: true,
});

socket.on("connect_error", (err) => {
  console.warn("🔌 Socket auth/connection failed:", err.message);
});

export function connectSocket() {
  if (!socket.connected) socket.connect();
}

export function disconnectSocket() {
  if (socket.connected) socket.disconnect();
}

export default socket;
