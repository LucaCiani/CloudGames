// importiamo il modulo "connection"
import connection from "../db/connection.js";

/* rotte CRUD */

/* index (read all) */
function index(req, res) {
  // definiamo una query SQL che seleziona tutta la tabella "invoices"
  const sql = "SELECT * FROM invoices";
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
  // definiamo la query SQL per selezionare una fattura tramite ID
  const sql = "SELECT * FROM invoices WHERE id = ? ;";
  // esegue la query sul database, passando l'ID come parametro
  connection.query(sql, [id], (err, results) => {
    // se si verifica un errore durante la connessione o l'esecuzione della query
    if (err) return res.status(500).json({ error: "Database query failed" });
    // se non viene trovato alcun risultato (l'ID non esiste nella tabella "invoices"),
    if (results.length === 0)
      return res.status(404).json({ error: "Invoice not found" });
    // se l'elemento è stato trovato, lo restituisce come risposta JSON
    return res.json(results[0]);
  });
}

/* store (create) */
function store(req, res) {
  // estraiamo i dati (discount_id, total_amount, ecc) dal corpo della richiesta HTTP
  const {
    discount_id,
    total_amount,
    currency,
    status,
    payment_provider,
    created_at,
    completed_at,
  } = req.body;
  // definiamo la query SQL per inserire una nuova fattura
  const sql = `
    INSERT INTO invoices 
    (discount_id, total_amount, currency, status, payment_provider, created_at, completed_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  // esegue la query passando i valori ricevuti come parametri
  connection.query(
    sql,
    [
      discount_id,
      total_amount,
      currency,
      status,
      payment_provider,
      created_at,
      completed_at,
    ],
    (err, results) => {
      // se c'è un errore durante l'inserimento nel database
      if (err)
        return res.status(500).json({ error: "Failed to insert invoice" });
      // se l'inserimento ha successo, restituisce lo status 201 (Created)
      res.status(201);
      // e un oggetto JSON contenente l'ID della nuova fattura creata
      res.json({ id: results.insertId });
    }
  );
}

// esportiamo tutto
export default { index, show, store };
