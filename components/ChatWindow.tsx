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
    const handleCleared = () => setMessages([]);

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("chat_message", handleMessage);
    socket.on("chat_cleared", handleCleared);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("chat_message", handleMessage);
      socket.off("chat_cleared", handleCleared);
    };
  }, []);

  const statusBadge = useMemo(() => {
    switch (status) {
      case "connected":
        return "bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.85)]";
      case "disconnected":
        return "bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.65)]";
      default:
        return "bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.55)]";
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

  const handleClear = () => {
    const socket = getSocket();
    socket.emit("clear_chat");
    setMessages([]);
  };

  return (
    <div className="relative overflow-hidden rounded-[32px] border border-cyan-400/25 bg-white/5 shadow-[0_24px_80px_-40px_rgba(34,211,238,0.9)] backdrop-blur-2xl">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.12),_transparent_60%),radial-gradient(circle_at_bottom,_rgba(192,132,252,0.14),_transparent_65%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[32px] border border-white/10 mix-blend-screen"
      />
      <div className="relative flex h-full flex-col gap-8 p-8">
        <header className="flex flex-wrap items-center justify-between gap-6">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-cyan-100">
              Aurora Relay
            </h1>
            <p className="text-sm text-cyan-200/70">
              Futuristic messaging powered by Next.js, Express, and Socket.IO
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={handleClear}
              disabled={!messages.length || status !== "connected"}
              className="rounded-full border border-white/20 bg-white/10 px-5 py-2 text-sm font-medium text-cyan-100 transition hover:border-cyan-300/50 hover:bg-cyan-400/20 disabled:cursor-not-allowed disabled:border-white/10 disabled:bg-white/5 disabled:opacity-50"
            >
              Clear chat
            </button>
            <div className="flex items-center gap-2 rounded-full bg-white/5 px-4 py-2">
              <span
                className={`h-2.5 w-2.5 rounded-full ${statusBadge}`}
                aria-hidden
              />
              <span className="text-sm font-medium capitalize text-cyan-100/80">
                {status}
              </span>
            </div>
          </div>
        </header>

        <div className="flex flex-col gap-3">
          <label
            htmlFor="username"
            className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-200/60"
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
            className="rounded-2xl border border-white/15 bg-white/10 px-4 py-2.5 text-sm text-cyan-50 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] outline-none transition placeholder:text-cyan-100/40 focus:border-cyan-300 focus:ring-2 focus:ring-cyan-400/60"
            placeholder="Choose a callsign"
          />
        </div>

        <section className="flex-1 overflow-y-auto rounded-[26px] border border-white/10 bg-slate-950/40 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
          <MessageList messages={messages} currentUser={username} />
        </section>

        <MessageInput onSend={handleSend} disabled={status !== "connected"} />
      </div>
    </div>
  );
};

export default ChatWindow;
