import express from "express";
import connection from "../db/connection.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Manca il messaggio" });
    }

    const lowerMessage = message.toLowerCase();
    let systemPrompt =
      "Sei un assistente amichevole per CloudGames, un sito di videogiochi.";

    // Funzione per chiamare OpenAI
    const callOpenAI = async (finalPrompt) => {
      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [
              {
                role: "system",
                content:
                  finalPrompt +
                  " Rispondi sempre in italiano e sii professionale ma amichevole.",
              },
              { role: "user", content: message },
            ],
            max_tokens: 300,
            temperature: 0.7,
          }),
        }
      );

      const data = await response.json();
      res.json({
        reply:
          data.choices?.[0]?.message?.content || "⚠️ Nessuna risposta dall'AI",
      });
    };

    // Query per consigli di giochi
    if (
      lowerMessage.includes("consiglia") ||
      lowerMessage.includes("gioco") ||
      lowerMessage.includes("raccomanda")
    ) {
      console.log("🔍 Tentativo di query al database...");

      connection.query(
        "SELECT name, price FROM videogames LIMIT 3",
        (error, games) => {
          if (error) {
            console.log("❌ Errore query:", error);
            systemPrompt +=
              " Visita il nostro catalogo per scoprire i giochi disponibili.";
          } else {
            console.log("✅ Query riuscita! Risultato:", games);
            if (games && games.length > 0) {
              const gameNames = games.map((g) => g.name).join(", ");
              systemPrompt += ` I giochi nel nostro catalogo sono: ${gameNames}. Consiglia solo tra questi.`;
            }
          }
          // Chiama OpenAI dopo aver ottenuto i dati dal DB
          callOpenAI(systemPrompt);
        }
      );
    } else {
      // Per altre domande, usa il prompt di base
      if (lowerMessage.includes("prezzo") || lowerMessage.includes("costo")) {
        systemPrompt += " I prezzi dei nostri giochi sono molto competitivi.";
      } else if (lowerMessage.includes("genere")) {
        systemPrompt += " Offriamo giochi di tutti i generi.";
      } else {
        systemPrompt +=
          " Sono qui per aiutarti con qualsiasi domanda sui videogiochi.";
      }

      // Chiama OpenAI direttamente
      callOpenAI(systemPrompt);
    }
  } catch (error) {
    console.error("Errore nel chatbot:", error);
    res.status(500).json({ error: "Errore durante la risposta del chatbot" });
  }
});

export default router;
