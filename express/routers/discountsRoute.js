// importiamo express
import { Router } from "express";
const router = Router();

// importiamo le funzioni del controller
import discountsController from "../controllers/discountsController.js";
import {
  validateBody,
  discountCreateSchema,
  discountUpdateSchema,
  discountPatchSchema,
} from "../zod/schemas.js";

/* rotte CRUD */

/* index (read all) */
// router per ottenere tutti i codici sconto, con possibilità di filtro tramite query string
router.get("/", discountsController.index);

/* show (read one) */
// rotta per ottenere un singolo codice sconto tramite ID
router.get("/:id", discountsController.show);

/* store (create) */
// rotta per creare un nuovo codice sconto
router.post("/", validateBody(discountCreateSchema), discountsController.store);

/* update */
// rotta per modificare un codice sconto esistente in modo integrale
router.put(
  "/:id",
  validateBody(discountUpdateSchema),
  discountsController.update
);

/* modify */
// rotta per modificare un codice sconto esistente in modo parziale
router.patch(
  "/:id",
  validateBody(discountPatchSchema),
  discountsController.modify
);

/* destroy */
// rotta per cancellare un codice sconto esistente
router.delete("/:id", discountsController.destroy);

// esportiamo router
export default router;
