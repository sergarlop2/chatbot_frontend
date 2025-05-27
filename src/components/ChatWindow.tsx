import ChatMessage from "./ChatMessage";
import SourceList from "./SourceList";
import type { Message, Source } from "../types/chat";

interface ChatWindowProps {
  messages: Message[];
  sources?: Source[];
  elapsedTime?: number;
  loading?: boolean;
}

export default function ChatWindow({ messages, sources, elapsedTime, loading }: ChatWindowProps) {
  return (
    <div className="chat-window">
      {messages.map((msg, i) => (
        <ChatMessage key={i} message={msg} />
      ))}
      {loading && <div className="loading">💭 Thinking...</div>}
      {elapsedTime !== undefined && (
        <div className="elapsed-time">⏱️ Response time: {elapsedTime.toFixed(2)} s</div>
      )}
      {sources && <SourceList sources={sources} />}
    </div>
  );
}