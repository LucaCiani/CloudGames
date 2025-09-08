// importiamo express
import { Router } from "express";
const router = Router();

// importiamo le funzioni del controller
import platformsController from "../controllers/platformsController.js";

/* rotte CRUD */

/* index (read all) */
// rotta per ottenere tutte le piattaforme, con possibilità di filtro tramite query string
router.get("/", platformsController.index);

/* show (read one) */
// rotta per ottenere una singola piattaforma tramite ID
router.get("/:id", platformsController.show);

/* store (create) */
// rotta per creare una nuova piattaforma
router.post("/", platformsController.store);

/* update */
// rotta per modificare una piattaforma esistente in modo integrale
router.put("/:id", platformsController.update);

/* modify */
// rotta per modificare una piattaforma esistente in modo parziale
router.patch("/:id", platformsController.modify);

/* destroy */
// rotta per cancellare una piattaforma esistente
router.delete("/:id", platformsController.destroy);

// esportiamo router
export default router;
