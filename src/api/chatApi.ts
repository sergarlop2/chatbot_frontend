import type { ChatRequest, ChatResponse } from "../types/chat";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const sendMessage = async (request: ChatRequest): Promise<ChatResponse> => {
  const res = await fetch(`${API_URL}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(request)
  });

  if (!res.ok) throw new Error("Failed to fetch from API");

  return res.json();
};