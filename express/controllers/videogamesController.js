// importiamo l'array posts
const videogames = require("../data/videogames");

// importiamo il modulo "connection"
const connection = require("../db/connection");

/* rotte CRUD */

/* index (read all) */
function index(req, res) {
  // definiamo una query SQL che seleziona tutta la tabella "videogames"
  const sql = "SELECT * FROM videogames";
  // eseguiamo la query usando la connessione al database
  connection.query(sql, (err, results) => {
    // se c'è un errore durante l'esecuzione della query, restituiamo un errore 500 al client
    if (err) return res.status(500).json({ error: "Database query failed" });
    // se non ci sono errori, restituiamo i risultati della query in formato JSON
    res.json(results);
  });
}

/* show (read) */
function show(req, res) {
  // estrae l'ID dalla URL e lo converte da stringa a numero
  const id = parseInt(req.params.id);
  // definiamo la query SQL per selezionare un videogioco tramite ID
  const sql = "SELECT * FROM videogames WHERE id = ? ;";
  // esegue la query sul database, passando l'ID come parametro
  connection.query(sql, [id], (err, results) => {
    // se si verifica un errore durante la connessione o l'esecuzione della query
    if (err) return res.status(500).json({ error: "Database query failed" });
    // se non viene trovato alcun risultato (l'ID non esiste nella tabella "posts"),
    if (results.length === 0)
      return res.status(404).json({ error: "Videogioco not found" });
    // se l'elemento è stato trovato, lo restituisce come risposta JSON
    return res.json(results[0]);
  });
}

/* store (create) */
function store(req, res) {
  // estraiamo i dati (name, description, price, ecc) dal corpo della richiesta HTTP
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
  // definiamo la query SQL per inserire un nuovo videogioco
  const sql = `
    INSERT INTO videogames 
    (name, description, price, promo_price, developer, release_date, image_url, quantity, vote)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  // esegue la query passando i valori ricevuti come parametri
  connection.query(
    sql,
    [
      name,
      description,
      price,
      promo_price,
      developer,
      release_date,
      image_url,
      quantity,
      vote,
    ],
    (err, results) => {
      // se c'è un errore durante l'inserimento nel database
      if (err)
        return res.status(500).json({ error: "Failed to insert videogame" });
      // se l'inserimento ha successo, restituisce lo status 201 (Created)
      res.status(201);
      // e un oggetto JSON contenente l'ID del nuovo post creato
      res.json({ id: results.insertId });
    }
  );
}

/* update (edit) */
function update(req, res) {
  // estraiamo l'ID del videogioco dalla URL
  const { id } = req.params;
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
  // definiamo la query SQL per aggiornare un videogioco esistente
  const sql = `
    UPDATE videogames 
    SET name = ?, description = ?, price = ?, promo_price = ?, developer = ?, release_date = ?, image_url = ?, quantity = ?, vote = ? 
    WHERE id = ?
  `;
  // esegue la query, passando i nuovi valori e l'ID
  connection.query(
    sql,
    [
      name,
      description,
      price,
      promo_price,
      developer,
      release_date,
      image_url,
      quantity,
      vote,
      id,
    ],
    (err, results) => {
      // se si verifica un errore durante la query
      if (err)
        return res.status(500).json({ error: "Failed to update videogame" });
      // se nessuna riga è stata modificata, il post con quell'ID non esiste
      if (results.affectedRows === 0) {
        // quindi restituisce un errore
        return res.status(404).json({ error: "Videogame not found" });
      }
      // altrimenti conferma l'aggiornamento
      res.json({ message: "Videogame update successfully" });
    }
  );
}

/* modify (partial edit) */
function modify(req, res) {
  // estraiamo l'ID del videogioco dalla URL
  const { id } = req.params;
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
  if (fields.length === 0) {
    return res.status(400).json({ error: "No fields to update" });
  }
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

/* destroy (delete) */
function destroy(req, res) {
  // estrae l'ID dalla URL e lo converte da stringa a numero
  const id = parseInt(req.params.id);
  // definiamo la query SQL per eliminare un videogioco tramite ID
  const sql = "DELETE FROM videogames WHERE id = ? ;";
  // esegue la query sul database, passando l'ID come parametro
  connection.query(sql, [id], (err, results) => {
    // gestisce eventuali errori durante l'esecuzione della query
    if (err)
      return res.status(500).json({ error: "Failed to delete videogame" });
    // verifichiamo se è stato effettivamente eliminato un elemento dalla tabella
    if (results.affectedRows === 0) {
      // se nessuna riga è stata eliminata, l'ID non esiste nel database e ci restituisce questo errore
      return res.status(404).json({ error: "Videogame not found" });
    }
    // se l'eliminazione è avvenuta con successo, restituisce una conferma
    return res.json({ message: "Videogioco deleted successfully" });
  });
}

// esportiamo tutto
module.exports = { index, show, store, update, modify, destroy };
