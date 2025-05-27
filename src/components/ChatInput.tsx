import { useState } from "react";

interface ChatInputProps {
  onSend: (message: string, useRag: boolean) => void;
}

export default function ChatInput({ onSend }: ChatInputProps) {
  const [input, setInput] = useState("");
  const [useRag, setUseRag] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    onSend(input, useRag);
    setInput("");
  };

  return (
    <form onSubmit={handleSubmit} className="chat-input">
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type your message..."
      />
      <label>
        <input
          type="checkbox"
          checked={useRag}
          onChange={(e) => setUseRag(e.target.checked)}
        />
        Use RAG
      </label>
      <button type="submit">Send</button>
    </form>
  );
}
