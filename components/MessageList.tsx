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
            <span className="text-xs text-emerald-600 dark:text-emerald-300">
              {message.user} · {formatTimestamp(message.timestamp)}
            </span>
            <span
              className={`rounded-2xl px-4 py-2 text-sm shadow-sm transition-colors ${
                isCurrentUser
                  ? "bg-emerald-600 text-white"
                  : "bg-emerald-100 text-emerald-950 dark:bg-emerald-900 dark:text-emerald-100"
              }`}
            >
              {message.content}
            </span>
          </li>
        );
      })}
      {messages.length === 0 ? (
        <li className="text-center text-sm text-emerald-600 dark:text-emerald-300">
          Start the conversation by sending a message.
        </li>
      ) : null}
    </ul>
  );
};

export default MessageList;
