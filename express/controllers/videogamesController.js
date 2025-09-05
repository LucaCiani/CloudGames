// importiamo il modulo "connection"
import connection from "../db/connection.js";

/* rotte CRUD */

/* index (read all) */
function index(req, res) {
  // definiamo una query SQL che seleziona tutta la tabella "videogames"
  const sql = `
  SELECT
    v.id,
    v.name,
    v.description,
    v.price,
    v.promo_price,
    v.developer,
    v.release_date,
    v.image_url,
    v.quantity,
    v.vote,
    GROUP_CONCAT(DISTINCT p.name) AS platforms,
    GROUP_CONCAT(DISTINCT g.name) AS genres,
    GROUP_CONCAT(DISTINCT m.media_url) AS media_urls
  FROM videogames AS v
  LEFT JOIN platform_videogame AS pv ON v.id = pv.videogame_id
  LEFT JOIN platforms AS p ON pv.platform_id = p.id
  LEFT JOIN videogame_genre AS vg ON v.id = vg.videogame_id
  LEFT JOIN genres AS g ON vg.genre_id = g.id
  LEFT JOIN media AS m ON v.id = m.videogame_id
  GROUP BY v.id;`;
  // eseguiamo la query usando la connessione al database
  connection.query(sql, (err, results) => {
    // se c'è un errore durante l'esecuzione della query, restituiamo un errore 500 al client
    if (err) return res.status(500).json({ error: "Internal server error" });
    // se non ci sono errori, restituiamo i risultati della query in formato JSON

    const formattedResult = results.map((result) => {
      return {
        id: result.id,
        name: result.name,
        description: result.description,
        price: result.price,
        promo_price: result.promo_price,
        developer: result.developer,
        release_date: result.release_date,
        image_url: result.image_url,
        quantity: result.quantity,
        vote: result.vote,
        platforms: result.platforms?.split(","),
        genres: result.genres?.split(","),
        media: result.media_urls?.split(",").map((media_url) => {
          if (media_url.includes("https://www.youtube.com/embed/")) {
            return {
              type: "video",
              url: media_url,
            };
          } else {
            return {
              type: "img",
              url: media_url,
            };
          }
        }),
      };
    });

    res.json(formattedResult);
  });
}

/* show (read) */
function show(req, res) {
  // estrae l'ID dalla URL e lo converte da stringa a numero
  const { id } = req.params;
  if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });
  // definiamo la query SQL per selezionare un videogioco tramite ID
  const sql = `
  SELECT
    v.id,
    v.name,
    v.description,
    v.price,
    v.promo_price,
    v.developer,
    v.release_date,
    v.image_url,
    v.quantity,
    v.vote,
    GROUP_CONCAT(DISTINCT p.name) AS platforms,
    GROUP_CONCAT(DISTINCT g.name) AS genres,
    GROUP_CONCAT(DISTINCT m.media_url) AS media_urls
  FROM videogames AS v
  LEFT JOIN platform_videogame AS pv ON v.id = pv.videogame_id
  LEFT JOIN platforms AS p ON pv.platform_id = p.id
  LEFT JOIN videogame_genre AS vg ON v.id = vg.videogame_id
  LEFT JOIN genres AS g ON vg.genre_id = g.id
  LEFT JOIN media AS m ON v.id = m.videogame_id
  WHERE v.id = ?
  GROUP BY v.id;`;
  // esegue la query sul database, passando l'ID come parametro
  connection.query(sql, [id], (err, results) => {
    // se si verifica un errore durante la connessione o l'esecuzione della query
    if (err) return res.status(500).json({ error: "Internal server error" });
    // se non viene trovato alcun risultato (l'ID non esiste nella tabella "videogames"),
    if (results.length === 0)
      return res.status(404).json({ error: "Videogames not found" });
    // se l'elemento è stato trovato, lo restituisce come risposta JSON

    const formattedResult = results.map((result) => {
      return {
        id: result.id,
        name: result.name,
        description: result.description,
        price: result.price,
        promo_price: result.promo_price,
        developer: result.developer,
        release_date: result.release_date,
        image_url: result.image_url,
        quantity: result.quantity,
        vote: result.vote,
        platforms: result.platforms?.split(","),
        genres: result.genres?.split(","),
        media: result.media_urls?.split(",").map((media_url) => {
          if (media_url.includes("https://www.youtube.com/embed/")) {
            return {
              type: "video",
              url: media_url,
            };
          } else {
            return {
              type: "img",
              url: media_url,
            };
          }
        }),
      };
    });

    return res.json(formattedResult);
  });
}

/* modify (partial edit) */
function modify(req, res) {
  // estraiamo l'ID del videogioco dalla URL
  const { id } = req.params;
  if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });
  // estraiamo i nuovi valori dal corpo della richiesta
  const {
    name,
    description,
    price,
    promo_price,
    developer,
    release_date,
    image_url,
    quantity,
    vote,
  } = req.body;
  // inizializziamo due array:
  // - 'fields' conterrà le parti dell'SQL da aggiornare
  // - 'values' conterrà i nuovi valori corrispondenti
  const fields = [];
  const values = [];
  // se è presente il nome e non è vuoto, lo aggiunge agli array
  if (name && name.length > 0) {
    fields.push("name = ?");
    values.push(name);
  }
  // se è presente la descrizione e non è vuota, la aggiunge agli array
  if (description && description.length > 0) {
    fields.push("description = ?");
    values.push(description);
  }
  // se è presente il prezzo, lo aggiunge agli array
  if (price !== undefined) {
    fields.push("price = ?");
    values.push(price);
  }
  // se è presente il prezzo promozionale, lo aggiunge agli array
  if (promo_price !== undefined) {
    fields.push("promo_price = ?");
    values.push(promo_price);
  }
  // se è presente lo sviluppatore e non è vuoto, lo aggiunge agli array
  if (developer && developer.length > 0) {
    fields.push("developer = ?");
    values.push(developer);
  }
  // se è presente la data di rilascio e non è vuota, la aggiunge agli array
  if (release_date && release_date.length > 0) {
    fields.push("release_date = ?");
    values.push(release_date);
  }
  // se è presente l'URL dell'immagine e non è vuoto, lo aggiunge agli array
  if (image_url && image_url.length > 0) {
    fields.push("image_url = ?");
    values.push(image_url);
  }
  // se è presente la quantità, la aggiunge agli array
  if (quantity !== undefined) {
    fields.push("quantity = ?");
    values.push(quantity);
  }
  // se è presente il voto, lo aggiunge agli array
  if (vote !== undefined) {
    fields.push("vote = ?");
    values.push(vote);
  }
  // Se nessun campo è stato fornito per l'aggiornamento, restituisce errore
  if (fields.length === 0)
    return res.status(400).json({ error: "No fields to update" });

  // Costruisce dinamicamente la query SQL usando solo i campi forniti
  const sql = `UPDATE videogames SET ${fields.join(", ")} WHERE id = ?`;
  // Aggiunge l'ID alla fine dell'array dei valori (serve per il WHERE)
  values.push(id);
  // Esegue la query nel database
  connection.query(sql, values, (err, results) => {
    // Gestisce eventuali errori della query
    if (err)
      return res.status(500).json({ error: "Failed to modify videogame" });
    // Se nessun videogioco è stato modificato (id non trovato), restituisce errore 404
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: "Videogame not found" });
    }
    // Se tutto è andato bene, restituisce un messaggio di successo
    res.json({ message: "Videogame updated successfully" });
  });
}

// esportiamo tutto
export default { index, show, modify };
