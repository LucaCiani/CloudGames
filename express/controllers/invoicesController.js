// importiamo il modulo "connection"
import connection from "../db/connection.js";

/* rotte CRUD */

/* index (read all) */
function index(req, res) {
  // definiamo una query SQL che seleziona tutta la tabella "invoices"
  const sql = `SELECT 
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
    GROUP_CONCAT(DISTINCT ba.id SEPARATOR '|') AS billing_address_id,
    GROUP_CONCAT(DISTINCT ba.full_name SEPARATOR '|') AS billing_address_full_name,
    GROUP_CONCAT(DISTINCT ba.address_line SEPARATOR '|') AS billing_address_address_line,
    GROUP_CONCAT(DISTINCT ba.city SEPARATOR '|') AS billing_address_city,
    GROUP_CONCAT(DISTINCT ba.postal_code SEPARATOR '|') AS billing_address_postal_code,
    GROUP_CONCAT(DISTINCT ba.country SEPARATOR '|') AS billing_address_country,
    GROUP_CONCAT(DISTINCT ba.created_at SEPARATOR '|') AS billing_address_created_at,
    GROUP_CONCAT(DISTINCT v.id SEPARATOR '|') AS videogame_ids,
    GROUP_CONCAT(DISTINCT v.description SEPARATOR '|') AS videogame_descriptions,
    GROUP_CONCAT(DISTINCT v.name SEPARATOR '|') AS videogame_names,
    GROUP_CONCAT(DISTINCT v.image_url SEPARATOR '|') AS videogame_image_urls,
    GROUP_CONCAT(DISTINCT v.price SEPARATOR '|') AS videogame_prices,
    GROUP_CONCAT(DISTINCT v.promo_price SEPARATOR '|') AS videogame_promo_prices,
    GROUP_CONCAT(DISTINCT v.developer SEPARATOR '|') AS videogame_developers,
    GROUP_CONCAT(DISTINCT v.release_date SEPARATOR '|') AS videogame_release_dates,
    GROUP_CONCAT(DISTINCT v.vote SEPARATOR '|') AS videogame_votes,
    GROUP_CONCAT(DISTINCT iv.quantity SEPARATOR '|') AS order_quantities
  FROM invoices AS i
  LEFT JOIN discounts AS d ON i.discount_id = d.id
  LEFT JOIN billing_addresses AS ba ON ba.invoice_id = i.id
  LEFT JOIN invoice_videogame AS iv ON iv.invoice_id = i.id
  LEFT JOIN videogames AS v ON iv.videogame_id = v.id
  GROUP BY i.id;`;
  // eseguiamo la query usando la connessione al database
  connection.query(sql, (err, results) => {
    // se c'è un errore durante l'esecuzione della query, restituiamo un errore 500 al client
    if (err) return res.status(500).json({ error: "Internal server error" });
    // se non ci sono errori, restituiamo i risultati della query in formato JSON
    const formattedResult = results.map((invoice) => {
      return {
        id: invoice.id,
        total_amount: invoice.total_amount,
        currency: invoice.currency,
        status: invoice.status,
        payment_provider: invoice.payment_provider,
        created_at: invoice.created_at,
        completed_at: invoice.completed_at,
        videogames: invoice.videogame_ids
          ? invoice.videogame_ids.split("|").map((videogame_id, i) => {
              return {
                id: videogame_id,
                name: invoice.videogame_names.split("|")[i],
                description: invoice.videogame_descriptions.split("|")[i],
                price: invoice.videogame_prices.split("|")[i],
                promo_price: invoice.videogame_promo_prices.split("|")[i],
                developer: invoice.videogame_developers.split("|")[i],
                release_date: invoice.videogame_release_dates.split("|")[i],
                vote: invoice.videogame_votes.split("|")[i],
                order_quantity: invoice.order_quantities.split("|")[i],
              };
            })
          : null,
        discount: invoice.discount_code
          ? {
              code: invoice.discount_code,
              discount_percentage: invoice.discount_percentage,
              expires_at: invoice.discount_expiry,
            }
          : null,
        billing_address: invoice.billing_address_id
          ? {
              id: invoice.billing_address_id,
              full_name: invoice.billing_address_full_name,
              address_line: invoice.billing_address_address_line,
              city: invoice.billing_address_city,
              postal_code: invoice.billing_address_postal_code,
              country: invoice.billing_address_country,
              created_at: invoice.billing_address_created_at,
            }
          : null,
      };
    });

    return res.json(formattedResult);
  });
}

