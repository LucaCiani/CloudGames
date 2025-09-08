// importiamo il modulo "connection"
import connection from "../db/connection.js";

/* rotte CRUD */

/* index (read all) */
function index(req, res) {
  // definiamo una query SQL che seleziona tutta la tabella "discounts"
  const sql = "SELECT * FROM discounts";
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
  // estrae l'ID dalla URL e lo converte da stringa a numero
  const id = parseInt(req.params.id);

  if (!id || isNaN(id))
    return res.status(400).json({ error: "Invalid request" });
  // definiamo la query SQL per selezionare un singolo codice sconto tramite ID
  const sql = "SELECT * FROM discounts WHERE id = ? ;";
  // esegue la query sul database, passando l'ID come parametro
  connection.query(sql, [id], (err, results) => {
    // se si verifica un errore durante la connessione o l'esecuzione della query
    if (err) return res.status(500).json({ error: "Internal server error" });
    // se non viene trovato alcun risultato (l'ID non esiste nella tabella "discounts"),
    if (results.length === 0)
      return res.status(404).json({ error: "Discount not found" });
    // se l'elemento è stato trovato, lo restituisce come risposta JSON
    return res.json(results[0]);
  });
}

/* store (create) */
function store(req, res) {
  // estraiamo i dati (code, discount_percentage, ecc) dal corpo della richiesta HTTP
  const { code, discount_percentage, valid_from, expires_at } = req.body;
  // definiamo la query SQL per inserire un elemento dalla tabella "discounts"
  const sql =
    "INSERT INTO discounts ( code, discount_percentage, valid_from, expires_at ) VALUES (?, ?, ?, ?)";
  // esegue la query passando i valori ricevuti come parametri
  connection.query(
    sql,
    [code, discount_percentage, valid_from, expires_at],
    (err, results) => {
      // se c'è un errore durante l'inserimento nel database
      if (err)
        return res.status(500).json({ error: "Failed to insert discount" });
      // se l'inserimento ha successo, restituisce lo status 201 (Created)
      res.status(201);
      // e un oggetto JSON contenente l'ID del nuovo post creato
      res.json({ id: results.insertId });
    }
  );
}

/* update (edit) */
function update(req, res) {
  // estraiamo l'ID del discount dalla URL
  const { id } = req.params;
  // estraiamo i nuovi valori dal corpo della richiesta
  const { code, discount_percentage, valid_from, expires_at } = req.body;
  // definiamo la query SQL per aggiornare un codice sconto
  const sql = `
    UPDATE discounts
    SET code = ?, discount_percentage = ?, valid_from = ?, expires_at = ? WHERE id = ?
  `;
  // esegue la query, passando i nuovi valori e l'ID
  connection.query(
    sql,
    [code, discount_percentage, valid_from, expires_at, id],
    (err, results) => {
      // se si verifica un errore durante la query
      if (err)
        return res.status(500).json({ error: "Failed to update discount" });
      // se nessuna riga è stata modificata, il codice sconto  con quell'ID non esiste
      if (results.affectedRows === 0) {
        // quindi restituisce un errore
        return res.status(404).json({ error: "Discount not found" });
      }
      // altrimenti conferma l'aggiornamento
      res.json({ message: "Discount updated successfully" });
    }
  );
}

/* modify (partial edit) */
function modify(req, res) {
  // estraiamo l'ID del codice sconto dalla URL e lo convertiamo in numero
  const { id } = req.params;
  if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });
  // estraiamo i nuovi valori dal corpo della richiesta
  const { code, discount_percentage, valid_from, expires_at } = req.body;
  // inizializziamo due array:
  // - 'fields' conterrà le parti dell'SQL da aggiornare
  // - 'values' conterrà i nuovi valori corrispondenti
  const fields = [];
  const values = [];
  // se è presente code e non è vuoto, lo aggiunge agli array
  if (code && code.length > 0) {
    fields.push("code = ?");
    values.push(code);
  }
  // se è presente discount_percentage, lo aggiunge agli array
  if (discount_percentage !== undefined) {
    fields.push("discount_percentage = ?");
    values.push(discount_percentage);
  }
  // se è presente valid_from e non è vuoto, lo aggiunge agli array
  if (valid_from && valid_from.length > 0) {
    fields.push("valid_from = ?");
    values.push(valid_from);
  }
  // se è presente expires_at e non è vuoto, lo aggiunge agli array
  if (expires_at && expires_at.length > 0) {
    fields.push("expires_at = ?");
    values.push(expires_at);
  }
  // Se nessun campo è stato fornito per l'aggiornamento, restituisce errore
  if (fields.length === 0)
    return res.status(400).json({ error: "No fields to update" });
  // Costruisce dinamicamente la query SQL usando solo i campi forniti
  const sql = `UPDATE discounts SET ${fields.join(", ")} WHERE id = ?`;
  // Aggiunge l'ID alla fine dell'array dei valori (serve per il WHERE)
  values.push(id);
  // Esegue la query nel database
  connection.query(sql, values, (err, results) => {
    // Gestisce eventuali errori della query
    if (err)
      return res.status(500).json({ error: "Failed to modify discount" });
    // Se nessun codice sconto è stata modificato (id non trovato), restituisce errore 404
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: "Discount not found" });
    }
    // Se tutto è andato bene, restituisce un messaggio di successo
    res.status(204).send();
  });
}

/* destroy (delete) */
function destroy(req, res) {
  // estrae l'ID dalla URL e lo converte da stringa a numero
  const id = parseInt(req.params.id);
  // definiamo la query SQL per eliminare l'elemento dalla tabella "discounts"" con l'ID specificato
  const sql = "DELETE FROM discounts WHERE id = ?;";
  // esegue la query sul database, passando l'ID come parametro
  connection.query(sql, [id], (err, results) => {
    // gestisce eventuali errori durante l'esecuzione della query
    if (err)
      return res.status(500).json({ error: "Failed to delete discount" });
    // verifichiamo se è stato effettivamente eliminato un elemento dalla tabella
    if (results.affectedRows === 0) {
      // se nessuna riga è stata eliminata, l'ID non esiste nel database e ci restituisce questo errore
      return res.status(404).json({ error: "Discount not found" });
    }
    // se l'eliminazione è avvenuta con successo, restituisce una conferma
    return res.json({ message: "Discount deleted successfully" });
  });
}

// esportiamo tutto
export default { index, show, store, update, modify, destroy };
