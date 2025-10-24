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
      className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-2 shadow-sm dark:border-emerald-800 dark:bg-emerald-950"
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
        className="flex-1 rounded-xl bg-transparent px-3 py-2 text-sm text-emerald-900 outline-none focus:ring-2 focus:ring-emerald-500 dark:text-emerald-100"
        disabled={disabled}
      />
      <div className="flex items-center gap-2">
        <EmojiPicker onSelect={handleEmojiSelect} disabled={disabled} />
        <button
          type="submit"
          className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={disabled}
        >
          Send
        </button>
      </div>
    </form>
  );
};

export default MessageInput;
