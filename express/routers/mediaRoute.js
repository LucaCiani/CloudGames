// importiamo express
import { Router } from "express";
const router = Router();

// importiamo le funzioni del controller
import mediaController from "../controllers/mediaController.js";
import {
  validateBody,
  mediaCreateSchema,
  mediaUpdateSchema,
  mediaPatchSchema,
} from "../zod/schemas.js";

/* rotte CRUD */

/* index (read all) */
// rotta per ottenere tutti i media, con possibilità di filtro tramite query string
router.get("/", mediaController.index);

/* show (read one) */
// rotta per ottenere un singolo media tramite ID
router.get("/:id", mediaController.show);

/* store (create) */
// rotta per aggiungere un nuovo media
router.post("/", validateBody(mediaCreateSchema), mediaController.store);

/* update */
// rotta per modificare un media esistente in modo integrale
router.put("/:id", validateBody(mediaUpdateSchema), mediaController.update);

/* modify */
// rotta per modificare un media esistente in modo parziale
router.patch("/:id", validateBody(mediaPatchSchema), mediaController.modify);

/* destroy */
// rotta per eliminare un media esistente
router.delete("/:id", mediaController.destroy);

// esportiamo router
export default router;
