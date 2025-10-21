'use client';

import { useEffect, useMemo, useState } from "react";
import { getSocket } from "@/lib/socket";
import type {
  ChatMessage,
  ConnectionStatus,
  OutgoingChatMessage,
} from "@/types/chat";
import MessageInput from "@/components/MessageInput";
import MessageList from "@/components/MessageList";

const createFallbackUsername = () =>
  `Guest-${Math.random().toString(36).slice(-4).toUpperCase()}`;

const ChatWindow = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [status, setStatus] = useState<ConnectionStatus>("connecting");
  const [username, setUsername] = useState(() => createFallbackUsername());

  useEffect(() => {
    const socket = getSocket();

    const handleConnect = () => setStatus("connected");
    const handleDisconnect = () => setStatus("disconnected");
    const handleMessage = (message: ChatMessage) =>
      setMessages((previous) => [...previous, message]);

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("chat_message", handleMessage);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("chat_message", handleMessage);
    };
  }, []);

  const statusBadge = useMemo(() => {
    switch (status) {
      case "connected":
        return "bg-green-500";
      case "disconnected":
        return "bg-red-500";
      default:
        return "bg-amber-500";
    }
  }, [status]);

  const handleSend = (message: string) => {
    const trimmedMessage = message.trim();

    if (!trimmedMessage) return;

    const socket = getSocket();
    const payload: OutgoingChatMessage = {
      user: username.trim() || createFallbackUsername(),
      content: trimmedMessage,
    };

    socket.emit("chat_message", payload);
  };

  return (
    <div className="flex h-full flex-col gap-6 rounded-3xl border border-slate-200 bg-gradient-to-br from-white via-slate-50 to-slate-100 p-6 shadow-lg dark:border-slate-700 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-slate-900 dark:text-white">
            Chat Demo
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Powered by Next.js, Express, and Socket.IO
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`h-2.5 w-2.5 rounded-full ${statusBadge}`}
            aria-hidden
          />
          <span className="text-sm font-medium capitalize text-slate-600 dark:text-slate-300">
            {status}
          </span>
        </div>
      </header>

      <div className="flex flex-col gap-4">
        <label
          htmlFor="username"
          className="text-sm font-medium text-slate-700 dark:text-slate-300"
        >
          Display name
        </label>
        <input
          id="username"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          onBlur={(event) => {
            if (!event.target.value.trim()) {
              setUsername(createFallbackUsername());
            }
          }}
          className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-900 shadow-sm outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          placeholder="Enter your display name"
        />
      </div>

      <section className="flex-1 overflow-y-auto rounded-3xl border border-slate-200 bg-white/80 p-4 shadow-inner dark:border-slate-700 dark:bg-slate-900/70">
        <MessageList messages={messages} currentUser={username} />
      </section>

      <MessageInput onSend={handleSend} disabled={status !== "connected"} />
    </div>
  );
};

export default ChatWindow;
