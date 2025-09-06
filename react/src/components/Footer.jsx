import '@fortawesome/fontawesome-free/css/all.min.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {

  faInstagram,
  faFacebook,
  faDiscord,
  faXTwitter,
  faYoutube,
  faGithub
} from "@fortawesome/free-brands-svg-icons";


export default function Footer() {
  return (
    <>


      <div >
        <div>
          <div className="row row-cols-1 row-cols-md-4 justify-content-between" style={{ margin: 0 }} >
            <div className="col d-flex justify-content-center align-items-center" style={{ padding: 0 }}>
              <img src="/processed_image.png" alt="" style={{ width: "50%" }} />

            </div>


            <div className="col-md-6 ">
              <div className="row row-cols-1 row-cols-md-2 ">

                <div className="col d-flex align-items-center">
                  <ul className='payment-methods d-flex justify-content-between '>
                    <li><i class="fa-brands fa-cc-visa"></i></li>
                    <li><i class="fa-brands fa-paypal"></i></li>
                    <li><i class="fa-brands fa-google-pay"></i></li>
                    <li><i class="fa-brands fa-apple-pay"></i></li>
                    <li><i class="fa-brands fa-bitcoin"></i></li>
                  </ul>
                </div>
                <div className="col-6 mx-auto">
                  <img src="/trustpilot.png" alt="trustpilot" style={{ width: "100%" }} />
                </div>
              </div>
              <hr />

              <div className="row d-flex justify-content-between">
                <div className="col-6 d-flex justify-content-center">

                  <ul>
                    <li><h3>About</h3></li>
                    <li>Informativa sulla privacy</li>
                    <li>Cookie policy</li>
                    <li>Contatti</li>
                    <li>Chi Siamo</li>
                    <li>Note Legali</li>
                  </ul>
                </div>
                <div className="col-6 d-flex justify-content-center">

                  <ul>
                    <li><h3>Informazioni</h3></li>
                    <li>Politica di rimborso</li>
                    <li>Assistenza Clienti</li>
                    <li>Faq</li>
                    <li>Termini e Condizioni </li>
                    <li>Spedizioni</li>


                  </ul>
                </div>
                <div className="col">
                  <h3>Follow Us</h3>


                  <div className='d-flex justify-content-between my-0'>



                    <a
                      href="https://www.instagram.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="social-button ig"
                    >
                      <FontAwesomeIcon icon={faInstagram} className="social-icon " />
                    </a>

                    <a
                      href="https://www.facebook.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="social-button fb"
                    >
                      <FontAwesomeIcon icon={faFacebook} className="social-icon " />
                    </a>

                    <a
                      href="https://discord.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="social-button discord"
                    >
                      <FontAwesomeIcon icon={faDiscord} className="social-icon " />
                    </a>

                    <a
                      href="https://twitter.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="social-button x"
                    >
                      <FontAwesomeIcon icon={faXTwitter} className="social-icon " />
                    </a>

                    <a
                      href="https://www.youtube.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="social-button youtube"
                    >
                      <FontAwesomeIcon icon={faYoutube} className="social-icon " />
                    </a>

                    <a
                      href="https://github.com/LucaCiani/CloudGames"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="social-button git"
                    >
                      <FontAwesomeIcon icon={faGithub} className="social-icon " />
                    </a>
                  </div>



                </div>
              </div>
              <hr />
              <p>© 2025 Evil Corporation. Tutti i diritti riservati. Tutti i marchi appartengono ai rispettivi proprietari negli Stati Uniti e negli altri paesi.
                IVA inclusa nel prezzo (ove applicabile)</p>

            </div>

            <div className="col d-flex justify-content-center align-items-center" style={{ padding: 0 }}>
              <img src="/cloudgames.png" alt="" style={{ width: "30%" }} />
            </div>





          </div>



        </div>

      </div>
    </>
  );
}
