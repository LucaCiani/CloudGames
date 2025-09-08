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

/* update */
// rotta per modificare un indirizzo di fatturazione esistente in modo integrale
router.put("/:id", billingAddressesController.update);

/* modify */
// rotta per modificare un indirizzo di fatturazione esistente in modo parziale
router.patch("/:id", billingAddressesController.modify);

/* destroy */
// rotta per cancellare un indirizzo di fatturazione esistente
router.delete("/:id", billingAddressesController.destroy);

// esportiamo router
export default router;
