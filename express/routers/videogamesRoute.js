// importiamo express
const express = require("express");
const router = express.Router();

// importiamo le funzioni del controller
const videogamesController = require("../controllers/videogamesController");

/* rotte CRUD */

/* index (read all) */
// router per ottenere tutti i videogiochi, con possibilità di filtro tramite query string
router.get("/", videogamesController.index);

/* show (read one) */
// route per ottenere un videogioco specifico tramite ID
router.get("/:id", videogamesController.show);

/* store (create) */
// route per creare un nuovo videogioco
router.post("/", videogamesController.store);

// update (update)
// route per aggiornare un videogioco esistente tramite ID
router.put("/:id", videogamesController.update);

/* modify */
// route per modificare un videogioco esistente in modo parziale
router.patch("/:id", videogamesController.modify);

// destroy (delete)
// route per eliminare un videogioco esistente tramite ID
router.delete("/:id", videogamesController.destroy);

// esportiamo router
module.exports = router;
