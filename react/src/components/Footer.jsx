import "@fortawesome/fontawesome-free/css/all.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faInstagram,
  faFacebook,
  faDiscord,
  faXTwitter,
  faYoutube,
  faGithub,
} from "@fortawesome/free-brands-svg-icons";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <div className="container">
      <hr />

      <div className="row row-cols-1 row-cols-md-3 d-flex justify-content-between my-5">
        <div className="col">
          <ul>
            <li>
              <h3>About</h3>
            </li>
            <li>
              <Link to={"#"} className="text-decoration-none text-white">
                Informativa sulla privacy
              </Link>
            </li>
            <li>
              <Link to={"#"} className="text-decoration-none text-white">
                Cookie policy
              </Link>
            </li>
            <li>
              <Link to={"#"} className="text-decoration-none text-white">
                Contatti
              </Link>
            </li>
            <li>
              <Link to={"#"} className="text-decoration-none text-white">
                Chi siamo
              </Link>
            </li>
            <li>
              <Link to={"#"} className="text-decoration-none text-white">
                Note legali
              </Link>
            </li>
          </ul>
        </div>
        <div className="col">
          <ul>
            <li>
              <h3>Informazioni</h3>
            </li>
            <li>
              <Link to={"#"} className="text-decoration-none text-white">
                Politica di reso
              </Link>
            </li>
            <li>
              <Link to={"#"} className="text-decoration-none text-white">
                Assistenza clienti
              </Link>
            </li>
            <li>
              <Link to={"#"} className="text-decoration-none text-white">
                FAQ
              </Link>
            </li>
            <li>
              <Link to={"#"} className="text-decoration-none text-white">
                Termini e condizioni
              </Link>
            </li>
            <li>
              <Link to={"#"} className="text-decoration-none text-white">
                Spedizioni
              </Link>
            </li>
          </ul>
        </div>
        <div className="col">
          <ul>
            <li>
              <h3>Follow Us</h3>
            </li>
            <li>
              <Link to={"#"} className="text-decoration-none text-white">
                <div className="d-flex align-items-center gap-3">
                  <div className="social-button ig">
                    <FontAwesomeIcon
                      icon={faInstagram}
                      className="social-icon"
                    />
                  </div>
                  <p className="m-0">Instagram</p>
                </div>
              </Link>
            </li>
            <li>
              <Link to={"#"} className="text-decoration-none text-white">
                <div className="d-flex align-items-center gap-3">
                  <div className="social-button fb">
                    <FontAwesomeIcon
                      icon={faFacebook}
                      className="social-icon"
                    />
                  </div>
                  <p className="m-0">Facebook</p>
                </div>
              </Link>
            </li>
            <li>
              <Link to={"#"} className="text-decoration-none text-white">
                <div className="d-flex align-items-center gap-3">
                  <div className="social-button discord">
                    <FontAwesomeIcon icon={faDiscord} className="social-icon" />
                  </div>
                  <p className="m-0">Discord</p>
                </div>
              </Link>
            </li>
            <li>
              <Link to={"#"} className="text-decoration-none text-white">
                <div className="d-flex align-items-center gap-3">
                  <div className="social-button x">
                    <FontAwesomeIcon
                      icon={faXTwitter}
                      className="social-icon"
                    />
                  </div>
                  <p className="m-0">X / Twitter</p>
                </div>
              </Link>
            </li>
            <li>
              <Link to={"#"} className="text-decoration-none text-white">
                <div className="d-flex align-items-center gap-3">
                  <div className="social-button youtube">
                    <FontAwesomeIcon icon={faYoutube} className="social-icon" />
                  </div>
                  <p className="m-0">YouTube</p>
                </div>
              </Link>
            </li>
            <li>
              <Link to={"#"} className="text-decoration-none text-white">
                <div className="d-flex align-items-center gap-3">
                  <div className="social-button git">
                    <FontAwesomeIcon icon={faGithub} className="social-icon" />
                  </div>
                  <p className="m-0">GitHub</p>
                </div>
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <hr />
      <div className="row row-cols-1 row-cols-md-2 mb-5 ">
        <div className="col d-flex align-items-center">
          <ul className="payment-methods d-flex justify-content-between ">
            <li>
              <i className="fa-brands fa-cc-visa"></i>
            </li>
            <li>
              <i className="fa-brands fa-paypal"></i>
            </li>
            <li>
              <i className="fa-brands fa-google-pay"></i>
            </li>
            <li>
              <i className="fa-brands fa-apple-pay"></i>
            </li>
            <li>
              <i className="fa-brands fa-bitcoin"></i>
            </li>
          </ul>
        </div>
        <div className="col-6 mx-auto d-flex justify-content-end">
          <img
            src="/trustpilot.png"
            alt="trustpilot"
            style={{ width: "150px" }}
          />
        </div>
      </div>
      <hr />
      <p>© {new Date().getFullYear()} CloudGames.</p>
      <p>
        Tutti i diritti riservati. Tutti i marchi appartengono ai rispettivi
        proprietari negli Stati Uniti e negli altri paesi. IVA inclusa nel
        prezzo (ove applicabile)
      </p>
    </div>
  );
}
