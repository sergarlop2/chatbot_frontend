import { useState } from "react";
import ChatWindow from "./components/ChatWindow";
import ChatInput from "./components/ChatInput";
import { sendMessage } from "./api/chatApi";
import type { Message } from "./types/chat";
import "./App.css";

function App() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "system",
      content: "You are an expert assistant. Respond with a concise answer.",
    }
  ]);
  const [sources, setSources] = useState<any[] | undefined>();
  const [elapsedTime, setElapsedTime] = useState<number | undefined>();
  const [loading, setLoading] = useState(false);

  const handleSend = async (content: string, useRag: boolean) => {
    const userMessage: Message = { role: "user", content };
    const updatedMessages = [...messages, userMessage];
    const windowSize = useRag ? 4 : 8; // smaller window if RAG is on

    setMessages(updatedMessages);
    setLoading(true);
    setSources(undefined);
    setElapsedTime(undefined);

    const recentMessages = updatedMessages.slice(-windowSize);
    const messagesToSend = [
      messages[0], // system message
      ...recentMessages.filter(m => m.role !== "system"),
    ];

    try {
      const response = await sendMessage({
        model: "llama-3.1-8b-instruct",
        use_rag: useRag,
        messages: messagesToSend,
      });

      const cleanedMessage = {
        ...response.message,
        content: response.message.content.replace(/^\n+/, ""),
      };

      setMessages([...updatedMessages, cleanedMessage]);
      setSources(response.sources);
      setElapsedTime(response.elapsed_time);
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">
          DigCom
        </h1>
        <p className="app-subtitle">
          Your AI assistant for digital communications
        </p>
      </header>
      <ChatWindow 
        messages={messages.slice(1)} 
        sources={sources} 
        elapsedTime={elapsedTime}
        loading={loading} 
      />
      <ChatInput onSend={handleSend} loading={loading} />
    </div>
  );
}

export default App;

