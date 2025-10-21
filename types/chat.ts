export type OutgoingChatMessage = {
  user: string;
  content: string;
};

export type ChatMessage = OutgoingChatMessage & {
  id: string;
  timestamp: string;
};

export type ConnectionStatus = "connecting" | "connected" | "disconnected";
