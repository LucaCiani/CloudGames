import "../aboutus.css";

export default function AboutUsPage() {
  const teamMembers = [
    { name: "Luca", role: "Lead Developer", github: "LucaCiani" },
    { name: "Umberto", role: "Frontend Developer", github: "UmbertoCarbone" },
    { name: "Alessandro", role: "Backend Developer", github: "angelo-lepore" },
    { name: "Giulia", role: "UI/UX Designer", github: "francescoboschelle" },
    { name: "Davide", role: "DevOps Engineer", github: "simone-scotto" },
  ];

  return (
    <section className="aboutus-section">
      <div className="aboutus-container">
        <h1 className="aboutus-title">Chi siamo</h1>

        <p className="aboutus-paragraph">
          Siamo 5 programmatori appassionati di videogiochi che hanno deciso di
          creare un ecommerce dedicato a tutti i gamer. La nostra missione è
          offrire la migliore esperienza di acquisto possibile per ogni
          appassionato di gaming.
        </p>

        <p className="aboutus-paragraph">
          I nostri server sono potenti e sicuri, progettati per garantire
          prestazioni elevate e la massima affidabilità in ogni momento. La
          sicurezza dei dati e la velocità di navigazione sono le nostre
          priorità assolute per offrirti un'esperienza di shopping senza
          compromessi.
        </p>

        <h2 className="aboutus-subtitle">I nostri punti di forza</h2>

        <div className="aboutus-points">
          <div className="aboutus-point">
            <h4>🎮 Ampia selezione</h4>
            <p>Migliaia di videogiochi per tutte le piattaforme e generi</p>
          </div>
          <div className="aboutus-point">
            <h4>⚡ Server performanti</h4>
            <p>Infrastruttura cloud avanzata per massime prestazioni</p>
          </div>
          <div className="aboutus-point">
            <h4>🔄 Team aggiornato</h4>
            <p>Sempre al passo con le ultime novità del gaming</p>
          </div>
          <div className="aboutus-point">
            <h4>🚀 Assistenza rapida</h4>
            <p>Support team dedicato disponibile 24/7</p>
          </div>
        </div>

        <div className="github-section">
          <h3 className="github-title">Il nostro team su GitHub</h3>
          <div className="github-container">
            {teamMembers.map((member) => (
              <div className="github-member">
                <a
                  href={`https://github.com/${member.github}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="github-link"
                >
                  <img
                    src={`https://github.com/${member.github}.png?size=160`}
                    alt={`${member.name} GitHub Avatar`}
                    className="github-avatar"
                  />
                  <div className="github-name">{member.name}</div>
                  <div className="github-role">{member.role}</div>
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
