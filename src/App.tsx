import { useState, useEffect, } from "react";
import ChatWindow from "./components/ChatWindow";
import ChatInput from "./components/ChatInput";
import Header from "./components/Header";
import { sendMessage } from "./api/chatApi";
import type { Message } from "./types/chat";
import { DEFAULT_SYSTEM_PROMPT } from "./types/chat";
import "./App.css";

const STORAGE_MESSAGES_KEY = "chat_messages";
const STORAGE_PROMPT_KEY = "system_prompt";

function App() {

  // Read system prompt from localStorage or use default
  const [systemPrompt, setSystemPrompt] = useState(() => {
    return (
      localStorage.getItem(STORAGE_PROMPT_KEY) ||
      DEFAULT_SYSTEM_PROMPT
    );
  });

  // Save system prompt to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(STORAGE_PROMPT_KEY, systemPrompt);
  }, [systemPrompt]);

  // Obtain messages from localStorage or initialize with system prompt
  const [messages, setMessages] = useState<Message[]>(() => {
    const saved_messages = localStorage.getItem(STORAGE_MESSAGES_KEY);
    if (saved_messages) {
      try {
        return JSON.parse(saved_messages); 
      } catch (e) {
        console.error("Failed to parse saved messages:", e); 
      }
    }
    return [{ role: "system", content: systemPrompt }];
  });

  // Update first message if system prompt changes
  useEffect(() => {
    setMessages((msgs) => {
      if (msgs.length === 1 && msgs[0].role === "system") {
        return [{ role: "system", content: systemPrompt }];
      }
      return msgs;
    });
  }, [systemPrompt]);

  const [sources, setSources] = useState<any[] | undefined>();
  const [elapsedTime, setElapsedTime] = useState<number | undefined>();
  const [loading, setLoading] = useState(false);

  // Save messages to localStorage 
  useEffect(() => {
    localStorage.setItem(STORAGE_MESSAGES_KEY, JSON.stringify(messages));
  }, [messages]);

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

  const handleClearHistory = () => {
    localStorage.removeItem(STORAGE_MESSAGES_KEY);
    setMessages([{ role: "system", content: systemPrompt }]);
    setSources(undefined);
    setElapsedTime(undefined);
  };

  return (
    <div className="app">
      <Header onClearHistory={handleClearHistory} systemPrompt={systemPrompt} setSystemPrompt={setSystemPrompt} />
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

