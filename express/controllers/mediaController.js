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
    res.json(results);
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
    if (err) return res.status(500).json({ error: "Database query failed" });
    // se non viene trovato alcun risultato (l'ID non esiste nella tabella "media"),
    if (results.length === 0)
      return res.status(404).json({ error: "Media not found" });
    // se l'elemento è stato trovato, lo restituisce come risposta JSON
    return res.json(results[0]);
  });
}

/* store (create) */

/* update (edit) */

/* modify (partial edit) */
function modify(req, res) {
  // estraiamo l'ID del media dalla URL
  const { id } = req.params;
  if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });
  // estraiamo i nuovi valori dal corpo della richiesta
  const { videogame_id, media_url, type } = req.body;
  // inizializziamo due array:
  // - 'fields' conterrà le parti dell'SQL da aggiornare
  // - 'values' conterrà i nuovi valori corrispondenti
  const fields = [];
  const values = [];
  // se è presente videogame_id, lo aggiunge agli array
  if (videogame_id !== undefined) {
    fields.push("videogame_id = ?");
    values.push(videogame_id);
  }
  // se è presente media_url e non è vuoto, lo aggiunge agli array
  if (media_url && media_url.length > 0) {
    fields.push("media_url = ?");
    values.push(media_url);
  }
  // se è presente type e non è vuoto, lo aggiunge agli array
  if (type && type.length > 0) {
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
  connection.query(sql, values, (err, results) => {
    // Gestisce eventuali errori della query
    if (err) return res.status(500).json({ error: "Failed to modify media" });
    // Se nessun media è stato modificato (id non trovato), restituisce errore 404
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: "Media not found" });
    }
    // Se tutto è andato bene, restituisce un messaggio di successo
    res.status(204).send();
  });
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
    if (err) return res.status(500).json({ error: "Failed to delete media" });
    // verifichiamo se è stato effettivamente eliminato un elemento dalla tabella
    if (results.affectedRows === 0) {
      // se nessuna riga è stata eliminata, l'ID non esiste nel database e ci restituisce questo errore
      return res.status(404).json({ error: "Media not found" });
    }
    // se l'eliminazione è avvenuta con successo, restituisce una conferma
    return res.json({ message: "Media deleted successfully" });
  });
}

// esportiamo tutto
export default { index, show, store, update, modify, destroy };
