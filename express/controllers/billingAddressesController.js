// importiamo il modulo "connection"
import connection from "../db/connection.js";

/* rotte CRUD */

/* index (read all) */
function index(req, res) {
  // definiamo una query SQL che seleziona tutta la tabella "discounts"
  const sql = "SELECT * FROM billing_addresses";
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
  const sql = "SELECT * FROM billing_addresses WHERE id = ? ;";
  // esegue la query sul database, passando l'ID come parametro
  connection.query(sql, [id], (err, results) => {
    // se si verifica un errore durante la connessione o l'esecuzione della query
    if (err) return res.status(500).json({ error: "Internal server error" });
    // se non viene trovato alcun risultato (l'ID non esiste nella tabella "discounts"),
    if (results.length === 0)
      return res.status(404).json({ error: "Billing address not found" });
    // se l'elemento è stato trovato, lo restituisce come risposta JSON
    return res.json(results[0]);
  });
}

/* store (create) */
function store(req, res) {
  // estraiamo i dati (invoice_id, full_name, ecc) dal corpo della richiesta HTTP
  const { invoice_id, full_name, address_line, city, postal_code, country } =
    req.body;

  if (
    (invoice_id && isNaN(invoice_id)) ||
    !full_name ||
    !address_line ||
    !city ||
    !postal_code ||
    isNaN(postal_code) ||
    !country
  )
    return res.status(400).json({ error: "Invalid request" });

  // definiamo la query SQL per inserire un nuovo indirizzo di fatturazione
  const sql = `
    INSERT INTO billing_addresses 
    (invoice_id, full_name, address_line, city, postal_code, country, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  // MySQL DATETIME without timezone, e.g. "2025-09-05 12:34:56"
  const created_at = new Date().toISOString().slice(0, 19).replace("T", " ");

  // esegue la query passando i valori ricevuti come parametri
  connection.query(
    sql,
    [
      invoice_id || null,
      full_name,
      address_line,
      city,
      postal_code,
      country,
      created_at,
    ],
    (err, results) => {
      // se c'è un errore durante l'inserimento nel database
      if (err) {
        console.log(err);
        return res.status(500).json({ error: "Internal server error" });
      }

      // e un oggetto JSON contenente l'ID del nuovo indirizzo di fatturazione
      res.json({ id: results.insertId });
    }
  );
}

/* update (edit) */
function update(req, res) {
  // estraiamo l'ID del post dalla URL
  const { id } = req.params;
  // estraiamo i nuovi valori dal corpo della richiesta
  const { invoice_id, full_name, address_line, city, postal_code, country } =
    req.body;
  // definiamo la query SQL per aggiornare un indirizzo di fatturazione esistente
  const sql = `
    UPDATE billing_addresses
    SET invoice_id = ?, full_name = ?, address_line = ?, city = ?, postal_code = ?, country = ? WHERE id = ?
  `;
  // esegue la query, passando i nuovi valori e l'ID
  connection.query(
    sql,
    [invoice_id, full_name, address_line, city, postal_code, country, id],
    (err, results) => {
      // se si verifica un errore durante la query
      if (err)
        return res
          .status(500)
          .json({ error: "Failed to update billing address" });
      // se nessuna riga è stata modificata, l'indirizzo di fatturazione con quell'ID non esiste
      if (results.affectedRows === 0) {
        // quindi restituisce un errore
        return res.status(404).json({ error: "Billing address not found" });
      }
      // altrimenti conferma l'aggiornamento
      res.json({ message: "Billing address updated successfully" });
    }
  );
}

/* modify (partial edit) */
async function modify(req, res) {
  // estraiamo l'ID del videogioco dalla URL
  const { id } = req.params;
  // estraiamo i dati (invoice_id, full_name, ecc) dal corpo della richiesta HTTP
  const { invoice_id, full_name, address_line, city, postal_code, country } =
    req.body;

  if (!id || isNaN(id))
    return res.status(400).json({ error: "Invalid request" });

  // inizializziamo due array:
  // - 'fields' conterrà le parti dell'SQL da aggiornare
  // - 'values' conterrà i nuovi valori corrispondenti
  const fields = [];
  const values = [];
  // se è presente il nome e non è vuoto, lo aggiunge agli array
  if (invoice_id && !isNaN(invoice_id)) {
    const [results] = await connection
      .promise()
      .query("SELECT * FROM invoices WHERE id = ?", [invoice_id]);

    if (results.length === 0)
      return res.status(400).json({ error: "Invalid request" });

    fields.push("invoice_id = ?");
    values.push(invoice_id);
  }
  // se è presente la descrizione e non è vuota, la aggiunge agli array
  if (full_name) {
    fields.push("full_name = ?");
    values.push(full_name);
  }
  // se è presente il prezzo, lo aggiunge agli array
  if (address_line) {
    fields.push("address_line = ?");
    values.push(address_line);
  }
  // se è presente il prezzo promozionale, lo aggiunge agli array
  if (city) {
    fields.push("city = ?");
    values.push(city);
  }
  // se è presente lo sviluppatore e non è vuoto, lo aggiunge agli array
  if (postal_code && !isNaN(postal_code)) {
    fields.push("postal_code = ?");
    values.push(postal_code);
  }
  // se è presente la data di rilascio e non è vuota, la aggiunge agli array
  if (country) {
    fields.push("country = ?");
    values.push(country);
  }
  // Se nessun campo è stato fornito per l'aggiornamento, restituisce errore
  if (fields.length === 0)
    return res.status(400).json({ error: "Invalid request" });

  // Costruisce dinamicamente la query SQL usando solo i campi forniti
  const sql = `UPDATE billing_addresses SET ${fields.join(", ")} WHERE id = ?`;
  // Aggiunge l'ID alla fine dell'array dei valori (serve per il WHERE)
  values.push(id);
  // Esegue la query nel database
  connection.query(sql, values, (err, results) => {
    // Gestisce eventuali errori della query
    if (err) {
      console.error(err);
      return res
        .status(500)
        .json({ error: "Failed to modify billing address" });
    }
    // Se nessun videogioco è stato modificato (id non trovato), restituisce errore 404
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: "Billing address not found" });
    }
    // Se tutto è andato bene, restituisce un messaggio di successo
    res.status(204).send();
  });
}

/* destroy (delete) */
function destroy(req, res) {
  // estrae l'ID dalla URL e lo converte da stringa a numero
  const id = parseInt(req.params.id);
  // definiamo la query SQL per eliminare l'elemento dalla tabella "billing_addresses"" con l'ID specificato
  const sql = "DELETE FROM billing_addresses WHERE id = ? ;";
  // esegue la query sul database, passando l'ID come parametro
  connection.query(sql, [id], (err, results) => {
    // gestisce eventuali errori durante l'esecuzione della query
    if (err)
      return res
        .status(500)
        .json({ error: "Failed to delete billing address" });
    // verifichiamo se è stato effettivamente eliminato un elemento dalla tabella
    if (results.affectedRows === 0) {
      // se nessuna riga è stata eliminata, l'ID non esiste nel database e ci restituisce questo errore
      return res.status(404).json({ error: "Billing address not found" });
    }
    // se l'eliminazione è avvenuta con successo, restituisce una conferma
    return res.json({ message: "Billing address deleted successfully" });
  });
}

// esportiamo tutto
export default { index, show, store, update, modify, destroy };
