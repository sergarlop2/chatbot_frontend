import { useState } from "react";
import Spinner from "./Spinner";

interface ChatInputProps {
  onSend: (message: string, useRag: boolean) => void;
  loading: boolean;
}

export default function ChatInput({ onSend, loading }: ChatInputProps) {
  const [input, setInput] = useState("");
  const [useRag, setUseRag] = useState(false);

  const handleSend = () => {
    if (input.trim() === "") return;
    onSend(input, useRag);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="chat-input">
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type your message..."
        disabled={loading}
      />
      <div className="controls-row">
        <div className="switch-wrapper">
          <label className="switch">
            <input
              type="checkbox"
              checked={useRag}
              onChange={(e) => setUseRag(e.target.checked)}
              disabled={loading}
            />
            <span className="slider"></span>
          </label>
          <span>Use RAG</span>
        </div>
        <button onClick={handleSend} disabled={loading || input.trim() === ""}>
          {loading ? (
            <>
              <Spinner /> Waiting response...
            </>
          ) : (
            "Send"
          )}
        </button>
      </div>
    </div>
  );
}
