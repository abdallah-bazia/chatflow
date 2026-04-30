import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const getSocket = (): Socket => {
  if (!socket) {
    socket = io("https://chatflow-og5q.onrender.com", {
      autoConnect: false,
    });
  }
  return socket;
};