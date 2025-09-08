// importiamo il modulo "connection"
import connection from "../db/connection.js";

/* rotte CRUD */

/* index (read all) */
function index(req, res) {
  // definiamo una query SQL che seleziona tutta la tabella "media"
  const sql = "SELECT * FROM media";
  // eseguiamo la query usando la connessione al database
  connection.query(sql, (err, results) => {
    // se c'è un errore durante l'esecuzione della query, restituiamo un errore 500 al client
    if (err) return res.status(500).json({ error: "Internal error" });
    // se non ci sono errori, restituiamo i risultati della query in formato JSON

    const formattedResults = results.map((media) => {
      return {
        id: media.id,
        videogame_id: media.videogame_id,
        type: media.type,
        url: media.media_url,
      };
    });

    return res.json(formattedResults);
  });
}

/* show (read) */
function show(req, res) {
  // estrae l'ID del genere dalla URL e lo converte in numero
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });
  // definiamo la query SQL per selezionare un elemento dalla tabella "media" con l'ID specificato
  const sql = "SELECT * FROM media WHERE id = ? ;";
  // esegue la query sul database, passando l'ID come parametro
  connection.query(sql, [id], (err, results) => {
    // se si verifica un errore durante la connessione o l'esecuzione della query
    if (err) return res.status(500).json({ error: "Internal server error" });
    // se non viene trovato alcun risultato (l'ID non esiste nella tabella "media"),
    if (results.length === 0)
      return res.status(404).json({ error: "Media not found" });
    // se l'elemento è stato trovato, lo restituisce come risposta JSON

    const formattedResult = {
      id: results[0].id,
      videogame_id: results[0].videogame_id,
      type: results[0].type,
      url: results[0].media_url,
    };

    return res.json(formattedResult);
  });
}

/* store (create) */
async function store(req, res) {
  try {
    // estraiamo i dati (videogame_id, media_url, type) dal corpo della richiesta HTTP
    const { videogame_id, url, type } = req.body;
    if (videogame_id) {
      const [results] = await connection
        .promise()
        .query("SELECT * FROM videogames WHERE id = ?", [videogame_id]);
      if (results.length === 0)
        return res.status(400).json({ error: "Invalid videogame_id" });
    }

    // definiamo la query SQL per inserire un nuovo elemento nella tabella "media"
    const sql =
      "INSERT INTO media ( videogame_id, media_url, type ) VALUES ( ?, ?, ? ) ;";
    // esegue la query passando i valori ricevuti come parametri
    const [results] = await connection
      .promise()
      .query(sql, [videogame_id, url, type]);
    return res.status(201).json({ created_id: results.insertId });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

/* update (edit) */
async function update(req, res) {
  try {
    // estraiamo l'ID del media dalla URL e lo convertiamo in numero
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });
    const [exists] = await connection
      .promise()
      .query("SELECT * FROM media WHERE id = ?", [id]);
    if (exists.length === 0)
      return res.status(404).json({ error: "Media not found" });
    const { videogame_id, url, type } = req.body;

    const [results] = await connection
      .promise()
      .query("SELECT * FROM videogames WHERE id = ?", [videogame_id]);
    if (results.length === 0)
      return res.status(400).json({ error: "Invalid videogame_id" });

    // definiamo la query SQL per aggiornare l'elemento nella tabella "media" con l'ID specificato
    const sql =
      "UPDATE media SET videogame_id = ?, media_url = ?, type = ? WHERE id = ? ;";
    // esegue la query passando i nuovi valori ricevuti come parametri
    await connection.promise().query(sql, [videogame_id, url, type, id]);
    return res.status(204).send();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

/* modify (partial edit) */
async function modify(req, res) {
  try {
    // estraiamo l'ID del media dalla URL
    const { id } = req.params;
    if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });
    const [exists] = await connection
      .promise()
      .query("SELECT * FROM media WHERE id = ?", [id]);
    if (exists.length === 0)
      return res.status(404).json({ error: "Media not found" });

    // estraiamo i nuovi valori dal corpo della richiesta
    const { videogame_id, url, type } = req.body;
    if (videogame_id) {
      const [results] = await connection
        .promise()
        .query("SELECT * FROM videogames WHERE id = ?", [videogame_id]);
      if (results.length === 0)
        return res.status(400).json({ error: "Invalid videogame_id" });
    }
    // inizializziamo due array:
    // - 'fields' conterrà le parti dell'SQL da aggiornare
    // - 'values' conterrà i nuovi valori corrispondenti
    const fields = [];
    const values = [];
    // se è presente videogame_id, lo aggiunge agli array
    if (videogame_id) {
      fields.push("videogame_id = ?");
      values.push(videogame_id);
    }
    // se è presente media_url e non è vuoto, lo aggiunge agli array
    if (url) {
      fields.push("media_url = ?");
      values.push(url);
    }
    // se è presente type e non è vuoto, lo aggiunge agli array
    if (type) {
      fields.push("type = ?");
      values.push(type);
    }
    // Se nessun campo è stato fornito per l'aggiornamento, restituisce errore
    if (fields.length === 0) {
      return res.status(400).json({ error: "No fields to update" });
    }
    // Costruisce dinamicamente la query SQL usando solo i campi forniti
    const sql = `UPDATE media SET ${fields.join(", ")} WHERE id = ?`;
    // Aggiunge l'ID alla fine dell'array dei valori (serve per il WHERE)
    values.push(id);
    // Esegue la query nel database
    await connection.promise().query(sql, values);
    return res.status(204).send();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

/* destroy (delete) */
function destroy(req, res) {
  // estrae l'ID dei media dalla URL e lo converte in numero
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });
  // definiamo la query SQL per eliminare l'elemento dalla tabella "media" con l'ID specificato
  const sql = "DELETE FROM media WHERE id = ? ;";
  // esegue la query sul database, passando l'ID come parametro
  connection.query(sql, [id], (err, results) => {
    // gestisce eventuali errori durante l'esecuzione della query
    if (err) return res.status(500).json({ error: "Internal server error" });
    // verifichiamo se è stato effettivamente eliminato un elemento dalla tabella
    if (results.affectedRows === 0) {
      // se nessuna riga è stata eliminata, l'ID non esiste nel database e ci restituisce questo errore
      return res.status(404).json({ error: "Media not found" });
    }
    // se l'eliminazione è avvenuta con successo, restituisce una conferma
    return res.status(204).send();
  });
}

// esportiamo tutto
export default { index, show, store, update, modify, destroy };
