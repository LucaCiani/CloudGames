// importiamo express
import express, { json } from "express";
import cors from "cors";
const app = express();
const port = process.env.port;

// middleware per gestire le richieste a rotte non esistenti (errore 404)
import notFound from "./middlewares/notFound.js";

// middleware per la gestione centralizzata degli errori
import serverError from "./middlewares/serverError.js";

// importiamo router
import videogamesRoute from "./routers/videogamesRoute.js";

// registro il body-parser
app.use(json());

app.use(cors());

// definiamo la prima rotta
app.get("/", (req, res) => {
  res.send("Server del mio blog");
});

// indichiamo con use che esistono nuove rotte
app.use("/videogames", videogamesRoute);

// registro le middleware
app.use(notFound);
app.use(serverError);

// mettiamo il server in ascolto
app.listen(port, () => {
  console.log(`Server in ascolto sulla porta ${port}`);
});
