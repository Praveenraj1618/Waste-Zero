// src/services/socket.ts
import { io, Socket } from "socket.io-client";

const BACKEND_URL = (import.meta.env.VITE_API_BASE || "http://localhost:5000/api").replace(/\/api$/, "");

function getToken() {
  return localStorage.getItem("token");
}

let socket: Socket | null = null;

export function connectSocket() {
  if (socket && socket.connected) return socket;

  const token = getToken();
  socket = io(BACKEND_URL, {
    auth: { token },
    autoConnect: true,
    transports: ["websocket", "polling"],
    reconnectionAttempts: Infinity,
    reconnectionDelayMax: 5000,
  });

  socket.on("connect_error", (err: any) => {
    console.warn("Socket connect_error:", err?.message || err);
  });

  socket.on("connect", () => {
    console.log("Socket connected:", socket?.id);
  });

  socket.on("disconnect", (reason) => {
    console.log("Socket disconnected:", reason);
  });

  return socket;
}

export function disconnectSocket() {
  if (!socket) return;
  try { socket.disconnect(); } catch (e) { console.warn(e); }
  socket = null;
}

export function emit(event: string, payload: any, ack?: (res: any) => void) {
  const s = connectSocket();
  if (!s) return;
  s.emit(event, payload, (resp: any) => { if (typeof ack === "function") ack(resp); });
}

export function on(event: string, cb: (...args: any[]) => void) {
  const s = connectSocket();
  s.on(event, cb);
  return () => s.off(event, cb);
}

// helpers
export function onPresence(cb: (payload: any) => void) { return on("userOnline", cb); }
export function onPresenceOff(cb: (payload: any) => void) { return on("userOffline", cb); }
export function onReceiveMessage(cb: (msg: any) => void) { return on("receiveMessage", cb); }
export function onMessageSent(cb: (msg: any) => void) { return on("messageSent", cb); }
export function onMessageDelivered(cb: (payload: any) => void) { return on("messageDelivered", cb); }
export function onMessageRead(cb: (payload: any) => void) { return on("messageRead", cb); }
export function onTyping(cb: (payload: any) => void) { return on("typing", cb); }
export function emitTyping(receiver_id: string, isTyping = true) { emit("typing", { receiver_id, isTyping }); }

// Aliases for backward compatibility
export const onDelivered = onMessageDelivered;
export const onRead = onMessageRead;

export default {
  connectSocket, disconnectSocket, emit, on,
  onPresence, onPresenceOff, onReceiveMessage, onMessageSent, onMessageDelivered, onMessageRead, onTyping, emitTyping,
  onDelivered, onRead
};
