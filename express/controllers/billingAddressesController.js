// importiamo il modulo "connection"
import connection from "../db/connection.js";

/* rotte CRUD */

/* store (create) */
function store(req, res) {
  // estraiamo i dati (invoice_id, full_name, ecc) dal corpo della richiesta HTTP
  const {
    invoice_id,
    full_name,
    address_line,
    city,
    postal_code,
    country,
    created_at,
  } = req.body;
  // definiamo la query SQL per inserire un nuovo indirizzo di fatturazione
  const sql = `
    INSERT INTO invoices 
    (invoices_id, full_name, address_line, city, postal_code, country, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  // esegue la query passando i valori ricevuti come parametri
  connection.query(
    sql,
    [
      invoice_id,
      full_name,
      address_line,
      city,
      postal_code,
      country,
      created_at,
    ],
    (err, results) => {
      // se c'è un errore durante l'inserimento nel database
      if (err)
        return res.status(500).json({ error: "Failed to insert invoice" });
      // se l'inserimento ha successo, restituisce lo status 201 (Created)
      res.status(201);
      // e un oggetto JSON contenente l'ID del nuovo indirizzo di fatturazione
      res.json({ id: results.insertId });
    }
  );
}

// esportiamo tutto
export default { store };
