export type Role = "system" | "user" | "assistant";

export interface Message {
  role: Role;
  content: string;
}

export interface ChatRequest {
  model: string;
  use_rag: boolean;
  messages: Message[];
}

export interface ChatResponse {
  message: Message;
  elapsed_time: number;
  sources?: Source[];
}

export interface Source {
  chunk_id: number;
  chunk_length: number;
  end_page: number;
  source: string;
  start_page: number;
  total_chunk_pages: number;
}
