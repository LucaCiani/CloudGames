
# 📄 Specifiche di progetto – CloudGames

## 👥 Clienti del sito

- **Target:** appassionati di videogiochi di tutte le età, sia casual che hardcore gamer.
- **Obiettivo:** offrire un’esperienza di acquisto semplice, moderna e ricca di funzionalità extra.


---

## ⚙️ Scelte implementative

- **Stack tecnologico:**  
  - **Frontend:** React, React Router, Bootstrap per la UI, CSS custom.
  - **Backend:** Node.js con Express, MySQL per la persistenza dati.
  - **AI:** integrazione con OpenAI per chatbot/assistente virtuale.
  - **Email:** invio tramite Mailtrap per test e sviluppo.
- **Struttura:**  
  - Separazione netta tra frontend (`react`) e backend (`express`).
  - API RESTful per tutte le operazioni (prodotti, carrello, ordini, chat).
  - Gestione stato frontend con hook React.
  - Query SQL dinamiche in base ai filtri e alle richieste utente.
- **Sicurezza:**  
  - Validazione dati lato backend.+
  - Disabilitazione acquisto per prodotti esauriti.
  - Codici sconto validi solo in determinati periodi.

---

## 🛒 Caratteristiche principali dell’ecommerce

- Homepage con hero e sezioni prodotti.
- Ricerca avanzata con filtri (genere, piattaforma, prezzo, promozioni).
- Visualizzazione risultati in griglia o lista.
- Pagina dettaglio prodotto con correlati.
- Carrello con gestione quantità e controllo disponibilità.
- Checkout con inserimento dati cliente e riepilogo ordine.
- Invio email di conferma ordine (Mailtrap).
- Codici sconto e prodotti in promozione.
- Paginazione e selezione numero risultati per pagina.
- Popup di benvenuto con raccolta email.
- Assistente AI/chatbot integrato.


---

## 🚩 Milestone raggiunte

- Tutte le milestone obbligatorie completate.
- Extra completati: doppia visualizzazione, prodotti in promozione, codici sconto, paginazione dei risultati, prodotti correlati, popup benvenuto, gestione quantità, assistente AI.


---

## 💡 Funzionalità future

- Integrazione pagamento reale (es. Stripe/PayPal).
- Miglioramento sistema di raccomandazione AI.
- Notifiche push per offerte e novità.
- Dashboard amministratore per gestione prodotti e ordini.
- Statistiche avanzate per vendite e preferenze utenti.
- Recensioni utenti e sistema di rating.
- Wishlist.

---

