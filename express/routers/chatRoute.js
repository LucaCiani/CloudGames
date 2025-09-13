import express from "express";
import connection from "../db/connection.js";
import {
  consigliKeywords,
  genereKeywords,
  budgetKeywords,
  offerteKeywords,
  prezzoKeywords,
  piattaformaKeywords,
  sviluppatoreKeywords,
  recentiKeywords,
} from "../data/keywords.js";

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
      try {
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
                    " Rispondi sempre in italiano, sii professionale ma amichevole. Usa solo i giochi che ti ho fornito.",
                },
                { role: "user", content: message },
              ],
              max_tokens: 150 /* lunghezza messaggio bot */,
              temperature: 0.5 /* Creativo o presico === (temp1=creativo) - (temp0=preciso) */,
            }),
          }
        );
       
        const data = await response.json();
        res.json({
          reply: (
            data.choices?.[0]?.message?.content || "⚠️ Nessuna risposta dall'AI"
          ).replace(/\*\*/g, ""),
        });
      } catch (aiError) {
        console.error("Errore OpenAI:", aiError);
        res
          .status(500)
          .json({ error: "Errore nella generazione della risposta" });
      }
    };

    // 1. CONSIGLI GENERALI DI GIOCHI
    if (consigliKeywords.some((keyword) => lowerMessage.includes(keyword))) {
      console.log("🔍 Query per consigli generali...");

      connection.query(
        `
        SELECT v.name, v.price, v.promo_price, v.description, v.developer 
        FROM videogames v 
        ORDER BY RAND()
        LIMIT 4
      `,
        (error, games) => {
          if (error) {
            console.log("❌ Errore query consigli:", error);
            systemPrompt +=
              " Visita il nostro catalogo per scoprire i migliori giochi.";
          } else {
            console.log("✅ Consigli trovati:", games.length);
            if (games && games.length > 0) {
              const gameDetails = games
                .map(
                  (g) =>
                    `${g.name} di ${
                      g.developer || "Sviluppatore sconosciuto"
                    } - €${g.promo_price || g.price} ${
                      g.promo_price ? `(sconto da €${g.price})` : ""
                    } - ${
                      g.description
                        ? g.description.substring(0, 120) + "..."
                        : "Descrizione non disponibile"
                    }`
                )
                .join("; ");
              systemPrompt += ` Ecco i giochi che puoi consigliare dal nostro catalogo: ${gameDetails}. Scegli i migliori e spiega perché li consigli.`;
            }
          }
          callOpenAI(systemPrompt);
        }
      );
    }

    // 2. FILTRO PER GENERE/CATEGORIA
    else if (genereKeywords.some((keyword) => lowerMessage.includes(keyword))) {
      console.log("🔍 Query per generi...");

      connection.query(
        `
        SELECT v.name, v.price, v.promo_price, v.developer, GROUP_CONCAT(g.name) as genres
        FROM videogames v 
        LEFT JOIN videogame_genre vg ON v.id = vg.videogame_id
        LEFT JOIN genres g ON vg.genre_id = g.id
        GROUP BY v.id
        LIMIT 4
      `,
        (error, games) => {
          if (error) {
            console.log("❌ Errore query generi:", error);
            systemPrompt +=
              " Abbiamo giochi di tutti i generi: azione, avventura, sport, strategia e molti altri.";
          } else {
            console.log("✅ Giochi con generi trovati:", games.length);
            if (games && games.length > 0) {
              const gamesByGenre = games
                .map(
                  (g) =>
                    `${g.name} (${g.genres || "Genere non specificato"}) - €${
                      g.promo_price || g.price
                    }`
                )
                .join("; ");
              systemPrompt += ` Ecco i nostri giochi organizzati per genere: ${gamesByGenre}. Consiglia in base al genere richiesto.`;
            }
          }
          callOpenAI(systemPrompt);
        }
      );
    }

    // 3. BUDGET/GIOCHI ECONOMICI
    else if (budgetKeywords.some((keyword) => lowerMessage.includes(keyword))) {
      console.log("🔍 Query per giochi economici...");

      connection.query(
        `
        SELECT name, price, promo_price, developer 
        FROM videogames 
        WHERE (promo_price IS NOT NULL AND promo_price < 30) OR (promo_price IS NULL AND price < 30)
        ORDER BY COALESCE(promo_price, price) ASC
        LIMIT 4
      `,
        (error, games) => {
          if (error) {
            console.log("❌ Errore query budget:", error);
            systemPrompt +=
              " Abbiamo molte offerte convenienti nel nostro catalogo.";
          } else {
            console.log("✅ Giochi economici trovati:", games.length);
            if (games && games.length > 0) {
              const budgetGames = games
                .map(
                  (g) =>
                    `${g.name} di ${g.developer || "N/A"} - €${
                      g.promo_price || g.price
                    }`
                )
                .join("; ");
              systemPrompt += ` Ecco i giochi più convenienti del nostro catalogo: ${budgetGames}. Consiglia quelli con il miglior rapporto qualità-prezzo.`;
            }
          }
          callOpenAI(systemPrompt);
        }
      );
    }

    // 4. OFFERTE E SCONTI
    else if (
      offerteKeywords.some((keyword) => lowerMessage.includes(keyword))
    ) {
      console.log("🔍 Query per offerte...");

      connection.query(
        `
        SELECT v.name, v.price, v.promo_price, v.developer 
        FROM videogames v
        WHERE v.promo_price IS NOT NULL AND v.promo_price > 0
        ORDER BY ((v.price - v.promo_price) / v.price * 100) DESC
        LIMIT 4
      `,
        (error, games) => {
          if (error) {
            console.log("❌ Errore query offerte:", error);
            systemPrompt += " Controlla le nostre offerte speciali!";
          } else {
            console.log("✅ Offerte trovate:", games.length);
            if (games && games.length > 0) {
              const offers = games
                .map((g) => {
                  const discount = Math.round(
                    ((g.price - g.promo_price) / g.price) * 100
                  );
                  return `${g.name} - €${g.promo_price} (era €${g.price}, sconto ${discount}%)`;
                })
                .join("; ");
              systemPrompt += ` Ecco le nostre migliori offerte: ${offers}. Evidenzia i migliori sconti!`;
            } else {
              systemPrompt +=
                " Al momento non ci sono giochi in offerta speciale.";
            }
          }
          callOpenAI(systemPrompt);
        }
      );
    }

    // 5. PREZZI SPECIFICI
    else if (prezzoKeywords.some((keyword) => lowerMessage.includes(keyword))) {
      console.log("🔍 Query per prezzi...");

      const gameKeywords = lowerMessage
        .replace(/prezzo|costo|quanto costa|di|del|€|euro/g, "")
        .trim();

      connection.query(
        `
        SELECT name, price, promo_price, developer 
        FROM videogames 
        WHERE LOWER(name) LIKE ? OR LOWER(developer) LIKE ? OR SOUNDEX(name) = SOUNDEX(?)
        LIMIT 4
      `,
        [`%${gameKeywords}%`, `%${gameKeywords}%`, gameKeywords],
        (error, games) => {
          if (error) {
            console.log("❌ Errore query prezzi:", error);
            systemPrompt += " I nostri prezzi sono molto competitivi.";
          } else {
            console.log(
              "✅ Prezzi trovati per:",
              gameKeywords,
              "->",
              games.length,
              "risultati"
            );
            if (games && games.length > 0) {
              const priceInfo = games
                .map(
                  (g) =>
                    `${g.name} costa €${g.promo_price || g.price} ${
                      g.promo_price ? `(prezzo pieno €${g.price})` : ""
                    }`
                )
                .join("; ");
              systemPrompt += ` Ecco le informazioni sui prezzi: ${priceInfo}.`;
            } else {
              systemPrompt +=
                " Non ho trovato il gioco che cerchi. Prova con un nome più specifico.";
            }
          }
          callOpenAI(systemPrompt);
        }
      );
    }

    // 6. PIATTAFORME
    else if (
      piattaformaKeywords.some((keyword) => lowerMessage.includes(keyword))
    ) {
      console.log("🔍 Query per piattaforme...");

      connection.query(
        `
        SELECT v.name, v.price, v.promo_price, GROUP_CONCAT(p.name) as platforms
        FROM videogames v 
        LEFT JOIN platform_videogame pv ON v.id = pv.videogame_id
        LEFT JOIN platforms p ON pv.platform_id = p.id
        GROUP BY v.id
        LIMIT 4
      `,
        (error, games) => {
          if (error) {
            console.log("❌ Errore query piattaforme:", error);
            systemPrompt +=
              " I nostri giochi sono disponibili per PC, PlayStation, Xbox, Nintendo Switch e altre piattaforme.";
          } else {
            console.log("✅ Giochi con piattaforme trovati:", games.length);
            if (games && games.length > 0) {
              const platformGames = games
                .map(
                  (g) =>
                    `${g.name} disponibile per ${
                      g.platforms || "Piattaforma non specificata"
                    } - €${g.promo_price || g.price}`
                )
                .join("; ");
              systemPrompt += ` Ecco i nostri giochi per piattaforma: ${platformGames}.`;
            }
          }
          callOpenAI(systemPrompt);
        }
      );
    }

    // 7. SVILUPPATORI
    else if (
      sviluppatoreKeywords.some((keyword) => lowerMessage.includes(keyword))
    ) {
      console.log("🔍 Query per sviluppatori...");

      connection.query(
        `
        SELECT developer, GROUP_CONCAT(name) as games, COUNT(*) as game_count
        FROM videogames 
        WHERE developer IS NOT NULL 
        GROUP BY developer
        ORDER BY game_count DESC
        LIMIT 4
      `,
        (error, developers) => {
          if (error) {
            console.log("❌ Errore query sviluppatori:", error);
            systemPrompt += " Abbiamo giochi di molti sviluppatori famosi.";
          } else {
            console.log("✅ Sviluppatori trovati:", developers.length);
            if (developers && developers.length > 0) {
              const devInfo = developers
                .map(
                  (d) => `${d.developer}: ${d.games} (${d.game_count} giochi)`
                )
                .join("; ");
              systemPrompt += ` Ecco i nostri sviluppatori e i loro giochi: ${devInfo}.`;
            }
          }
          callOpenAI(systemPrompt);
        }
      );
    }

    // 8. GIOCHI RECENTI
    else if (
      recentiKeywords.some((keyword) => lowerMessage.includes(keyword))
    ) {
      console.log("🔍 Query per giochi recenti...");

      connection.query(
        `
        SELECT name, price, promo_price, developer, release_date
  FROM videogames
  WHERE release_date >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
    AND release_date <= CURDATE()
  ORDER BY release_date DESC
  LIMIT 4
        `,
        (error, games) => {
          if (error) {
            console.log("❌ Errore query giochi recenti:", error);
            systemPrompt += " Al momento non ci sono giochi nuovi disponibili.";
          } else {
            console.log("Giochi recenti trovati:", games);
            if (games && games.length > 0) {
              const recentGames = games
                .map(
                  (g) =>
                    `${g.name} di ${g.developer || "N/A"} - €${
                      g.promo_price || g.price
                    } (uscito il ${g.release_date})`
                )
                .join("; ");
              systemPrompt += ` Ecco i giochi più recenti: ${recentGames}.`;
            } else {
              systemPrompt +=
                " Al momento non ci sono giochi nuovi usciti negli ultimi mesi.";
            }
          }
          callOpenAI(systemPrompt);
        }
      );
    }

    // 9. RICERCA GENERALE
    else {
      console.log("🔍 Ricerca generale...");

      connection.query(
        `
        SELECT v.name, v.price, v.promo_price, v.developer, v.description
        FROM videogames v 
        WHERE LOWER(v.name) LIKE ? OR LOWER(v.description) LIKE ? OR LOWER(v.developer) LIKE ? OR SOUNDEX(v.name) = SOUNDEX(?)
        LIMIT 4
      `,
        [
          `%${lowerMessage}%`,
          `%${lowerMessage}%`,
          `%${lowerMessage}%`,
          lowerMessage,
        ],
        (error, games) => {
          if (error) {
            console.log("❌ Errore ricerca generale:", error);
            systemPrompt += " Esplora il nostro vasto catalogo di videogiochi!";
          } else {
            console.log("✅ Ricerca generale:", games.length, "risultati");
            if (games && games.length > 0) {
              const searchResults = games
                .map(
                  (g) =>
                    `${g.name} di ${g.developer || "N/A"} - €${
                      g.promo_price || g.price
                    }`
                )
                .join("; ");
              systemPrompt += ` Ho trovato questi giochi correlati alla tua ricerca: ${searchResults}.`;
            } else {
              // Fallback: mostra giochi casuali
              connection.query(
                "SELECT name, price, promo_price FROM videogames ORDER BY RAND() LIMIT 4",
                (err, randomGames) => {
                  if (!err && randomGames.length > 0) {
                    const random = randomGames.map((g) => g.name).join(", ");
                    systemPrompt += ` Non ho trovato risultati specifici, ma ecco alcuni giochi che potresti apprezzare: ${random}.`;
                  } else {
                    systemPrompt +=
                      " Non ho trovato risultati specifici. Prova a essere più specifico nella tua ricerca.";
                  }
                  callOpenAI(systemPrompt);
                }
              );
              return; // Evita di chiamare callOpenAI due volte
            }
          }
          callOpenAI(systemPrompt);
        }
      );
    }
  } catch (error) {
    console.error("Errore generale nel chatbot:", error);
    res.status(500).json({ error: "Errore durante la risposta del chatbot" });
  }
});

export default router;
