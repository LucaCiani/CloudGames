// importiamo express
import { Router } from "express";
const router = Router();

// importiamo le funzioni del controller
import genresController from "../controllers/genresController.js";
import {
  validateBody,
  genreCreateSchema,
  genreUpdateSchema,
} from "../zod/schemas.js";

/* rotte CRUD */

/* index (read all) */
// rotta per ottenere tutti i generi, con possibilità di filtro tramite query string
router.get("/", genresController.index);

/* show (read one) */
// rotta per ottenere un singolo genere tramite ID
router.get("/:id", genresController.show);

/* store (create) */
// rotta per creare un nuovo genere
router.post("/", validateBody(genreCreateSchema), genresController.store);

/* update */
// rotta per modificare un genere esistente in modo integrale
router.put("/:id", validateBody(genreUpdateSchema), genresController.update);

/* destroy */
// rotta per cancellare un genere esistente
router.delete("/:id", genresController.destroy);

// esportiamo router
export default router;
