import { useState, useEffect, } from "react";
import ChatWindow from "./components/ChatWindow";
import ChatInput from "./components/ChatInput";
import Header from "./components/Header";
import { sendMessage } from "./api/chatApi";
import type { Message } from "./types/chat";
import "./App.css";

const STORAGE_MESSAGES_KEY = "chat_messages";
const STORAGE_PROMPT_KEY = "system_prompt";

function App() {

  // Read system prompt from localStorage or use default
  const [systemPrompt, setSystemPrompt] = useState(() => {
    return (
      localStorage.getItem(STORAGE_PROMPT_KEY) ||
      `
      Cutting Knowledge Date: December 2023

      You are a helpful AI assistant specialized in digital communications.

      The topics you can discuss include:
        - Fundamentals of digital communication systems.
        - Digital modulations and AWGN channels.
        - OFDM and frequency-selective channels.
        - Advanced channel models: multipath, Rayleigh and Rician fading, Doppler effect, etc.
        - MIMO systems and diversity in communication systems.

      Sometimes the user may provide you with some context, but it will not always be available.

      You must follow this strict protocol for every user question:

      0. You must ALWAYS remember that you are just an AI assistant and not a human. You must never respond as if you were a human, regardless the context.

      1. Determine whether the question is related to digital communications or the provided context:
        - If the user asks about **politics**, **ethics**, **religion**, etc, that is UNRELATED.

      2. **If UNRELATED** to context or digital communications:
        - Explain briefly why you can't answer that question.

      3. **If RELATED** to context or digital communications:
        a. Answer FIRST using context content.
        b. Only use training data to supplement missing context information.
        c. If context is insufficient, state what's missing.

      4. For **all** responses:
        - Use well-formatted formulas and correct, consistent units.  
        - Double-check all numerical calculations, especially when substituting in formulas.  
        - Break solutions into clear, ordered steps.  
        - Keep a professional tone.  
        - Never invent facts.
      `
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

