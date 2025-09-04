// importiamo express
const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.port;

// middleware per gestire le richieste a rotte non esistenti (errore 404)
const notFound = require("./middlewares/notFound");

// middleware per la gestione centralizzata degli errori
const serverError = require("./middlewares/serverError");

// importiamo router
const videogamesRoute = require("./routers/videogamesRoute");

// registro il body-parser
app.use(express.json());

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
