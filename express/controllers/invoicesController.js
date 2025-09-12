// importiamo il modulo "connection"
import connection from "../db/connection.js";

/* rotte CRUD */

/* index (read all) */
function index(req, res) {
  // Query con subselect JSON per evitare mismatch negli aggregati
  const sql = `
    SELECT 
      i.id,
      i.total_amount,
      i.currency,
      i.status,
      i.payment_provider,
      i.created_at,
      i.completed_at,
      d.code AS discount_code,
      d.discount_percentage,
      d.expires_at AS discount_expiry,
      (
        SELECT JSON_ARRAYAGG(
                 JSON_OBJECT(
                   'id', v.id,
                   'name', v.name,
                   'description', v.description,
                   'image_url', v.image_url,
                   'price', v.price,
                   'promo_price', v.promo_price,
                   'developer', v.developer,
                   'release_date', DATE_FORMAT(v.release_date, '%Y-%m-%dT%H:%i:%s.000Z'),
                   'vote', v.vote,
                   'order_quantity', iv2.quantity
                 ) ORDER BY v.id
               )
        FROM invoice_videogame AS iv2
        JOIN videogames AS v ON v.id = iv2.videogame_id
        WHERE iv2.invoice_id = i.id
      ) AS items,
      (
        SELECT JSON_ARRAYAGG(
                 JSON_OBJECT(
                   'id', ba2.id,
                   'full_name', ba2.full_name,
                   'address_line', ba2.address_line,
                   'city', ba2.city,
                   'postal_code', ba2.postal_code,
                   'country', ba2.country,
                   'created_at', ba2.created_at
                 ) ORDER BY ba2.id
               )
        FROM billing_addresses AS ba2
        WHERE ba2.invoice_id = i.id
      ) AS billing_addresses
    FROM invoices AS i
    LEFT JOIN discounts AS d ON i.discount_id = d.id
    ORDER BY i.id`;

  connection.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: "Internal server error" });

    const formatted = results.map((row) => {
      const items = row.items ? JSON.parse(row.items) : null;
      const billingAddresses = row.billing_addresses
        ? JSON.parse(row.billing_addresses)
        : null;

      return {
        id: row.id,
        total_amount: row.total_amount,
        currency: row.currency,
        status: row.status,
        payment_provider: row.payment_provider,
        created_at: row.created_at,
        completed_at: row.completed_at,
        videogames: items,
        discount: row.discount_code
          ? {
              code: row.discount_code,
              discount_percentage: row.discount_percentage,
              expires_at: row.discount_expiry,
            }
          : null,
        billing_address:
          billingAddresses && billingAddresses.length > 0
            ? billingAddresses[0]
            : null,
      };
    });

    return res.json(formatted);
  });
}

/* show (read) */
function show(req, res) {
  // estrae l'ID dalla URL e lo converte da stringa a numero
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });
  // definiamo la query SQL per selezionare una fattura tramite ID
  const sql = `
    SELECT 
      i.id,
      i.total_amount,
      i.currency,
      i.status,
      i.payment_provider,
      i.created_at,
      i.completed_at,
      d.code AS discount_code,
      d.discount_percentage,
      d.expires_at AS discount_expiry,
      (
        SELECT JSON_ARRAYAGG(
                 JSON_OBJECT(
                   'id', v.id,
                   'name', v.name,
                   'description', v.description,
                   'image_url', v.image_url,
                   'price', v.price,
                   'promo_price', v.promo_price,
                   'developer', v.developer,
                   'release_date', DATE_FORMAT(v.release_date, '%Y-%m-%dT%H:%i:%s.000Z'),
                   'vote', v.vote,
                   'order_quantity', iv2.quantity
                 ) ORDER BY v.id
               )
        FROM invoice_videogame AS iv2
        JOIN videogames AS v ON v.id = iv2.videogame_id
        WHERE iv2.invoice_id = i.id
      ) AS items,
      (
        SELECT JSON_ARRAYAGG(
                 JSON_OBJECT(
                   'id', ba2.id,
                   'full_name', ba2.full_name,
                   'address_line', ba2.address_line,
                   'city', ba2.city,
                   'postal_code', ba2.postal_code,
                   'country', ba2.country,
                   'created_at', ba2.created_at
                 ) ORDER BY ba2.id
               )
        FROM billing_addresses AS ba2
        WHERE ba2.invoice_id = i.id
      ) AS billing_addresses
    FROM invoices AS i
    LEFT JOIN discounts AS d ON i.discount_id = d.id
    WHERE i.id = ?`;

  connection.query(sql, [id], (err, results) => {
    if (err) return res.status(500).json({ error: "Internal server error" });
    if (results.length === 0)
      return res.status(404).json({ error: "Invoice not found" });

    const row = results[0];
    const items = row.items ? JSON.parse(row.items) : null;
    const billingAddresses = row.billing_addresses
      ? JSON.parse(row.billing_addresses)
      : null;

    const formatted = {
      id: row.id,
      total_amount: row.total_amount,
      currency: row.currency,
      status: row.status,
      payment_provider: row.payment_provider,
      created_at: row.created_at,
      completed_at: row.completed_at,
      videogames: items,
      discount: row.discount_code
        ? {
            code: row.discount_code,
            discount_percentage: row.discount_percentage,
            expires_at: row.discount_expiry,
          }
        : null,
      billing_address:
        billingAddresses && billingAddresses.length > 0
          ? billingAddresses[0]
          : null,
    };

    return res.json(formatted);
  });
}

