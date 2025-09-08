// importiamo express
import { Router } from "express";
const router = Router();

// importiamo le funzioni del controller
import invoicesController from "../controllers/invoicesController.js";
import {
  validateBody,
  invoiceCreateSchema,
  invoiceUpdateSchema,
  invoicePatchSchema,
} from "../zod/schemas.js";

/* rotte CRUD */

/* index (read all) */
// rotta per ottenere tutte le fatture, con possibilità di filtro tramite query string
router.get("/", invoicesController.index);

/* show (read one) */
// rotta per ottenere una singola fattura tramite ID
router.get("/:id", invoicesController.show);

/* store (create) */
// rotta per creare una nuova fattura
router.post("/", validateBody(invoiceCreateSchema), invoicesController.store);

/* update */
// rotta per modificare una fattura esistente in modo integrale
router.put(
  "/:id",
  validateBody(invoiceUpdateSchema),
  invoicesController.update
);

/* modify */
// rotta per modificare una fattura esistente in modo parziale
router.patch(
  "/:id",
  validateBody(invoicePatchSchema),
  invoicesController.modify
);

/* destroy */
// rotta per cancellare una fattura esistente
router.delete("/:id", invoicesController.destroy);

// esportiamo router
export default router;
