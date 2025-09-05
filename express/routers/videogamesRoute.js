// importiamo express
import { Router } from "express";
const router = Router();

// importiamo le funzioni del controller
import videogamesController from "../controllers/videogamesController.js";

/* rotte CRUD */

/* index (read all) */
// router per ottenere tutti i videogiochi, con possibilità di filtro tramite query string
router.get("/", videogamesController.index);

/* show (read one) */
// route per ottenere un videogioco specifico tramite ID
router.get("/:id", videogamesController.show);

/* modify */
// route per modificare un videogioco esistente in modo parziale
router.patch("/:id", videogamesController.modify);

// esportiamo router
export default router;
