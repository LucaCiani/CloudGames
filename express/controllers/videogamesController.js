// importiamo il modulo "connection"
import connection from "../db/connection.js";

/* rotte CRUD */

/* index (read all) */
function index(req, res) {
  // definiamo una query SQL che seleziona tutta la tabella "videogames"
  const sql = `
  SELECT
    v.id,
    v.slug,
    v.name,
    v.description,
    v.price,
    v.promo_price,
    v.developer,
    v.release_date,
    v.image_url,
    v.quantity,
    v.vote,
    (
      SELECT JSON_ARRAYAGG(p.name ORDER BY p.id)
      FROM platform_videogame pv
      JOIN platforms p ON p.id = pv.platform_id
      WHERE pv.videogame_id = v.id
    ) AS platforms,
    (
      SELECT JSON_ARRAYAGG(g.name ORDER BY g.id)
      FROM videogame_genre vg
      JOIN genres g ON g.id = vg.genre_id
      WHERE vg.videogame_id = v.id
    ) AS genres,
    (
      SELECT JSON_ARRAYAGG(
               JSON_OBJECT(
                 'type', m.type,
                 'url', m.media_url
               ) ORDER BY m.id
             )
      FROM media m
      WHERE m.videogame_id = v.id
    ) AS media
  FROM videogames AS v
  ORDER BY v.id`;
  // eseguiamo la query usando la connessione al database
  connection.query(sql, (err, results) => {
    // se c'è un errore durante l'esecuzione della query, restituiamo un errore 500 al client
    if (err) return res.status(500).json({ error: "Internal server error" });
    // se non ci sono errori, restituiamo i risultati della query in formato JSON

    const formattedResult = results.map((row) => {
      return {
        id: parseInt(row.id),
        slug: row.slug,
        name: row.name,
        description: row.description,
        price: Number(row.price),
        promo_price: row.promo_price != null ? Number(row.promo_price) : null,
        developer: row.developer,
        release_date: row.release_date,
        image_url: row.image_url,
        quantity: parseInt(row.quantity),
        vote: Number(row.vote),
        platforms: row.platforms ? JSON.parse(row.platforms) : null,
        genres: row.genres ? JSON.parse(row.genres) : null,
        media: row.media ? JSON.parse(row.media) : null,
      };
    });

    return res.json(formattedResult);
  });
}

/* show (read) */
function show(req, res) {
  // estrae l'ID dalla URL e lo converte da stringa a numero
  const { id } = req.params;
  if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });
  // definiamo la query SQL per selezionare un videogioco tramite ID
  const sql = `
  SELECT
    v.id,
    v.slug,
    v.name,
    v.description,
    v.price,
    v.promo_price,
    v.developer,
    v.release_date,
    v.image_url,
    v.quantity,
    v.vote,
    (
      SELECT JSON_ARRAYAGG(p.name ORDER BY p.id)
      FROM platform_videogame pv
      JOIN platforms p ON p.id = pv.platform_id
      WHERE pv.videogame_id = v.id
    ) AS platforms,
    (
      SELECT JSON_ARRAYAGG(g.name ORDER BY g.id)
      FROM videogame_genre vg
      JOIN genres g ON g.id = vg.genre_id
      WHERE vg.videogame_id = v.id
    ) AS genres,
    (
      SELECT JSON_ARRAYAGG(
               JSON_OBJECT(
                 'type', m.type,
                 'url', m.media_url
               ) ORDER BY m.id
             )
      FROM media m
      WHERE m.videogame_id = v.id
    ) AS media
  FROM videogames AS v
  WHERE v.id = ?`;
  // esegue la query sul database, passando l'ID come parametro
  connection.query(sql, [id], (err, results) => {
    // se si verifica un errore durante la connessione o l'esecuzione della query
    if (err) return res.status(500).json({ error: "Internal server error" });
    // se non viene trovato alcun risultato (l'ID non esiste nella tabella "videogames"),
    if (results.length === 0)
      return res.status(404).json({ error: "Videogames not found" });
    // se l'elemento è stato trovato, lo restituisce come risposta JSON

    const row = results[0];
    const formatted = {
      id: parseInt(row.id),
      slug: row.slug,
      name: row.name,
      description: row.description,
      price: Number(row.price),
      promo_price: row.promo_price != null ? Number(row.promo_price) : null,
      developer: row.developer,
      release_date: row.release_date,
      image_url: row.image_url,
      quantity: parseInt(row.quantity),
      vote: Number(row.vote),
      platforms: row.platforms ? JSON.parse(row.platforms) : null,
      genres: row.genres ? JSON.parse(row.genres) : null,
      media: row.media ? JSON.parse(row.media) : null,
    };

    return res.json(formatted);
  });
}

