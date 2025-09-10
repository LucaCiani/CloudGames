import { useState } from "react";
import "../chatbot.css";

// Componente principale del chatbot
export default function ChatBot() {
  // Stato per mostrare/nascondere la chat
  const [isOpen, setIsOpen] = useState(false);
  // Stato per la lista dei messaggi (utente e bot)
  const [messages, setMessages] = useState([]);
  // Stato per il valore dell'input di testo
  const [inputValue, setInputValue] = useState("");
  // Stato per mostrare il caricamento mentre il bot risponde
  const [isLoading, setIsLoading] = useState(false);

  // Funzione per inviare un messaggio al backend
  const sendMessage = async () => {
    if (!inputValue.trim()) return; // Non inviare se l'input è vuoto

    const userMessage = inputValue.trim();
    setInputValue(""); // Svuota l'input
    // Aggiungi il messaggio dell'utente alla chat
    setMessages((prev) => [...prev, { type: "user", text: userMessage }]);
    setIsLoading(true); // Mostra il caricamento

    try {
      // Chiamata API al backend per ottenere la risposta del bot
      const response = await fetch(`${import.meta.env.VITE_API_BASE}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await response.json();
      // Aggiungi la risposta del bot alla chat
      setMessages((prev) => [
        ...prev,
        { type: "bot", text: data.reply || "Errore nella risposta" },
      ]);
    } catch (error) {
      // In caso di errore di rete o server
      console.error("Errore nel chatbot:", error);
      setMessages((prev) => [
        ...prev,
        { type: "bot", text: "Errore di connessione. Riprova." },
      ]);
    } finally {
      setIsLoading(false); // Nascondi il caricamento
    }
  };

  // Permette di inviare il messaggio premendo "Invio"
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <div className="chatbot-container">
      {/* Pulsante per aprire/chiudere la chat */}

      <img
        src="/chatbot.jpg" // oppure "./assets/chat_icon.png" se la metti in src/assets
        alt="Apri chat"
        className="chatbot-toggle-btn"
        onClick={() => setIsOpen(!isOpen)}
        
      />

      {/* Finestra della chat, visibile solo se isOpen è true */}
      {isOpen && (
        <div className="chatbot-window">
          {/* Header della chat */}
          <div className="chatbot-header">CloudGames Assistant</div>
          {/* Area messaggi */}
          <div className="chatbot-messages">
            {/* Messaggio di benvenuto se la chat è vuota */}
            {messages.length === 0 && (
              <div className="chatbot-loading">
                Ciao! Sono l'assistente di CloudGames. Come posso aiutarti?
              </div>
            )}
            {/* Lista dei messaggi (utente e bot) */}
            {messages.map((msg, index) => (
              <div key={index} className={`chatbot-message ${msg.type}`}>
                <strong>{msg.type === "user" ? "Tu: " : "Bot: "}</strong>
                {msg.text}
              </div>
            ))}
            {/* Messaggio di caricamento mentre il bot risponde */}
            {isLoading && (
              <div className="chatbot-loading">Bot sta scrivendo...</div>
            )}
          </div>
          {/* Area input per scrivere e inviare messaggi */}
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