/* store (create) */
async function store(req, res) {
  try {
    // estraiamo i dati (discount_id, total_amount, ecc) dal corpo della richiesta HTTP
    const {
      total_amount,
      payment_provider,
      discount_id,
      currency,
      videogames,
    } = req.body;

    // verifica che il discount esista
    if (discount_id) {
      const [results] = await connection
        .promise()
        .query("SELECT * FROM discounts WHERE id = ?", [discount_id]);

      if (results.length === 0)
        return res.status(400).json({ error: `Invalid discount id` });
    }

    // verifica i dati per videogames
    for (const videogame of videogames) {
      const { id, quantity } = videogame;

      const [results] = await connection
        .promise()
        .query("SELECT * FROM videogames WHERE id = ?", [id]);

      if (results.length === 0)
        return res.status(400).json({ error: "Invalid videogame id" });

      if (quantity > results[0].quantity)
        return res.status(400).json({ error: "Invalid videogame quantity" });
    }

    // MySQL DATETIME without timezone, e.g. "2025-09-05 12:34:56"
    const created_at = new Date().toISOString().slice(0, 19).replace("T", " ");

    // esegue la query passando i valori ricevuti come parametri
    const [results] = await connection.promise().query(
      `
      INSERT INTO invoices 
      (total_amount, payment_provider, discount_id, currency, created_at, status)
      VALUES (?, ?, ?, ?, ?, ?)
    `,
      [
        total_amount,
        payment_provider || null,
        discount_id || null,
        currency || "EUR",
        created_at,
        "pending",
      ]
    );

    for (const videogame of videogames) {
      await connection
        .promise()
        .query(
          "INSERT INTO invoice_videogame (invoice_id, videogame_id, quantity) VALUES (?, ?, ?)",
          [results.insertId, videogame.id, videogame.quantity]
        );
    }

    // se l'inserimento ha successo, restituisce l'id
    return res.status(201).json({ created_id: results.insertId });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

/* update (edit) */
async function update(req, res) {
  try {
    // estraiamo l'ID del post dalla URL
    const { id } = req.params;
    if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });

    const [existingInvoice] = await connection
      .promise()
      .query("SELECT * FROM invoices WHERE id = ?", [id]);
    if (existingInvoice.length === 0)
      return res.status(404).json({ error: "Invoice not found" });
    // estraiamo i nuovi valori dal corpo della richiesta
    const {
      total_amount,
      payment_provider,
      discount_id,
      currency,
      status,
      completed_at,
      videogames,
    } = req.body;
    // definiamo la query SQL per aggiornare una fattura esistente

    const completedAtSqlCompatible = new Date(completed_at)
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");

    for (const videogame of videogames) {
      const { id, quantity } = videogame;

      const [results] = await connection
        .promise()
        .query("SELECT * FROM videogames WHERE id = ?", [id]);

      if (results.length === 0)
        return res.status(400).json({ error: "Invalid videogame id" });

      if (quantity > results[0].quantity)
        return res.status(400).json({ error: "Invalid videogame quantity" });
    }

    if (discount_id) {
      const [results] = await connection
        .promise()
        .query("SELECT * FROM discounts WHERE id = ?", [discount_id]);
      if (results.length === 0)
        return res.status(400).json({ error: `Invalid discount id` });
    }

    // esegue la query, passando i nuovi valori e l'ID
    await connection.promise().query(
      `
      UPDATE invoices
      SET discount_id = ?, total_amount = ?, currency = ?, status = ?, completed_at = ?, payment_provider = ? WHERE id = ?
    `,
      [
        discount_id,
        total_amount,
        currency,
        status,
        completedAtSqlCompatible,
        payment_provider,
        id,
      ]
    );

    await connection
      .promise()
      .query("DELETE FROM invoice_videogame WHERE invoice_id = ?", [id]);
    for (const videogame of videogames) {
      await connection
        .promise()
        .query(
          "INSERT INTO invoice_videogame (invoice_id, videogame_id, quantity) VALUES (?, ?, ?)",
          [id, videogame.id, videogame.quantity]
        );
    }
    // se tutto è andato bene, restituisce un messaggio di successo
    res.status(204).send();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

/* modify (partial edit) */
async function modify(req, res) {
  try {
    // estraiamo l'ID della fattura dalla URL e lo convertiamo in numero
    const { id } = req.params;
    if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });

    const [existingInvoice] = await connection
      .promise()
      .query("SELECT * FROM invoices WHERE id = ?", [id]);
    if (existingInvoice.length === 0)
      return res.status(404).json({ error: "Invoice not found" });
    // estraiamo i nuovi valori dal corpo della richiesta
    const {
      total_amount,
      payment_provider,
      discount_id,
      currency,
      status,
      completed_at,
      videogames,
    } = req.body;
    // definiamo la query SQL per aggiornare una fattura esistente

    const completedAtSqlCompatible = completed_at
      ? new Date(completed_at).toISOString().slice(0, 19).replace("T", " ")
      : null;

    if (videogames) {
      for (const videogame of videogames) {
        const { id, quantity } = videogame;
        const [results] = await connection
          .promise()
          .query("SELECT * FROM videogames WHERE id = ?", [id]);
        if (results.length === 0)
          return res.status(400).json({ error: "Invalid videogame id" });
        if (quantity > results[0].quantity)
          return res.status(400).json({ error: "Invalid videogame quantity" });
      }
    }

    // inizializziamo due array:
    // - 'fields' conterrà le parti dell'SQL da aggiornare
    // - 'values' conterrà i nuovi valori corrispondenti
    const fields = [];
    const values = [];
    // se è presente discount_id, lo aggiunge agli array
    if (discount_id !== undefined) {
      fields.push("discount_id = ?");
      values.push(discount_id);
    }
    // se è presente completed_at, lo aggiunge agli array
    if (completedAtSqlCompatible) {
      fields.push("completed_at = ?");
      values.push(completedAtSqlCompatible);
    }
    // se è presente total_amount, lo aggiunge agli array
    if (total_amount !== undefined) {
      fields.push("total_amount = ?");
      values.push(total_amount);
    }
    // se è presente currency e non è vuoto, lo aggiunge agli array
    if (currency !== undefined) {
      fields.push("currency = ?");
      values.push(currency);
    }
    // se è presente status e non è vuoto, lo aggiunge agli array
    if (status !== undefined) {
      fields.push("status = ?");
      values.push(status);
    }
    // se è presente payment_provider e non è vuoto, lo aggiunge agli array
    if (payment_provider !== undefined) {
      fields.push("payment_provider = ?");
      values.push(payment_provider);
    }
    // Se nessun campo è stato fornito per l'aggiornamento, restituisce errore
    if (fields.length === 0)
      return res.status(400).json({ error: "No fields to update" });
    // Costruisce dinamicamente la query SQL usando solo i campi forniti
    // Aggiunge l'ID alla fine dell'array dei valori (serve per il WHERE)
    values.push(id);
    // Esegue la query nel database
    await connection
      .promise()
      .query(`UPDATE invoices SET ${fields.join(", ")} WHERE id = ?`, values);

    if (videogames) {
      await connection
        .promise()
        .query("DELETE FROM invoice_videogame WHERE invoice_id = ?", [id]);
      for (const videogame of videogames) {
        await connection
          .promise()
          .query(
            "INSERT INTO invoice_videogame (invoice_id, videogame_id, quantity) VALUES (?, ?, ?)",
            [id, videogame.id, videogame.quantity]
          );
      }
    }
    // se tutto è andato bene, restituisce un messaggio di successo
    res.status(204).send();
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

  // esegue la query sul database, passando l'ID come parametro
  connection.query(
    "DELETE FROM invoices WHERE id = ?;",
    [id],
    (err, results) => {
      // gestisce eventuali errori durante l'esecuzione della query
      if (err) return res.status(500).json({ error: "Internal server error" });
      // verifichiamo se è stato effettivamente eliminato un elemento dalla tabella
      if (results.affectedRows === 0) {
        // se nessuna riga è stata eliminata, l'ID non esiste nel database e ci restituisce questo errore
        return res.status(404).json({ error: "Invoice not found" });
      }
      // se l'eliminazione è avvenuta con successo, restituisce una conferma
      return res.status(204).send();
    }
  );
}

// esportiamo tutto
export default { index, show, store, update, modify, destroy };
