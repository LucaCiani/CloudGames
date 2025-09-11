export default function ThankYouPage() {
  return (
    <div className="d-flex flex-column justify-content-center align-items-center w-100 h-100 py-5 my-5 text-center">
      <h1 className="display-4">Grazie per il tuo acquisto!</h1>
      <p className="lead">
        Il tuo ordine è stato ricevuto con successo.
        <br />
        Controlla le email per i dettagli.
      </p>
      <a href="/" className="btn-gradient">
        Torna alla Home
      </a>
    </div>
  );
}