/* show (read) */
function show(req, res) {
  // estrae l'ID dalla URL e lo converte da stringa a numero
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });
  // definiamo la query SQL per selezionare una fattura tramite ID
  const sql = `SELECT 
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
    GROUP_CONCAT(DISTINCT ba.id SEPARATOR '|') AS billing_address_id,
    GROUP_CONCAT(DISTINCT ba.full_name SEPARATOR '|') AS billing_address_full_name,
    GROUP_CONCAT(DISTINCT ba.address_line SEPARATOR '|') AS billing_address_address_line,
    GROUP_CONCAT(DISTINCT ba.city SEPARATOR '|') AS billing_address_city,
    GROUP_CONCAT(DISTINCT ba.postal_code SEPARATOR '|') AS billing_address_postal_code,
    GROUP_CONCAT(DISTINCT ba.country SEPARATOR '|') AS billing_address_country,
    GROUP_CONCAT(DISTINCT ba.created_at SEPARATOR '|') AS billing_address_created_at,
    GROUP_CONCAT(DISTINCT v.id SEPARATOR '|') AS videogame_ids,
    GROUP_CONCAT(DISTINCT v.description SEPARATOR '|') AS videogame_descriptions,
    GROUP_CONCAT(DISTINCT v.name SEPARATOR '|') AS videogame_names,
    GROUP_CONCAT(DISTINCT v.image_url SEPARATOR '|') AS videogame_image_urls,
    GROUP_CONCAT(DISTINCT v.price SEPARATOR '|') AS videogame_prices,
    GROUP_CONCAT(DISTINCT v.promo_price SEPARATOR '|') AS videogame_promo_prices,
    GROUP_CONCAT(DISTINCT v.developer SEPARATOR '|') AS videogame_developers,
    GROUP_CONCAT(DISTINCT v.release_date SEPARATOR '|') AS videogame_release_dates,
    GROUP_CONCAT(DISTINCT v.vote SEPARATOR '|') AS videogame_votes,
    GROUP_CONCAT(DISTINCT iv.quantity SEPARATOR '|') AS order_quantities
  FROM invoices AS i
  LEFT JOIN discounts AS d ON i.discount_id = d.id
  LEFT JOIN billing_addresses AS ba ON ba.invoice_id = i.id
  LEFT JOIN invoice_videogame AS iv ON iv.invoice_id = i.id
  LEFT JOIN videogames AS v ON iv.videogame_id = v.id
  WHERE i.id = ?
  GROUP BY i.id;`;
  // esegue la query sul database, passando l'ID come parametro
  connection.query(sql, [id], (err, results) => {
    // se si verifica un errore durante la connessione o l'esecuzione della query
    if (err) return res.status(500).json({ error: "Internal server error" });
    // se non viene trovato alcun risultato (l'ID non esiste nella tabella "invoices"),
    if (results.length === 0)
      return res.status(404).json({ error: "Invoice not found" });
    // se l'elemento è stato trovato, lo restituisce come risposta JSON
    const formattedResult = results.map((invoice) => {
      return {
        id: invoice.id,
        total_amount: invoice.total_amount,
        currency: invoice.currency,
        status: invoice.status,
        payment_provider: invoice.payment_provider,
        created_at: invoice.created_at,
        completed_at: invoice.completed_at,
        videogames: invoice.videogame_ids
          ? invoice.videogame_ids.split("|").map((videogame_id, i) => {
              return {
                id: videogame_id,
                name: invoice.videogame_names.split("|")[i],
                description: invoice.videogame_descriptions.split("|")[i],
                price: invoice.videogame_prices.split("|")[i],
                promo_price: invoice.videogame_promo_prices.split("|")[i],
                developer: invoice.videogame_developers.split("|")[i],
                release_date: invoice.videogame_release_dates.split("|")[i],
                vote: invoice.videogame_votes.split("|")[i],
                order_quantity: invoice.order_quantities.split("|")[i],
              };
            })
          : null,
        discount: invoice.discount_code
          ? {
              code: invoice.discount_code,
              discount_percentage: invoice.discount_percentage,
              expires_at: invoice.discount_expiry,
            }
          : null,
        billing_address: invoice.billing_address_id
          ? {
              id: invoice.billing_address_id,
              full_name: invoice.billing_address_full_name,
              address_line: invoice.billing_address_address_line,
              city: invoice.billing_address_city,
              postal_code: invoice.billing_address_postal_code,
              country: invoice.billing_address_country,
              created_at: invoice.billing_address_created_at,
            }
          : null,
      };
    });

    return res.json(formattedResult[0]);
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
    return res.staut(201).json({ created_id: results.insertId });
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
