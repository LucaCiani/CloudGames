// Importiamo express e il middleware json per il body parsing
import express, { json } from "express";

// Importiamo cors per gestire le richieste da domini diversi
import cors from "cors";

// Creiamo un'applicazione express
const app = express();

// Recuperiamo la porta dalle variabili d'ambiente
const port = process.env.port;

// middleware per gestire le richieste a rotte non esistenti (errore 404)
import notFound from "./middlewares/notFound.js";

// middleware per la gestione centralizzata degli errori (errore 500)
import serverError from "./middlewares/serverError.js";

// importiamo i router
import videogamesRoute from "./routers/videogamesRoute.js";
import invoicesRoute from "./routers/invoicesRoute.js";
import discountsRoute from "./routers/discountsRoute.js";

// Registriamo il body-parser integrato in express
app.use(json());

//// Abilitiamo CORS per permettere richieste da client esterni
app.use(cors());

// definiamo la prima rotta
app.get("/", (req, res) => {
  res.send("Server del mio blog");
});

// Definiamo le rotte principali dell’app
app.use("/videogames", videogamesRoute);
app.use("/invoices", invoicesRoute);
app.use("/discounts", discountsRoute);

// registro le middleware
app.use(notFound);
app.use(serverError);

// mettiamo il server in ascolto
app.listen(port, () => {
  console.log(`Server in ascolto sulla porta ${port}`);
});
