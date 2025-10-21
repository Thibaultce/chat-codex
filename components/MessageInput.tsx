'use client';

import { useState, type FormEvent } from "react";

type MessageInputProps = {
  onSend: (message: string) => void;
  disabled?: boolean;
};

const MessageInput = ({ onSend, disabled = false }: MessageInputProps) => {
  const [message, setMessage] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!message.trim()) return;

    onSend(message.trim());
    setMessage("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm dark:border-slate-700 dark:bg-slate-900"
    >
      <input
        type="text"
        value={message}
        onChange={(event) => setMessage(event.target.value)}
        placeholder="Write a message..."
        className="flex-1 rounded-xl bg-transparent px-3 py-2 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-blue-500 dark:text-slate-100"
        disabled={disabled}
      />
      <button
        type="submit"
        className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        disabled={disabled}
      >
        Send
      </button>
    </form>
  );
};

export default MessageInput;
