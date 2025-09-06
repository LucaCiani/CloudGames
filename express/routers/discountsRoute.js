// importiamo express
import { Router } from "express";
const router = Router();

// importiamo le funzioni del controller
import discountsController from "../controllers/discountsController.js";

/* rotte CRUD */

/* index (read all) */
// router per ottenere tutti i codici sconto, con possibilità di filtro tramite query string
router.get("/", discountsController.index);

/* show (read one) */
// rotta per ottenere un singolo codice sconto tramite ID
router.get("/:id", discountsController.show);

// esportiamo router
export default router;
