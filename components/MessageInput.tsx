'use client';

import { useRef, useState, type ChangeEvent, type FormEvent, type SyntheticEvent } from "react";
import EmojiPicker from "./EmojiPicker";

type MessageInputProps = {
  onSend: (message: string) => void;
  disabled?: boolean;
};

const MessageInput = ({ onSend, disabled = false }: MessageInputProps) => {
  const [message, setMessage] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const selectionRef = useRef<{ start: number; end: number }>({ start: 0, end: 0 });

  const updateSelection = (target: HTMLInputElement) => {
    selectionRef.current = {
      start: target.selectionStart ?? target.value.length,
      end: target.selectionEnd ?? target.value.length,
    };
  };

  const handleSelectionEvent = (event: SyntheticEvent<HTMLInputElement>) => {
    updateSelection(event.currentTarget);
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value);
    updateSelection(event.target);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!message.trim()) return;

    onSend(message.trim());
    setMessage("");
    requestAnimationFrame(() => {
      if (!inputRef.current) return;
      inputRef.current.focus();
      inputRef.current.setSelectionRange(0, 0);
      selectionRef.current = { start: 0, end: 0 };
    });
  };

  const handleEmojiSelect = (emoji: string) => {
    if (disabled) {
      return;
    }

    const input = inputRef.current;
    const { start, end } = selectionRef.current;

    const insertionStart = Math.max(0, Math.min(start, message.length));
    const insertionEnd = Math.max(insertionStart, Math.min(end, message.length));

    const nextMessage =
      message.slice(0, insertionStart) + emoji + message.slice(insertionEnd);

    setMessage(nextMessage);

    requestAnimationFrame(() => {
      if (!input || input.disabled) {
        return;
      }

      const cursorPosition = insertionStart + emoji.length;
      input.focus();
      input.setSelectionRange(cursorPosition, cursorPosition);
      selectionRef.current = { start: cursorPosition, end: cursorPosition };
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center gap-3 rounded-[24px] border border-white/12 bg-white/10 p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-xl"
    >
      <input
        type="text"
        ref={inputRef}
        value={message}
        onChange={handleChange}
        onSelect={handleSelectionEvent}
        onKeyUp={handleSelectionEvent}
        onClick={handleSelectionEvent}
        onFocus={handleSelectionEvent}
        placeholder="Write a message..."
        className="flex-1 rounded-xl bg-transparent px-3 py-2 text-sm text-cyan-50 placeholder:text-cyan-100/40 outline-none transition focus:ring-2 focus:ring-cyan-400/60 disabled:opacity-50"
        disabled={disabled}
      />
      <div className="flex items-center gap-2">
        <EmojiPicker onSelect={handleEmojiSelect} disabled={disabled} />
        <button
          type="submit"
          className="rounded-full bg-gradient-to-r from-cyan-500 via-emerald-400 to-sky-500 px-5 py-2 text-sm font-semibold text-slate-950 shadow-[0_12px_30px_-16px_rgba(34,211,238,0.9)] transition hover:from-cyan-400 hover:via-emerald-300 hover:to-sky-400 disabled:cursor-not-allowed disabled:from-white/20 disabled:via-white/20 disabled:to-white/20 disabled:text-white/60 disabled:shadow-none"
          disabled={disabled}
        >
          Send
        </button>
      </div>
    </form>
  );
};

export default MessageInput;
