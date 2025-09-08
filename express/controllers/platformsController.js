// importiamo il modulo "connection"
import connection from "../db/connection.js";

/* rotte CRUD */

/* index (read all) */
function index(req, res) {
  // definiamo una query SQL che seleziona tutta la tabella "platforms"
  const sql = "SELECT * FROM platforms";
  // eseguiamo la query usando la connessione al database
  connection.query(sql, (err, results) => {
    // se c'è un errore durante l'esecuzione della query, restituiamo un errore 500 al client
    if (err) return res.status(500).json({ error: "Internal server error" });
    // se non ci sono errori, restituiamo i risultati della query in formato JSON
    return res.json(results);
  });
}

/* show (read) */
function show(req, res) {
  // estrae l'ID del genere dalla URL e lo converte in numero
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });
  // definiamo la query SQL per selezionare un elemento dalla tabella "platforms" con l'ID specificato
  const sql = "SELECT * FROM platforms WHERE id = ? ;";
  // esegue la query sul database, passando l'ID come parametro
  connection.query(sql, [id], (err, results) => {
    // se si verifica un errore durante la connessione o l'esecuzione della query
    if (err) return res.status(500).json({ error: "Internal server error" });
    // se non viene trovato alcun risultato (l'ID non esiste nella tabella "platforms"),
    if (results.length === 0)
      return res.status(404).json({ error: "Platform not found" });
    // se l'elemento è stato trovato, lo restituisce come risposta JSON
    return res.json(results[0]);
  });
}

/* store (create) */
async function store(req, res) {
  try {
    // estraiamo i dati (name) dal corpo della richiesta HTTP
    const { name } = req.body;
    const [existingPlatforms] = await connection
      .promise()
      .query("SELECT * FROM platforms WHERE name = ?", [name]);
    if (existingPlatforms.length > 0)
      return res.status(400).json({ error: "Platform name must be unique" });

    // definiamo la query SQL per inserire un nuovo elemento nella tabella "platforms"
    const sql = "INSERT INTO platforms ( name ) VALUES ( ? ) ;";
    // esegue la query passando i valori ricevuti come parametri
    const [results] = await connection.promise().query(sql, [name]);
    return res.status(201).json({ created_id: results.insertId });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

/* update (edit) */
async function update(req, res) {
  try {
    // estraiamo l'ID del genere dalla URL
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });
    const [existingPlatforms] = await connection
      .promise()
      .query("SELECT * FROM platforms WHERE id = ?", [id]);
    if (existingPlatforms.length === 0)
      return res.status(404).json({ error: "Platform not found" });
    // estraiamo i nuovi valori dal corpo della richiesta
    const { name } = req.body;
    // definiamo la query SQL per aggiornare l'elemento nella tabella "platforms" con l'ID specificato
    const sql = "UPDATE platforms SET name = ? WHERE id = ? ;";
    // esegue la query passando i nuovi valori e l'ID come parametri
    await connection.promise().query(sql, [name, id]);
    // se tutto è andato bene, restituisce un messaggio di successo
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
  // definiamo la query SQL per eliminare l'elemento dalla tabella "platforms" con l'ID specificato
  const sql = "DELETE FROM platforms WHERE id = ? ;";
  // esegue la query sul database, passando l'ID come parametro
  connection.query(sql, [id], (err, results) => {
    // gestisce eventuali errori durante l'esecuzione della query
    if (err) return res.status(500).json({ error: "Internal server error" });
    // verifichiamo se è stato effettivamente eliminato un elemento dalla tabella
    if (results.affectedRows === 0) {
      // se nessuna riga è stata eliminata, l'ID non esiste nel database e ci restituisce questo errore
      return res.status(404).json({ error: "Platform not found" });
    }
    // se l'eliminazione è avvenuta con successo, restituisce una conferma
    return res.status(204).send();
  });
}

// esportiamo tutto
export default { index, show, store, update, destroy };
