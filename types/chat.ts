export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

export interface ChatRequest {
  messages: { role: string; content: string }[];
}

export interface ChatResponse {
  message: ChatMessage;
  raw_content: string;
}
