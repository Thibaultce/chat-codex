'use client';

import { io, type Socket } from "socket.io-client";
import type { ChatMessage, OutgoingChatMessage } from "@/types/chat";

type ServerToClientEvents = {
  chat_message: (message: ChatMessage) => void;
  chat_cleared: () => void;
};

type ClientToServerEvents = {
  chat_message: (message: OutgoingChatMessage) => void;
  clear_chat: () => void;
};

const SOCKET_URL =
  process.env.NEXT_PUBLIC_SOCKET_URL ?? "http://localhost:4000";

let socket:
  | Socket<ServerToClientEvents, ClientToServerEvents>
  | undefined;

export const getSocket = () => {
  if (typeof window === "undefined") {
    throw new Error("Socket can only be initialized in the browser.");
  }

  if (!socket) {
    socket = io(SOCKET_URL, { autoConnect: true });
  }

  return socket;
};

export const disconnectSocket = () => {
  socket?.disconnect();
  socket = undefined;
};
