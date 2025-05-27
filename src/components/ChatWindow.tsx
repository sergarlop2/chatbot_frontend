import ChatMessage from "./ChatMessage";
import SourceList from "./SourceList";
import type { Message, Source } from "../types/chat";

interface ChatWindowProps {
  messages: Message[];
  sources?: Source[];
}

export default function ChatWindow({ messages, sources }: ChatWindowProps) {
  return (
    <div className="chat-window">
      {messages.map((msg, i) => (
        <ChatMessage key={i} message={msg} />
      ))}
      {sources && <SourceList sources={sources} />}
    </div>
  );
}