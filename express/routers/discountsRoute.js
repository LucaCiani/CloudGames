// importiamo express
import { Router } from "express";
const router = Router();

// importiamo le funzioni del controller
import discountsRoute from "../controllers/discountsController.js";

/* rotte CRUD */

/* index (read all) */
// router per ottenere tutti i codici sconto, con possibilità di filtro tramite query string
router.get("/", discountsRoute.index);

// esportiamo router
export default router;