/* store (create) */
async function store(req, res) {
  try {
    // estraiamo i dati (slug, name, description, price, ecc) dal corpo della richiesta HTTP
    const {
      slug,
      name,
      description,
      price,
      promo_price,
      developer,
      release_date,
      image_url,
      quantity,
      vote,
      platform_ids,
      genre_ids,
      media,
    } = req.body;

    const releaseDateSql = new Date(release_date)
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");

    // Validate slug uniqueness
    const [existing] = await connection
      .promise()
      .query("SELECT id FROM videogames WHERE slug = ?", [slug]);
    if (existing.length > 0) {
      return res.status(400).json({ error: "Slug must be unique" });
    }

    if (platform_ids) {
      const [results] = await connection
        .promise()
        .query("SELECT id FROM platforms WHERE id IN (?)", [platform_ids]);
      if (results.length !== platform_ids.length) {
        return res
          .status(400)
          .json({ error: "One or more platform_ids are invalid" });
      }
    }

    if (genre_ids) {
      const [results] = await connection
        .promise()
        .query("SELECT id FROM genres WHERE id IN (?)", [genre_ids]);
      if (results.length !== genre_ids.length) {
        return res
          .status(400)
          .json({ error: "One or more genre_ids are invalid" });
      }
    }

    // esegue la query passando i valori ricevuti come parametri
    await connection
      .promise()
      .query(
        "INSERT INTO videogames (slug, name, description, price, promo_price, developer, release_date, image_url, quantity, vote) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
        [
          slug,
          name,
          description,
          price,
          promo_price,
          developer,
          releaseDateSql,
          image_url,
          quantity,
          vote,
        ]
      )
      .then(async ([results]) => {
        const createdId = results.insertId;

        if (platform_ids) {
          for (const platform_id of platform_ids) {
            await connection
              .promise()
              .query(
                "INSERT INTO platform_videogame (platform_id, videogame_id) VALUES (?, ?);",
                [platform_id, createdId]
              );
          }
        }

        if (genre_ids) {
          for (const genre_id of genre_ids) {
            await connection
              .promise()
              .query(
                "INSERT INTO videogame_genre (genre_id, videogame_id) VALUES (?, ?);",
                [genre_id, createdId]
              );
          }
        }

        if (media) {
          for (const item of media) {
            await connection
              .promise()
              .query(
                "INSERT INTO media (videogame_id, type, media_url) VALUES (?, ?, ?);",
                [createdId, item.type, item.url]
              );
          }
        }

        return res.status(201).json({ created_id: createdId });
      });
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
  // estraiamo i nuovi valori dal corpo della richiesta
  const {
    slug,
    name,
    description,
    price,
    promo_price,
    developer,
    release_date,
    image_url,
    quantity,
    vote,
  } = req.body;

  const releaseDateSql = new Date(release_date)
    .toISOString()
    .slice(0, 19)
    .replace("T", " ");

  // esegue la query, passando i nuovi valori e l'ID
  connection.query(
    `
    UPDATE videogames
    SET slug = ?, name = ?, description = ?, price = ?, promo_price = ?, developer = ?, 
        release_date = ?, image_url = ?, quantity = ?, vote = ?
    WHERE id = ?
  `,
    [
      slug,
      name,
      description,
      price,
      promo_price,
      developer,
      releaseDateSql,
      image_url,
      quantity,
      vote,
      id,
    ],
    (err, results) => {
      // se si verifica un errore durante la query
      if (err) return res.status(500).json({ error: "Internal server error" });
      // se nessuna riga è stata modificata, il videogame con quell'ID non esiste
      if (results.affectedRows === 0) {
        // quindi restituisce un errore
        return res.status(404).json({ error: "Videogame not found" });
      }
      // altrimenti conferma l'aggiornamento
      return res.status(204).send();
    }
  );
}

/* modify (partial edit) */
function modify(req, res) {
  // estraiamo l'ID del videogioco dalla URL
  const { id } = req.params;
  if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });
  // estraiamo i nuovi valori dal corpo della richiesta
  const {
    name,
    description,
    price,
    promo_price,
    developer,
    release_date,
    image_url,
    quantity,
    vote,
  } = req.body;
  // inizializziamo due array:
  // - 'fields' conterrà le parti dell'SQL da aggiornare
  // - 'values' conterrà i nuovi valori corrispondenti
  const fields = [];
  const values = [];
  // se è presente il nome e non è vuoto, lo aggiunge agli array
  if (name && name.length > 0) {
    fields.push("name = ?");
    values.push(name);
  }
  // se è presente la descrizione e non è vuota, la aggiunge agli array
  if (description) {
    fields.push("description = ?");
    values.push(description);
  }
  // se è presente il prezzo, lo aggiunge agli array
  if (price) {
    fields.push("price = ?");
    values.push(price);
  }
  // se è presente il prezzo promozionale, lo aggiunge agli array
  if (promo_price) {
    fields.push("promo_price = ?");
    values.push(promo_price);
  }
  // se è presente lo sviluppatore e non è vuoto, lo aggiunge agli array
  if (developer) {
    fields.push("developer = ?");
    values.push(developer);
  }
  // se è presente la data di rilascio e non è vuota, la aggiunge agli array
  if (release_date) {
    fields.push("release_date = ?");
    values.push(release_date);
  }
  // se è presente l'URL dell'immagine e non è vuoto, lo aggiunge agli array
  if (image_url && image_url.length > 0) {
    fields.push("image_url = ?");
    values.push(image_url);
  }
  // se è presente la quantità, la aggiunge agli array
  if (quantity) {
    fields.push("quantity = ?");
    values.push(quantity);
  }
  // se è presente il voto, lo aggiunge agli array
  if (vote) {
    fields.push("vote = ?");
    values.push(vote);
  }
  // Se nessun campo è stato fornito per l'aggiornamento, restituisce errore
  if (fields.length === 0)
    return res.status(400).json({ error: "No fields to update" });

  // Costruisce dinamicamente la query SQL usando solo i campi forniti
  const sql = `UPDATE videogames SET ${fields.join(", ")} WHERE id = ?`;
  // Aggiunge l'ID alla fine dell'array dei valori (serve per il WHERE)
  values.push(id);
  // Esegue la query nel database
  connection.query(sql, values, (err, results) => {
    // Gestisce eventuali errori della query
    if (err) return res.status(500).json({ error: "Internal server error" });
    // Se nessun videogioco è stato modificato (id non trovato), restituisce errore 404
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: "Videogame not found" });
    }
    // Se tutto è andato bene, restituisce un messaggio di successo
    return res.status(204).send();
  });
}

/* destroy (delete) */
function destroy(req, res) {
  // estrae l'ID dalla URL e lo converte da stringa a numero
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });
  // definiamo la query SQL per eliminare l'elemento dalla tabella "videogames" con l'ID specificato
  const sql = "DELETE FROM videogames WHERE id = ? ;";
  // esegue la query sul database, passando l'ID come parametro
  connection.query(sql, [id], (err, results) => {
    // gestisce eventuali errori durante l'esecuzione della query
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Internal server error" });
    }
    // verifichiamo se è stato effettivamente eliminato un elemento dalla tabella
    if (results.affectedRows === 0) {
      // se nessuna riga è stata eliminata, l'ID non esiste nel database e ci restituisce questo errore
      return res.status(404).json({ error: "Videogame not found" });
    }
    // se l'eliminazione è avvenuta con successo, restituisce una conferma
    return res.status(204).send();
  });
}

// esportiamo tutto
export default { index, show, store, update, modify, destroy };
