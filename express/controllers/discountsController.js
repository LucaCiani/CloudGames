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
    if (err) return res.status(500).json({ error: "Internal server error" });
    // se non ci sono errori, restituiamo i risultati della query in formato JSON
    res.json(results);
  });
}

/* show (read) */
function show(req, res) {
  // estrae l'ID dalla URL e lo converte da stringa a numero
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });
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
async function store(req, res) {
  try {
    // estraiamo i dati (code, discount_percentage, ecc) dal corpo della richiesta HTTP
    const { code, discount_percentage, valid_from, expires_at } = req.body;

    const [existingCodes] = await connection
      .promise()
      .query("SELECT * FROM discounts WHERE code = ?", [code]);
    if (existingCodes.length > 0)
      return res.status(400).json({ error: "Code must be unique" });
    // MySQL DATETIME without timezone, e.g. "2025-09-05 12:34:56"
    const validFromSQLCompatible = new Date(valid_from)
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");
    const expiresAtSQLCompatible = new Date(expires_at)
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");

    // esegue la query passando i valori ricevuti come parametri
    const [results] = await connection
      .promise()
      .query(
        "INSERT INTO discounts ( code, discount_percentage, valid_from, expires_at ) VALUES (?, ?, ?, ?)",
        [
          code,
          discount_percentage,
          validFromSQLCompatible,
          expiresAtSQLCompatible,
        ]
      );
    return res.status(201).json({ created_id: results.insertId });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

/* update (edit) */
async function update(req, res) {
  try {
    // estraiamo l'ID del discount dalla URL
    const { id } = req.params;
    if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });

    const [existing] = await connection
      .promise()
      .query("SELECT * FROM discounts WHERE id = ?", [id]);
    if (existing.length === 0)
      return res.status(404).json({ error: "Discount not found" });

    // estraiamo i nuovi valori dal corpo della richiesta
    const { code, discount_percentage, valid_from, expires_at } = req.body;

    const [existingCodes] = await connection
      .promise()
      .query("SELECT * FROM discounts WHERE code = ? AND id != ?", [code, id]);
    if (existingCodes.length > 0)
      return res.status(400).json({ error: "Code must be unique" });

    // MySQL DATETIME without timezone, e.g. "2025-09-05 12:34:56"
    const validFromSQLCompatible = new Date(valid_from)
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");
    const expiresAtSQLCompatible = new Date(expires_at)
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");

    // esegue la query, passando i nuovi valori e l'ID
    await connection.promise().query(
      `
      UPDATE discounts
      SET code = ?, discount_percentage = ?, valid_from = ?, expires_at = ? WHERE id = ?
    `,
      [
        code,
        discount_percentage,
        validFromSQLCompatible,
        expiresAtSQLCompatible,
        id,
      ]
    );
    return res.status(204).send();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

/* modify (partial edit) */
async function modify(req, res) {
  try {
    // estraiamo l'ID del codice sconto dalla URL e lo convertiamo in numero
    const { id } = req.params;
    if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });

    const [existing] = await connection
      .promise()
      .query("SELECT * FROM discounts WHERE id = ?", [id]);
    if (existing.length === 0)
      return res.status(404).json({ error: "Discount not found" });

    // estraiamo i nuovi valori dal corpo della richiesta
    const { code, discount_percentage, valid_from, expires_at } = req.body;

    if (code) {
      const [existingCodes] = await connection
        .promise()
        .query("SELECT * FROM discounts WHERE code = ? AND id != ?", [
          code,
          id,
        ]);
      if (existingCodes.length > 0)
        return res.status(400).json({ error: "Code must be unique" });
    }

    const validFromSQLCompatible = valid_from
      ? new Date(valid_from).toISOString().slice(0, 19).replace("T", " ")
      : null;

    const expiresAtSQLCompatible = expires_at
      ? new Date(expires_at).toISOString().slice(0, 19).replace("T", " ")
      : null;
    // inizializziamo due array:
    // - 'fields' conterrà le parti dell'SQL da aggiornare
    // - 'values' conterrà i nuovi valori corrispondenti
    const fields = [];
    const values = [];
    // se è presente code e non è vuoto, lo aggiunge agli array
    if (code) {
      fields.push("code = ?");
      values.push(code);
    }
    // se è presente discount_percentage, lo aggiunge agli array
    if (discount_percentage !== undefined) {
      fields.push("discount_percentage = ?");
      values.push(discount_percentage);
    }
    // se è presente valid_from e non è vuoto, lo aggiunge agli array
    if (validFromSQLCompatible) {
      fields.push("valid_from = ?");
      values.push(validFromSQLCompatible);
    }
    // se è presente expires_at e non è vuoto, lo aggiunge agli array
    if (expiresAtSQLCompatible) {
      fields.push("expires_at = ?");
      values.push(expiresAtSQLCompatible);
    }
    // Se nessun campo è stato fornito per l'aggiornamento, restituisce errore
    if (fields.length === 0)
      return res.status(400).json({ error: "No fields to update" });
    // Costruisce dinamicamente la query SQL usando solo i campi forniti
    const sql = `UPDATE discounts SET ${fields.join(", ")} WHERE id = ?`;
    // Aggiunge l'ID alla fine dell'array dei valori (serve per il WHERE)
    values.push(id);
    // Esegue la query nel database
    await connection
      .promise()
      .query(`UPDATE discounts SET ${fields.join(", ")} WHERE id = ?`, values);

    return res.status(204).send();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

/* destroy (delete) */
function destroy(req, res) {
  // estrae l'ID dalla URL e lo converte da stringa a numero
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });

  // definiamo la query SQL per eliminare l'elemento dalla tabella "discounts"" con l'ID specificato
  const sql = "DELETE FROM discounts WHERE id = ?;";
  // esegue la query sul database, passando l'ID come parametro
  connection.query(sql, [id], (err, results) => {
    // gestisce eventuali errori durante l'esecuzione della query
    if (err) return res.status(500).json({ error: "Internal server error" });
    // verifichiamo se è stato effettivamente eliminato un elemento dalla tabella
    if (results.affectedRows === 0) {
      // se nessuna riga è stata eliminata, l'ID non esiste nel database e ci restituisce questo errore
      return res.status(404).json({ error: "Discount not found" });
    }
    // se l'eliminazione è avvenuta con successo, restituisce una conferma
    return res.status(204).send();
  });
}

// esportiamo tutto
export default { index, show, store, update, modify, destroy };
