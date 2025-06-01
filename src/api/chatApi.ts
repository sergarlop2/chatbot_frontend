import type { ChatRequest, ChatResponse } from "../types/chat";

export const sendMessage = async (request: ChatRequest): Promise<ChatResponse> => {
  const res = await fetch("http://192.168.1.140:5000/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(request)
  });

  if (!res.ok) throw new Error("Failed to fetch from API");

  return res.json();
};