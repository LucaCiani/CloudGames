// importiamo express
import { Router } from "express";
const router = Router();

// importiamo le funzioni del controller
import billingAddressesController from "../controllers/billingAddressesController.js";

/* rotte CRUD */

/* store (create) */
// rotta per creare un nuovo indirizzo di fatturazione
router.post("/", billingAddressesController.store);

// esportiamo router
export default router;
