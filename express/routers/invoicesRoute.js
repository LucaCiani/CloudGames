// importiamo express
import { Router } from "express";
const router = Router();

// importiamo le funzioni del controller
import invoicesController from "../controllers/invoicesController.js";

/* rotte CRUD */

/* index (read all) */
// rotta per ottenere tutte le fatture, con possibilità di filtro tramite query string
router.get("/", invoicesController.index);

/* show (read one) */
// rotta per ottenere una singola fattura tramite ID
router.get("/:id", invoicesController.show);

/* store (create) */
// rotta per creare una nuova fattura
router.post("/", invoicesController.store);

// esportiamo router
export default router;
