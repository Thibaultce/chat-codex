import type { ChatMessage } from "@/types/chat";

type MessageListProps = {
  messages: ChatMessage[];
  currentUser: string;
};

const formatTimestamp = (timestamp: string) =>
  new Intl.DateTimeFormat("en", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(timestamp));

const MessageList = ({ messages, currentUser }: MessageListProps) => {
  return (
    <ul className="flex flex-col gap-4">
      {messages.map((message) => {
        const isCurrentUser =
          message.user.toLowerCase() === currentUser.toLowerCase();

        return (
          <li
            key={message.id}
            className={`flex flex-col ${
              isCurrentUser ? "items-end" : "items-start"
            }`}
          >
            <span className="text-[0.7rem] uppercase tracking-[0.2em] text-cyan-200/60">
              {message.user} · {formatTimestamp(message.timestamp)}
            </span>
            <span
              className={`max-w-full rounded-2xl px-4 py-2.5 text-sm shadow-lg ring-1 ring-inset transition-all ${
                isCurrentUser
                  ? "bg-gradient-to-r from-cyan-500/90 via-emerald-400/90 to-sky-500/90 text-slate-950 ring-white/10"
                  : "bg-white/12 text-cyan-100 ring-white/8 backdrop-blur"
              }`}
            >
              {message.content}
            </span>
          </li>
        );
      })}
      {messages.length === 0 ? (
        <li className="text-center text-sm text-cyan-200/60">
          Start the conversation by sending a message.
        </li>
      ) : null}
    </ul>
  );
};

export default MessageList;
