import { useState, useEffect } from "react";
import useGlobalContext from "../contexts/useGlobalContext";
import "../chatbot.css";

const welcomeMessages = [
  {
    id: 1,
    text: "Ciao gamer! 👋 Benvenuto su CloudGames, pronto a scoprire tutte le novità?",
  },
  {
    id: 2,
    text: "Ehi! 🚀 Sono il tuo assistente CloudGames. Vuoi un consiglio su giochi, offerte o novità?",
  },
  {
    id: 3,
    text: "Ciao! 🎧 Ti va di scoprire i giochi più popolari del momento?",
  },
  {
    id: 4,
    text: "Ciao! Vuoi esplorare i giochi più amati o ricevere consigli personalizzati? 😎",
  },
  {
    id: 5,
    text: "Hey gamer! Vuoi scoprire subito le novità o preferisci dare un’occhiata alle offerte?",
  },
  {
    id: 6,
    text: "Yo! 🔥 Sei pronto a scoprire il prossimo gioco che ti farà perdere la testa?",
  },
  {
    id: 7,
    text: "Benvenuto su CloudGames! Sono qui per aiutarti a trovare giochi, offerte e aggiornamenti.",
  },
  {
    id: 8,
    text: "Ciao, sono l’assistente di CloudGames. Come posso supportarti oggi?",
  },
  { id: 9, text: "Pronto a giocare? 🎮 Dimmi cosa cerchi e ti guiderò!" },
];

export default function ChatBot() {
  const { chatMessages, setChatMessages } = useGlobalContext();
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [welcome, setWelcome] = useState(welcomeMessages[0]);

  useEffect(() => {
    if (isOpen && chatMessages.length === 0) {
      const randomIndex = Math.floor(Math.random() * welcomeMessages.length);
      setWelcome(welcomeMessages[randomIndex]);
    }
    // eslint-disable-next-line
  }, [isOpen]);

  const sendMessage = async () => {
    if (!inputValue.trim()) return;
    const userMessage = inputValue.trim();
    setInputValue("");
    setChatMessages((prev) => [...prev, { type: "user", text: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
      });
      const data = await response.json();
      setChatMessages((prev) => [
        ...prev,
        { type: "bot", text: data.reply || "Errore nella risposta" },
      ]);
    } catch (error) {
      console.error("Error sending message:", error);
      setChatMessages((prev) => [
        ...prev,
        { type: "bot", text: "Errore di connessione. Riprova." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <div className="chatbot-container">
      <img
        src="/chatbot.jpg"
        alt="Apri chat"
        className="chatbot-toggle-btn"
        onClick={() => setIsOpen(!isOpen)}
      />
      {isOpen && (
        <div className="chatbot-window">
          <div className="chatbot-header">CloudGames Assistant</div>
          <div className="chatbot-messages">
            {chatMessages.length === 0 && (
              <div className="chatbot-loading" key={welcome.id}>
                {welcome.text}
              </div>
            )}
            {chatMessages.map((msg, index) => (
              <div key={index} className={`chatbot-message ${msg.type}`}>
                <strong>{msg.type === "user" ? "Tu: " : "Bot: "}</strong>
                {msg.text}
              </div>
            ))}
            {isLoading && (
              <div className="chatbot-loading">Bot sta scrivendo...</div>
            )}
          </div>
          <div className="chatbot-input-area">
            <input
              className="chatbot-input"
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Scrivi un messaggio..."
              disabled={isLoading}
            />
            <button
              className="chatbot-send-btn"
              onClick={sendMessage}
              disabled={isLoading || !inputValue.trim()}
            >
              Invia
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
