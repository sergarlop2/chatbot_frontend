import type { Message } from "../types/chat";

interface ChatMessageProps {
  message: Message;
}

export default function ChatMessage({ message }: ChatMessageProps) {

  const roleDisplay: Record<string, string> = {
    user: "👤 You",
    assistant: "🤖 Assistant",
  };

  return (
    <div className={`message ${message.role}`}>
      <strong>{roleDisplay[message.role] || message.role}</strong>
      <pre>{message.content}</pre>
    </div>
  );
}