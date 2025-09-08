// Importiamo express e il middleware json per il body parsing
import express, { json } from "express";

// Importiamo cors per gestire le richieste da domini diversi
import cors from "cors";

// Creiamo un'applicazione express
const app = express();

// Recuperiamo la porta dalle variabili d'ambiente
const port = process.env.port;

// middleware per gestire le richieste a rotte non esistenti e errore server
import { serverError, notFound } from "./middlewares/middleware.js";

// importiamo i router
import videogamesRoute from "./routers/videogamesRoute.js";
import invoicesRoute from "./routers/invoicesRoute.js";
import discountsRoute from "./routers/discountsRoute.js";
import billingAddressesRoute from "./routers/billingAddressesRoute.js";
import genresRoute from "./routers/genresRoute.js";
import mediaRoute from "./routers/mediaRoute.js";

// Registriamo il body-parser integrato in express
app.use(json());

// Abilitiamo CORS per permettere richieste da client esterni
app.use(cors());

// definiamo la prima rotta
app.get("/", (req, res) => {
  res.redirect("https://youtu.be/dQw4w9WgXcQ");
});

// Definiamo le rotte principali dell’app
app.use("/videogames", videogamesRoute);
app.use("/invoices", invoicesRoute);
app.use("/discounts", discountsRoute);
app.use("/billing-addresses", billingAddressesRoute);
app.use("/genres", genresRoute);
app.use("/media", mediaRoute);

// registro le middleware
app.use(notFound);
app.use(serverError);

// mettiamo il server in ascolto
app.listen(port, () => {
  console.log(`Server in ascolto sulla porta ${port}`);
});
