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
    const newMessages = [...messages, userMessage];
    setLoading(true);
    setSources(undefined);
    setElapsedTime(undefined);

    try {
      const response = await sendMessage({
        model: "llama-3.1-8b-instruct",
        use_rag: useRag,
        messages: newMessages,
      });

      setMessages([...newMessages, response.message]);
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
      <h1>Chatbot</h1>
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

