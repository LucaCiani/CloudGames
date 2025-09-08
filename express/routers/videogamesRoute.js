// importiamo express
import { Router } from "express";
const router = Router();

// importiamo le funzioni del controller
import videogamesController from "../controllers/videogamesController.js";

/* rotte CRUD */

/* index (read all) */
// rotta per ottenere tutti i videogiochi, con possibilità di filtro tramite query string
router.get("/", videogamesController.index);

/* show (read one) */
// rotte per ottenere un videogioco specifico tramite ID
router.get("/:id", videogamesController.show);

/* store */
// rotte per creare un nuovo videogioco
router.post("/", videogamesController.store);

/* update */
// rotte per modificare un videogioco esistente in modo integrale
router.put("/:id", videogamesController.update);

/* modify */
// rotte per modificare un videogioco esistente in modo parziale
router.patch("/:id", videogamesController.modify);

/* destroy */
// rotte per cancellare un videogioco esistente
router.delete("/:id", videogamesController.destroy);

// esportiamo router
export default router;
