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
    <>
      <div className="container-fluid bg-dark text-white pt-4">
        <div className="container">
          <hr />

          {/* Sezione principale con 3 colonne responsive */}
          <div className="row my-4">
            {/* Colonna About */}
            <div className="col-12 col-md-4 mb-4">
              <h3 className="mb-3">About</h3>
              <ul className="list-unstyled">
                <li className="mb-2">
                  <Link to="#" className="text-decoration-none text-white">
                    Informativa sulla privacy
                  </Link>
                </li>
                <li className="mb-2">
                  <Link to="#" className="text-decoration-none text-white">
                    Cookie policy
                  </Link>
                </li>
                <li className="mb-2">
                  <Link to="#" className="text-decoration-none text-white">
                    Contatti
                  </Link>
                </li>
                <li className="mb-2">
                  <Link to="#" className="text-decoration-none text-white">
                    Chi siamo
                  </Link>
                </li>
                <li className="mb-2">
                  <Link to="#" className="text-decoration-none text-white">
                    Note legali
                  </Link>
                </li>
              </ul>
            </div>

            {/* Colonna Informazioni */}
            <div className="col-12 col-md-4 mb-4">
              <h3 className="mb-3">Informazioni</h3>
              <ul className="list-unstyled">
                <li className="mb-2">
                  <Link to="#" className="text-decoration-none text-white">
                    Politica di reso
                  </Link>
                </li>
                <li className="mb-2">
                  <Link to="#" className="text-decoration-none text-white">
                    Assistenza clienti
                  </Link>
                </li>
                <li className="mb-2">
                  <Link to="#" className="text-decoration-none text-white">
                    FAQ
                  </Link>
                </li>
                <li className="mb-2">
                  <Link to="#" className="text-decoration-none text-white">
                    Termini e condizioni
                  </Link>
                </li>
                <li className="mb-2">
                  <Link to="#" className="text-decoration-none text-white">
                    Spedizioni
                  </Link>
                </li>
              </ul>
            </div>

            {/* Colonna Follow Us */}
            <div className="col-12 col-md-4 mb-4">
              <h3 className="mb-3">Follow Us</h3>
              <div className="d-flex flex-column gap-2">
                <Link to="#" className="text-decoration-none text-white">
                  <div className="d-flex align-items-center gap-3">
                    <div className="social-button ig">
                      <FontAwesomeIcon
                        icon={faInstagram}
                        className="social-icon"
                      />
                    </div>
                    <span>Instagram</span>
                  </div>
                </Link>

                <Link to="#" className="text-decoration-none text-white">
                  <div className="d-flex align-items-center gap-3">
                    <div className="social-button fb">
                      <FontAwesomeIcon
                        icon={faFacebook}
                        className="social-icon"
                      />
                    </div>
                    <span>Facebook</span>
                  </div>
                </Link>

                <Link to="#" className="text-decoration-none text-white">
                  <div className="d-flex align-items-center gap-3">
                    <div className="social-button discord">
                      <FontAwesomeIcon
                        icon={faDiscord}
                        className="social-icon"
                      />
                    </div>
                    <span>Discord</span>
                  </div>
                </Link>

                <Link to="#" className="text-decoration-none text-white">
                  <div className="d-flex align-items-center gap-3">
                    <div className="social-button x">
                      <FontAwesomeIcon
                        icon={faXTwitter}
                        className="social-icon"
                      />
                    </div>
                    <span>X / Twitter</span>
                  </div>
                </Link>

                <Link to="#" className="text-decoration-none text-white">
                  <div className="d-flex align-items-center gap-3">
                    <div className="social-button youtube">
                      <FontAwesomeIcon
                        icon={faYoutube}
                        className="social-icon"
                      />
                    </div>
                    <span>YouTube</span>
                  </div>
                </Link>
                <Link to="#" className="text-decoration-none text-white">
                  <div className="d-flex align-items-center gap-3">
                    <div className="social-button git">
                      <FontAwesomeIcon
                        icon={faGithub}
                        className="social-icon"
                      />
                    </div>
                    <span>GitHub</span>
                  </div>
                </Link>
              </div>
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
          {/* Copyright responsive */}
          <div className="pb-4 text-center text-md-start">
            <p className="mb-2">© {new Date().getFullYear()} CloudGames.</p>
            <p className="mb-0  text-white">
              Tutti i diritti riservati. Tutti i marchi appartengono ai
              rispettivi proprietari negli Stati Uniti e negli altri paesi. IVA
              inclusa nel prezzo (ove applicabile)
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
