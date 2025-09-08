// importiamo express
import { Router } from "express";
const router = Router();

// importiamo le funzioni del controller
import billingAddressesController from "../controllers/billingAddressesController.js";

/* rotte CRUD */

/* index (read all) */
// rotta per ottenere tutte le fatture, con possibilità di filtro tramite query string
router.get("/", billingAddressesController.index);

/* show (read one) */
// rotta per ottenere una singola fattura tramite ID
router.get("/:id", billingAddressesController.show);

/* store (create) */
// rotta per creare un nuovo indirizzo di fatturazione
router.post("/", billingAddressesController.store);

/* modify */
// route per modificare un videogioco esistente in modo parziale
router.patch("/:id", billingAddressesController.modify);

// esportiamo router
export default router;
