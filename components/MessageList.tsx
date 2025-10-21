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
    <ul className="flex flex-col gap-3">
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
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {message.user} · {formatTimestamp(message.timestamp)}
            </span>
            <span
              className={`rounded-2xl px-4 py-2 text-sm shadow-sm transition-colors ${
                isCurrentUser
                  ? "bg-blue-600 text-white"
                  : "bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-100"
              }`}
            >
              {message.content}
            </span>
          </li>
        );
      })}
      {messages.length === 0 ? (
        <li className="text-center text-sm text-slate-500 dark:text-slate-400">
          Start the conversation by sending a message.
        </li>
      ) : null}
    </ul>
  );
};

export default MessageList;
