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
async function store(req, res) {
  try {
    // estraiamo i dati (invoice_id, full_name, ecc) dal corpo della richiesta HTTP
    const { invoice_id, full_name, address_line, city, postal_code, country } =
      req.body;

    if (invoice_id) {
      const [results] = await connection
        .promise()
        .query("SELECT * FROM invoices WHERE id = ?", [invoice_id]);
      if (results.length === 0)
        return res.status(400).json({ error: "Invalid invoice_id" });
    }

    // MySQL DATETIME without timezone, e.g. "2025-09-05 12:34:56"
    const created_at = new Date().toISOString().slice(0, 19).replace("T", " ");

    // esegue la query passando i valori ricevuti come parametri
    const [results] = await connection.promise().query(
      `
      INSERT INTO billing_addresses 
      (invoice_id, full_name, address_line, city, postal_code, country, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `,
      [
        invoice_id || null,
        full_name,
        address_line,
        city,
        postal_code,
        country,
        created_at,
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
  // estraiamo l'ID del post dalla URL
  const { id } = req.params;
  if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });

  const [existing] = await connection
    .promise()
    .query("SELECT * FROM billing_addresses WHERE id = ?", [id]);
  if (existing.length === 0)
    return res.status(404).json({ error: "Billing address not found" });
  // estraiamo i nuovi valori dal corpo della richiesta
  const { invoice_id, full_name, address_line, city, postal_code, country } =
    req.body;

  if (invoice_id) {
    const [results] = await connection
      .promise()
      .query("SELECT * FROM invoices WHERE id = ?", [invoice_id]);
    if (results.length === 0)
      return res.status(400).json({ error: "Invalid invoice_id" });
  }

  // esegue la query, passando i nuovi valori e l'ID
  await connection.promise().query(
    `
    UPDATE billing_addresses
    SET invoice_id = ?, full_name = ?, address_line = ?, city = ?, postal_code = ?, country = ? WHERE id = ?
  `,
    [
      invoice_id || null,
      full_name,
      address_line,
      city,
      postal_code,
      country,
      id,
    ]
  );
  return res.status(204).send();
}

/* modify (partial edit) */
async function modify(req, res) {
  try {
    // estraiamo l'ID del videogioco dalla URL
    const { id } = req.params;
    if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });

    const [existing] = await connection
      .promise()
      .query("SELECT * FROM billing_addresses WHERE id = ?", [id]);
    if (existing.length === 0)
      return res.status(404).json({ error: "Billing address not found" });

    // estraiamo i dati (invoice_id, full_name, ecc) dal corpo della richiesta HTTP
    const { invoice_id, full_name, address_line, city, postal_code, country } =
      req.body;

    if (invoice_id) {
      const [results] = await connection
        .promise()
        .query("SELECT * FROM invoices WHERE id = ?", [invoice_id]);
      if (results.length === 0)
        return res.status(400).json({ error: "Invalid invoice_id" });
    }

    // inizializziamo due array:
    // - 'fields' conterrà le parti dell'SQL da aggiornare
    // - 'values' conterrà i nuovi valori corrispondenti
    const fields = [];
    const values = [];
    // se è presente il nome e non è vuoto, lo aggiunge agli array
    if (invoice_id) {
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
    if (postal_code) {
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
      return res.status(400).json({ error: "No fields to update" });

    // Aggiunge l'ID alla fine dell'array dei valori (serve per il WHERE)
    values.push(id);
    // Esegue la query nel database
    await connection
      .promise()
      .query(
        `UPDATE billing_addresses SET ${fields.join(", ")} WHERE id = ?`,
        values
      );

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

  // definiamo la query SQL per eliminare l'elemento dalla tabella "billing_addresses"" con l'ID specificato
  const sql = "DELETE FROM billing_addresses WHERE id = ? ;";
  // esegue la query sul database, passando l'ID come parametro
  connection.query(sql, [id], (err, results) => {
    // gestisce eventuali errori durante l'esecuzione della query
    if (err) return res.status(500).json({ error: "Internal server error" });
    // verifichiamo se è stato effettivamente eliminato un elemento dalla tabella
    if (results.affectedRows === 0) {
      // se nessuna riga è stata eliminata, l'ID non esiste nel database e ci restituisce questo errore
      return res.status(404).json({ error: "Billing address not found" });
    }
    // se l'eliminazione è avvenuta con successo, restituisce una conferma
    return res.status(204).send();
  });
}

// esportiamo tutto
export default { index, show, store, update, modify, destroy };
